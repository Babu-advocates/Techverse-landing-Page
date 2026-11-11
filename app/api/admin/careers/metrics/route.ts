import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth';
import { getRecruitmentMetrics } from '@/lib/careers';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { errorResponse } = await requireAdminSession(req);
  if (errorResponse) return errorResponse;

  try {
    const metrics = await getRecruitmentMetrics();
    return NextResponse.json({ ok: true, metrics });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
