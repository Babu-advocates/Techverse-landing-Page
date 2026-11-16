import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { Resend } from 'resend';

type Body = {
  fullName?: string;
  company?: string;
  email?: string;
  websiteUrl?: string;
  service?: string;
  description?: string;
  budget?: string;
  currency?: string;
  fax?: string; // honeypot
};

const rateMap = new Map<string, { count: number; reset: number }>();

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60_000; // 1 minute
  const max = 8; // allow up to 8 attempts per minute
  const entry = rateMap.get(ip);
  if (!entry || now > entry.reset) {
    rateMap.set(ip, { count: 1, reset: now + windowMs });
    return true;
  }
  if (entry.count >= max) return false;
  entry.count += 1;
  return true;
}

function isEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (!rateLimit(ip)) {
      return NextResponse.json(
        { ok: false, error: 'Too many requests. Please try again in a few moments.' },
        { status: 429 }
      );
    }

    const body = (await req.json()) as Body;

    // Honeypot spam trap
    if (body.fax) {
      return NextResponse.json({ ok: true, message: 'Inquiry received.' });
    }

    const fullName = (body.fullName || '').trim();
    const company = (body.company || '').trim();
    const email = (body.email || '').trim();
    const websiteUrl = (body.websiteUrl || '').trim();
    const service = (body.service || '').trim();
    const description = (body.description || '').trim();
    const budget = (body.budget || '').trim();
    const currency = (body.currency || 'INR').trim();

    // Validation
    if (!fullName || fullName.length < 2) {
      return NextResponse.json({ ok: false, error: 'Please enter your full name.' }, { status: 400 });
    }
    if (!email || !isEmail(email)) {
      return NextResponse.json({ ok: false, error: 'Please enter a valid business email address.' }, { status: 400 });
    }
    if (!description || description.length < 10) {
      return NextResponse.json(
        { ok: false, error: 'Please share a brief description of what you are looking to build (minimum 10 characters).' },
        { status: 400 }
      );
    }

    const toEmail = process.env.CONTACT_TO || 'contact@techverseinfotech.com';

    // 1. Database persistence (zero lead loss safeguard)
    let inquiryId: string | null = null;
    try {
      const rows = await query<{ id: string }>(
        `INSERT INTO contact_inquiries (
          full_name, company, email, website_url, service, currency, budget, description, ip_address, delivery_status, delivery_provider
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'PENDING', 'FORMSUBMIT')
        RETURNING id`,
        [
          fullName,
          company || null,
          email,
          websiteUrl || null,
          service || null,
          currency,
          budget || null,
          description,
          ip,
        ]
      );
      if (rows && rows.length > 0) {
        inquiryId = rows[0].id;
      }
    } catch (dbErr) {
      // Database logging failure should never prevent email dispatch
      console.warn('[contact:db-save-warn]', dbErr);
    }

    // 2. Dispatch via FormSubmit.co (100% free, zero password/API key dependency)
    let emailDispatched = false;
    let dispatchError: string | null = null;

    try {
      const formSubmitEndpoint = `https://formsubmit.co/ajax/${encodeURIComponent(toEmail)}`;
      const formSubmitRes = await fetch(formSubmitEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          _subject: `New Project Inquiry: ${service || 'General'} — ${fullName}`,
          _template: 'table',
          _captcha: 'false',
          _replyto: email,
          'Full Name': fullName,
          'Company Name': company || '—',
          'Business Email': email,
          'Website URL': websiteUrl || '—',
          'Service Practice': service || 'General Inquiry',
          'Currency': currency,
          'Budget Range': budget || 'Not specified',
          'Project Requirements': description,
        }),
      });

      if (formSubmitRes.ok) {
        emailDispatched = true;
      } else {
        const errText = await formSubmitRes.text().catch(() => '');
        dispatchError = `FormSubmit responded with HTTP ${formSubmitRes.status}: ${errText}`;
        console.error('[contact:formsubmit-error]', dispatchError);
      }
    } catch (fsErr: any) {
      dispatchError = fsErr?.message || 'FormSubmit request failed';
      console.error('[contact:formsubmit-exception]', fsErr);
    }

    // 3. Fallback: If RESEND_API_KEY is configured in the environment, also send via Resend
    if (!emailDispatched && process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const fromEmail = process.env.CONTACT_FROM || 'Techverse Website <onboarding@resend.dev>';
        const { error: resendErr } = await resend.emails.send({
          from: fromEmail,
          to: [toEmail],
          replyTo: email,
          subject: `New Project Inquiry: ${service || 'General'} — ${fullName}`,
          text: [
            `New Project Inquiry from ${fullName}`,
            `Company: ${company || '—'}`,
            `Email: ${email}`,
            `Website: ${websiteUrl || '—'}`,
            `Service: ${service || '—'}`,
            `Currency: ${currency}`,
            `Budget: ${budget || '—'}`,
            '',
            'Project Requirements:',
            description,
          ].join('\n'),
        });

        if (!resendErr) {
          emailDispatched = true;
        }
      } catch (rErr) {
        console.error('[contact:resend-fallback-error]', rErr);
      }
    }

    // 4. Update delivery status in database
    if (inquiryId) {
      const finalStatus = emailDispatched ? 'SENT' : 'DISPATCH_PENDING';
      query(`UPDATE contact_inquiries SET delivery_status = $1 WHERE id = $2`, [finalStatus, inquiryId]).catch(
        () => {}
      );
    }

    // Always provide friendly user feedback
    return NextResponse.json({
      ok: true,
      message: 'Thank you. Your project inquiry has been received. Our technical team will review and reply within 24–48 hours.',
    });
  } catch (err) {
    console.error('[contact:unhandled-error]', err);
    return NextResponse.json(
      {
        ok: false,
        error: 'Unable to process inquiry right now. Please email us directly at contact@techverseinfotech.com.',
      },
      { status: 500 }
    );
  }
}
