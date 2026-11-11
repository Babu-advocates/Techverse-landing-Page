import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

function escapeCsv(val: any): string {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

export async function GET(req: NextRequest) {
  const { errorResponse } = await requireAdminSession(req, ['super_admin', 'hr_admin']);
  if (errorResponse) return errorResponse;

  try {
    const rows = await query(`
      SELECT 
        a.application_reference,
        a.full_name,
        a.email,
        a.phone,
        a.location,
        COALESCE(j.title, 'General Application') as job_title,
        a.experience_years,
        a.current_company,
        a.current_designation,
        a.expected_salary,
        a.notice_period,
        a.highest_qualification,
        a.skills,
        a.application_status,
        a.source,
        a.submitted_at
      FROM job_applications a
      LEFT JOIN jobs j ON a.job_id = j.id
      ORDER BY a.submitted_at DESC
    `);

    const headers = [
      'Reference',
      'Candidate Name',
      'Email',
      'Phone',
      'Location',
      'Applied Position',
      'Years Experience',
      'Current Company',
      'Current Designation',
      'Expected Salary',
      'Notice Period',
      'Highest Qualification',
      'Skills',
      'Status',
      'Source',
      'Submission Date',
    ];

    const csvLines = [headers.join(',')];
    for (const r of rows) {
      csvLines.push(
        [
          escapeCsv(r.application_reference),
          escapeCsv(r.full_name),
          escapeCsv(r.email),
          escapeCsv(r.phone),
          escapeCsv(r.location),
          escapeCsv(r.job_title),
          escapeCsv(r.experience_years),
          escapeCsv(r.current_company),
          escapeCsv(r.current_designation),
          escapeCsv(r.expected_salary),
          escapeCsv(r.notice_period),
          escapeCsv(r.highest_qualification),
          escapeCsv(r.skills),
          escapeCsv(r.application_status),
          escapeCsv(r.source),
          escapeCsv(new Date(r.submitted_at).toISOString()),
        ].join(',')
      );
    }

    const csvContent = csvLines.join('\n');
    const dateStr = new Date().toISOString().split('T')[0];

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="techverse-candidate-applications-${dateStr}.csv"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
