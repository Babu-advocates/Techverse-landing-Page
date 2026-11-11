import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth';
import { updateJobStatus } from '@/lib/careers';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { user, errorResponse } = await requireAdminSession(req, ['super_admin', 'hr_admin']);
  if (errorResponse) return errorResponse;

  try {
    const { status } = await req.json();
    if (!['DRAFT', 'PUBLISHED', 'PAUSED', 'CLOSED'].includes(status)) {
      return NextResponse.json({ ok: false, error: 'Invalid job status' }, { status: 400 });
    }

    const job = await updateJobStatus(params.id, status, user?.id);
    return NextResponse.json({ ok: true, job });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  }
}
