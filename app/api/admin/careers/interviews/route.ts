import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth';
import { scheduleInterview, getApplicationDetails } from '@/lib/careers';
import { query } from '@/lib/db';
import { sendRecruitmentEmail, getInterviewScheduledHtml } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { errorResponse } = await requireAdminSession(req);
  if (errorResponse) return errorResponse;

  try {
    const rows = await query(`
      SELECT 
        i.*,
        a.full_name as candidate_name,
        a.email as candidate_email,
        j.title as job_title
      FROM interviews i
      JOIN job_applications a ON i.application_id = a.id
      LEFT JOIN jobs j ON a.job_id = j.id
      ORDER BY i.interview_date DESC, i.start_time DESC
    `);
    return NextResponse.json({ ok: true, interviews: rows });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { user, errorResponse } = await requireAdminSession(req, ['super_admin', 'hr_admin', 'recruiter']);
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    if (!body.application_id || !body.interview_date || !body.start_time || !body.end_time) {
      return NextResponse.json(
        { ok: false, error: 'Application ID, interview date, start time, and end time are required.' },
        { status: 400 }
      );
    }

    const interview = await scheduleInterview(body, user?.id);

    // Send interview scheduled email to candidate
    const details = await getApplicationDetails(body.application_id);
    if (details && details.application.email) {
      const emailHtml = getInterviewScheduledHtml({
        fullName: details.application.full_name,
        jobTitle: details.application.job_title || 'General Position',
        interviewRound: body.interview_round || 'Technical Interview',
        date: body.interview_date,
        startTime: body.start_time,
        endTime: body.end_time,
        interviewMode: body.interview_mode || 'ONLINE',
        meetingLinkOrVenue: body.meeting_link || body.venue || 'Will be shared by the recruiter prior to call',
        interviewer: body.interviewer || 'Techverse Engineering Team',
      });

      sendRecruitmentEmail({
        applicationId: body.application_id,
        to: details.application.email,
        subject: `Interview Invitation: ${details.application.job_title || 'Role'} at Techverse Infotech`,
        html: emailHtml,
        type: 'INTERVIEW_INVITATION',
      }).catch((err) => console.error('[interview-email-fail]', err));
    }

    return NextResponse.json({ ok: true, interview }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  }
}
