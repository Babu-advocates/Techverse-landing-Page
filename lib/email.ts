import { Resend } from 'resend';
import { query } from './db';

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;

const FROM_EMAIL = process.env.CAREERS_FROM || 'Techverse Careers <careers@techverseinfotech.com>';
const ADMIN_NOTIFICATION_EMAIL = process.env.CAREERS_TO || 'careers@techverseinfotech.com';

type SendEmailParams = {
  applicationId?: string;
  to: string;
  subject: string;
  html: string;
  type: string;
};

export async function sendRecruitmentEmail({
  applicationId,
  to,
  subject,
  html,
  type,
}: SendEmailParams): Promise<{ ok: boolean; messageId?: string; error?: string }> {
  let deliveryStatus: 'SENT' | 'FAILED' | 'SIMULATED' = 'SENT';
  let errorMessage: string | null = null;
  let messageId: string | undefined;

  try {
    if (!resend) {
      console.info(`[recruitment-email:simulated] To: ${to} | Subject: ${subject} | Type: ${type}`);
      deliveryStatus = 'SIMULATED';
    } else {
      const { data, error } = await resend.emails.send({
        from: FROM_EMAIL,
        to: [to],
        subject,
        html,
      });

      if (error) {
        throw new Error(error.message);
      }
      messageId = data?.id;
    }
  } catch (err: any) {
    deliveryStatus = 'FAILED';
    errorMessage = err.message || 'Unknown email delivery error';
    console.error(`[recruitment-email:error] Failed sending ${type} to ${to}:`, errorMessage);
  }

  // Log in recruitment_notifications table (fail-safe)
  try {
    await query(
      `INSERT INTO recruitment_notifications (application_id, recipient, notification_type, subject, delivery_status, error_message, sent_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
      [applicationId || null, to, type, subject, deliveryStatus, errorMessage]
    );
  } catch (dbErr) {
    console.error('[recruitment-email:db-log-fail]', dbErr);
  }

  return { ok: deliveryStatus !== 'FAILED', messageId, error: errorMessage || undefined };
}

// 1. Applicant Confirmation Email Template
export function getApplicantConfirmationHtml(data: {
  fullName: string;
  jobTitle: string;
  referenceNumber: string;
}): string {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; background: #ffffff; color: #111113; border: 1px solid #e5e7eb; border-radius: 16px;">
      <div style="margin-bottom: 24px;">
        <span style="display: inline-block; font-weight: 700; font-size: 18px; color: #7c3aed; letter-spacing: -0.02em;">TECHVERSE INFOTECH</span>
      </div>
      <h2 style="font-size: 22px; font-weight: 700; color: #111113; margin: 0 0 12px;">Application Received</h2>
      <p style="font-size: 15px; line-height: 1.6; color: #4b5563; margin: 0 0 20px;">
        Dear <strong>${data.fullName}</strong>,<br/><br/>
        Thank you for applying for the position of <strong>${data.jobTitle}</strong> at Techverse Infotech. We have received your application documents and technical profile.
      </p>
      
      <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 18px; margin-bottom: 24px;">
        <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #6b7280; margin-bottom: 4px;">Your Tracking Reference</div>
        <div style="font-size: 20px; font-weight: 700; font-family: monospace; color: #7c3aed;">${data.referenceNumber}</div>
      </div>

      <p style="font-size: 14px; line-height: 1.6; color: #4b5563; margin: 0 0 20px;">
        <strong>What happens next?</strong><br/>
        Our recruitment and engineering teams review every submission carefully. If your experience and skillset align with our current hiring requirements, a recruiter will reach out directly to schedule an introductory conversation.
      </p>

      <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; font-size: 12.5px; color: #9ca3af;">
        <p style="margin: 0;">Techverse Infotech — Engineering Tomorrow's Digital Platforms.</p>
        <p style="margin: 4px 0 0;">Please keep your tracking reference handy for any future correspondence.</p>
      </div>
    </div>
  `;
}

// 2. Admin Alert for New Application
export function getAdminApplicationAlertHtml(data: {
  fullName: string;
  email: string;
  phone: string;
  jobTitle: string;
  experienceYears: number;
  referenceNumber: string;
  adminUrl: string;
}): string {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 28px 24px; background: #ffffff; color: #111113; border: 1px solid #e5e7eb; border-radius: 16px;">
      <h2 style="font-size: 20px; font-weight: 700; color: #111113; margin: 0 0 16px;">New Candidate Application Received</h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
        <tr style="border-bottom: 1px solid #f3f4f6;"><td style="padding: 8px 0; color: #6b7280;">Reference:</td><td style="padding: 8px 0; font-weight: 600; font-family: monospace; color: #7c3aed;">${data.referenceNumber}</td></tr>
        <tr style="border-bottom: 1px solid #f3f4f6;"><td style="padding: 8px 0; color: #6b7280;">Candidate:</td><td style="padding: 8px 0; font-weight: 600;">${data.fullName}</td></tr>
        <tr style="border-bottom: 1px solid #f3f4f6;"><td style="padding: 8px 0; color: #6b7280;">Role:</td><td style="padding: 8px 0; font-weight: 600;">${data.jobTitle}</td></tr>
        <tr style="border-bottom: 1px solid #f3f4f6;"><td style="padding: 8px 0; color: #6b7280;">Experience:</td><td style="padding: 8px 0;">${data.experienceYears} Years</td></tr>
        <tr style="border-bottom: 1px solid #f3f4f6;"><td style="padding: 8px 0; color: #6b7280;">Email:</td><td style="padding: 8px 0;">${data.email}</td></tr>
        <tr><td style="padding: 8px 0; color: #6b7280;">Phone:</td><td style="padding: 8px 0;">${data.phone}</td></tr>
      </table>

      <a href="${data.adminUrl}" style="display: inline-block; background: #111113; color: #ffffff; padding: 12px 24px; border-radius: 999px; text-decoration: none; font-size: 14px; font-weight: 600;">
        Review in Admin Dashboard →
      </a>
    </div>
  `;
}

// 3. Interview Scheduled Notification
export function getInterviewScheduledHtml(data: {
  fullName: string;
  jobTitle: string;
  interviewRound: string;
  date: string;
  startTime: string;
  endTime: string;
  interviewMode: string;
  meetingLinkOrVenue: string;
  interviewer: string;
}): string {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; background: #ffffff; color: #111113; border: 1px solid #e5e7eb; border-radius: 16px;">
      <div style="margin-bottom: 24px;">
        <span style="display: inline-block; font-weight: 700; font-size: 18px; color: #7c3aed; letter-spacing: -0.02em;">TECHVERSE INFOTECH</span>
      </div>
      <h2 style="font-size: 22px; font-weight: 700; color: #111113; margin: 0 0 12px;">Interview Invitation</h2>
      <p style="font-size: 15px; line-height: 1.6; color: #4b5563; margin: 0 0 20px;">
        Dear <strong>${data.fullName}</strong>,<br/><br/>
        We are pleased to invite you for an interview for the position of <strong>${data.jobTitle}</strong>.
      </p>

      <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <h3 style="font-size: 16px; font-weight: 700; margin: 0 0 12px; color: #111113;">Interview Details</h3>
        <p style="margin: 6px 0; font-size: 14px;"><strong>Round:</strong> ${data.interviewRound}</p>
        <p style="margin: 6px 0; font-size: 14px;"><strong>Date:</strong> ${data.date}</p>
        <p style="margin: 6px 0; font-size: 14px;"><strong>Time:</strong> ${data.startTime} – ${data.endTime}</p>
        <p style="margin: 6px 0; font-size: 14px;"><strong>Mode:</strong> ${data.interviewMode}</p>
        <p style="margin: 6px 0; font-size: 14px;"><strong>Interviewer:</strong> ${data.interviewer}</p>
        <p style="margin: 6px 0; font-size: 14px;"><strong>Link / Venue:</strong> <a href="${data.meetingLinkOrVenue}" style="color: #7c3aed;">${data.meetingLinkOrVenue}</a></p>
      </div>

      <p style="font-size: 14px; line-height: 1.6; color: #4b5563; margin: 0 0 20px;">
        Please make sure your camera and microphone are tested prior to the meeting. If you need to reschedule or have questions, reply directly to this email.
      </p>

      <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; font-size: 12.5px; color: #9ca3af;">
        <p style="margin: 0;">Techverse Infotech Recruitment Team</p>
      </div>
    </div>
  `;
}
