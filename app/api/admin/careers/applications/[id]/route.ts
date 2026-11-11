import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth';
import { getApplicationDetails } from '@/lib/careers';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { errorResponse } = await requireAdminSession(req);
  if (errorResponse) return errorResponse;

  try {
    const details = await getApplicationDetails(params.id);
    if (!details) {
      return NextResponse.json({ ok: false, error: 'Application not found' }, { status: 404 });
    }
    return NextResponse.json({ ok: true, ...details });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
