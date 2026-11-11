import { NextRequest, NextResponse } from 'next/server';
import { getPublishedJobs, getAllDepartments } from '@/lib/careers';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const department = searchParams.get('department') || undefined;
    const employment_type = searchParams.get('employment_type') || undefined;
    const work_mode = searchParams.get('work_mode') || undefined;
    const search = searchParams.get('search') || undefined;
    const min_exp_raw = searchParams.get('min_experience');
    const min_experience = min_exp_raw ? parseInt(min_exp_raw, 10) : undefined;

    const [jobs, departments] = await Promise.all([
      getPublishedJobs({ department, employment_type, work_mode, search, min_experience }),
      getAllDepartments(),
    ]);

    return NextResponse.json({
      ok: true,
      count: jobs.length,
      jobs,
      departments,
    });
  } catch (error: any) {
    console.error('[api/careers/jobs] Error:', error);
    return NextResponse.json({ ok: false, error: 'Failed to retrieve active job openings.' }, { status: 500 });
  }
}
