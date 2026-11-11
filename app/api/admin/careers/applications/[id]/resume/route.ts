import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth';
import { query } from '@/lib/db';
import { getResumeFileBuffer } from '@/lib/storage';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { errorResponse } = await requireAdminSession(req);
  if (errorResponse) return errorResponse;

  try {
    const rows = await query(
      `SELECT resume_file_path, resume_original_name, resume_mime_type 
       FROM job_applications 
       WHERE id = $1`,
      [params.id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ ok: false, error: 'Application record not found.' }, { status: 404 });
    }

    const { resume_file_path, resume_original_name, resume_mime_type } = rows[0];
    const { buffer } = getResumeFileBuffer(resume_file_path);

    const safeName = encodeURIComponent(resume_original_name || 'candidate-resume.pdf');

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': resume_mime_type || 'application/pdf',
        'Content-Disposition': `inline; filename="${safeName}"`,
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
      },
    });
  } catch (error: any) {
    console.error('[admin/careers/resume] Error:', error);
    return NextResponse.json({ ok: false, error: error.message || 'Unable to retrieve resume file.' }, { status: 404 });
  }
}
