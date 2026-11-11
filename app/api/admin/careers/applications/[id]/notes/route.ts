import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth';
import { addApplicationNote } from '@/lib/careers';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { user, errorResponse } = await requireAdminSession(req, ['super_admin', 'hr_admin', 'recruiter']);
  if (errorResponse || !user) return errorResponse;

  try {
    const { note } = await req.json();
    if (!note || !note.trim()) {
      return NextResponse.json({ ok: false, error: 'Note cannot be empty.' }, { status: 400 });
    }

    const createdNote = await addApplicationNote(params.id, note, { id: user.id, fullName: user.fullName });
    return NextResponse.json({ ok: true, note: createdNote }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  }
}
