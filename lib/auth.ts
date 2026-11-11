import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { query } from './db';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'techverse_recruitment_jwt_secret_key_2026_super_secure_auth_token'
);

export const COOKIE_NAME = 'tv_admin_session';
const SESSION_DURATION_SECONDS = 7 * 24 * 60 * 60; // 7 days

export type AdminUserSession = {
  id: string;
  email: string;
  fullName: string;
  role: 'super_admin' | 'hr_admin' | 'recruiter' | 'viewer';
};

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export async function signAdminToken(user: AdminUserSession): Promise<string> {
  return new SignJWT({
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(JWT_SECRET);
}

export async function verifyAdminToken(token: string): Promise<AdminUserSession | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      id: payload.id as string,
      email: payload.email as string,
      fullName: payload.fullName as string,
      role: payload.role as AdminUserSession['role'],
    };
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<AdminUserSession | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifyAdminToken(token);
  } catch {
    return null;
  }
}

export async function getAdminSessionFromRequest(req: NextRequest): Promise<AdminUserSession | null> {
  const token = req.cookies.get(COOKIE_NAME)?.value || req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return null;
  return await verifyAdminToken(token);
}

export async function requireAdminSession(
  req?: NextRequest,
  allowedRoles?: Array<AdminUserSession['role']>
): Promise<{ user: AdminUserSession | null; errorResponse: NextResponse | null }> {
  const user = req ? await getAdminSessionFromRequest(req) : await getAdminSession();

  if (!user) {
    return {
      user: null,
      errorResponse: NextResponse.json({ ok: false, error: 'Unauthorized. Admin session required.' }, { status: 401 }),
    };
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return {
      user: null,
      errorResponse: NextResponse.json(
        { ok: false, error: `Forbidden. Role '${user.role}' lacks permission for this action.` },
        { status: 403 }
      ),
    };
  }

  return { user, errorResponse: null };
}

export function setAdminSessionCookie(response: NextResponse, token: string): void {
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export function clearAdminSessionCookie(response: NextResponse): void {
  response.cookies.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}
