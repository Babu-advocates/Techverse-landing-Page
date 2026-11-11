import { NextResponse } from 'next/server';
import { clearAdminSessionCookie } from '@/lib/auth';

export async function POST() {
  const response = NextResponse.json({ ok: true, message: 'Logged out successfully.' });
  clearAdminSessionCookie(response);
  return response;
}
