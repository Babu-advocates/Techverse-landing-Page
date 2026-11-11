import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth';
import { assignApplication } from '@/lib/careers';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { errorResponse } = await requireAdminSession(req, ['super_admin', 'hr_admin']);
  if (errorResponse) return errorResponse;

  try {
    const { recruiter_id } = await req.json();
    await assignApplication(params.id, recruiter_id || null);
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  }
}
