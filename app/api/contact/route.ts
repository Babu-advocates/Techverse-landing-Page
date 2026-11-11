import { NextResponse } from 'next/server';
import { Resend } from 'resend';

type Body = {
  fullName?: string;
  company?: string;
  email?: string;
  phone?: string;
  service?: string;
  description?: string;
  timeline?: string;
  budget?: string;
  website?: string; // honeypot
};

const rateMap = new Map<string, { count: number; reset: number }>();

function rateLimit(ip: string) {
  const now = Date.now();
  const windowMs = 60_000;
  const max = 5;
  const entry = rateMap.get(ip);
  if (!entry || now > entry.reset) {
    rateMap.set(ip, { count: 1, reset: now + windowMs });
    return true;
  }
  if (entry.count >= max) return false;
  entry.count += 1;
  return true;
}

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (!rateLimit(ip)) {
      return NextResponse.json({ ok: false, error: 'Too many requests. Please try again shortly.' }, { status: 429 });
    }

    const body = (await req.json()) as Body;

    // Honeypot
    if (body.website) {
      return NextResponse.json({ ok: true });
    }

    const fullName = (body.fullName || '').trim();
    const company = (body.company || '').trim();
    const email = (body.email || '').trim();
    const phone = (body.phone || '').trim();
    const service = (body.service || '').trim();
    const description = (body.description || '').trim();
    const timeline = (body.timeline || '').trim();
    const budget = (body.budget || '').trim();

    if (!fullName || fullName.length < 2) {
      return NextResponse.json({ ok: false, error: 'Please enter your full name.' }, { status: 400 });
    }
    if (!email || !isEmail(email)) {
      return NextResponse.json({ ok: false, error: 'Please enter a valid business email.' }, { status: 400 });
    }
    if (!service) {
      return NextResponse.json({ ok: false, error: 'Please select a service.' }, { status: 400 });
    }
    if (!description || description.length < 20) {
      return NextResponse.json({ ok: false, error: 'Please provide a bit more detail about your project.' }, { status: 400 });
    }

    const to = process.env.CONTACT_TO || 'contact@techverseinfotech.com';
    const from = process.env.CONTACT_FROM || 'Techverse Website <onboarding@resend.dev>';
    const apiKey = process.env.RESEND_API_KEY;

    const text = [
      `New project inquiry from ${fullName}`,
      `Company: ${company || '—'}`,
      `Email: ${email}`,
      `Phone: ${phone || '—'}`,
      `Service: ${service}`,
      `Timeline: ${timeline || '—'}`,
      `Currency: ${body.currency || 'INR'}`,
      `Budget: ${budget || '—'}`,
      '',
      'Project description:',
      description,
    ].join('\n');

    if (!apiKey) {
      // Dev-friendly fallback: log inquiry so local testing still "works"
      console.info('[contact-inquiry]', text);
      return NextResponse.json({
        ok: true,
        mode: 'logged',
        message: 'Inquiry received. Email delivery is not configured in this environment.',
      });
    }

    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: email,
      subject: `Project inquiry: ${service} — ${fullName}`,
      text,
    });

    if (error) {
      console.error('[contact-resend]', error);
      return NextResponse.json({ ok: false, error: 'Unable to send right now. Please email us directly.' }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[contact]', err);
    return NextResponse.json({ ok: false, error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
