import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyPassword, signAdminToken, setAdminSessionCookie } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ ok: false, error: 'Email and password are required.' }, { status: 400 });
    }

    const rows = await query(
      `SELECT id, email, password_hash, full_name, role, status 
       FROM admin_users 
       WHERE email = $1 AND status = 'ACTIVE' 
       LIMIT 1`,
      [email.toLowerCase().trim()]
    );

    if (rows.length === 0) {
      return NextResponse.json({ ok: false, error: 'Invalid email or password.' }, { status: 401 });
    }

    const admin = rows[0];
    const passwordValid = await verifyPassword(password, admin.password_hash);

    if (!passwordValid) {
      return NextResponse.json({ ok: false, error: 'Invalid email or password.' }, { status: 401 });
    }

    const token = await signAdminToken({
      id: admin.id,
      email: admin.email,
      fullName: admin.full_name,
      role: admin.role,
    });

    const response = NextResponse.json({
      ok: true,
      user: {
        id: admin.id,
        email: admin.email,
        fullName: admin.full_name,
        role: admin.role,
      },
    });

    setAdminSessionCookie(response, token);
    return response;
  } catch (error: any) {
    console.error('[admin/auth/login] Error:', error);
    return NextResponse.json({ ok: false, error: 'Internal server error during authentication.' }, { status: 500 });
  }
}
