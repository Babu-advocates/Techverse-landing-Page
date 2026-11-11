import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth';
import { getAdminJobs, createJob } from '@/lib/careers';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { user, errorResponse } = await requireAdminSession(req);
  if (errorResponse) return errorResponse;

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || undefined;
    const department_id = searchParams.get('department_id') || undefined;
    const search = searchParams.get('search') || undefined;

    const jobs = await getAdminJobs({ status, department_id, search });
    return NextResponse.json({ ok: true, jobs });
  } catch (error: any) {
    console.error('[admin/careers/jobs:GET] Error:', error);
    return NextResponse.json({ ok: false, error: error.message || 'Failed to fetch jobs' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { user, errorResponse } = await requireAdminSession(req, ['super_admin', 'hr_admin']);
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    if (!body.title || !body.short_description || !body.description) {
      return NextResponse.json({ ok: false, error: 'Title, short description, and full description are required.' }, { status: 400 });
    }

    const job = await createJob(body, user?.id);
    return NextResponse.json({ ok: true, job }, { status: 201 });
  } catch (error: any) {
    console.error('[admin/careers/jobs:POST] Error:', error);
    return NextResponse.json({ ok: false, error: error.message || 'Failed to create job opening' }, { status: 400 });
  }
}
