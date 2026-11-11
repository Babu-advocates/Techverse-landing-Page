import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth';
import { updateApplicationStatus } from '@/lib/careers';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { user, errorResponse } = await requireAdminSession(req, ['super_admin', 'hr_admin', 'recruiter']);
  if (errorResponse) return errorResponse;

  try {
    const { status, comments } = await req.json();
    if (!status) {
      return NextResponse.json({ ok: false, error: 'Status is required.' }, { status: 400 });
    }

    const result = await updateApplicationStatus(params.id, status, comments, user ? { id: user.id, fullName: user.fullName } : undefined);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  }
}
