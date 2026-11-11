import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth';
import { getAdminApplications } from '@/lib/careers';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { errorResponse } = await requireAdminSession(req);
  if (errorResponse) return errorResponse;

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || undefined;
    const job_id = searchParams.get('job_id') || undefined;
    const search = searchParams.get('search') || undefined;
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    const result = await getAdminApplications({ status, job_id, search, limit, offset });
    return NextResponse.json({ ok: true, ...result });
  } catch (error: any) {
    console.error('[admin/careers/applications:GET] Error:', error);
    return NextResponse.json({ ok: false, error: error.message || 'Failed to fetch applications' }, { status: 500 });
  }
}
