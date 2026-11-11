import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth';
import { getAdminJobById, updateJob, deleteJob } from '@/lib/careers';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { errorResponse } = await requireAdminSession(req);
  if (errorResponse) return errorResponse;

  try {
    const job = await getAdminJobById(params.id);
    if (!job) {
      return NextResponse.json({ ok: false, error: 'Job not found' }, { status: 404 });
    }
    return NextResponse.json({ ok: true, job });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { user, errorResponse } = await requireAdminSession(req, ['super_admin', 'hr_admin']);
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    const job = await updateJob(params.id, body, user?.id);
    return NextResponse.json({ ok: true, job });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { user, errorResponse } = await requireAdminSession(req, ['super_admin', 'hr_admin']);
  if (errorResponse) return errorResponse;

  try {
    const deleted = await deleteJob(params.id, user?.id);
    return NextResponse.json({ ok: deleted });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
