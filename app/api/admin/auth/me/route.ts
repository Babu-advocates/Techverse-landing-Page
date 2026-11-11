import { NextRequest, NextResponse } from 'next/server';
import { getAdminSessionFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const user = await getAdminSessionFromRequest(req);
  if (!user) {
    return NextResponse.json({ ok: false, error: 'Unauthenticated.' }, { status: 401 });
  }
  return NextResponse.json({ ok: true, user });
}
