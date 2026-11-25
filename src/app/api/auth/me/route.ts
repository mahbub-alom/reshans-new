import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SESSION_COOKIE_NAME, validateSessionToken } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    // 1. Check authorization header or HttpOnly session cookie
    const cookieStore = await cookies();
    const cookieToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    const authHeader = request.headers.get('authorization');
    const headerToken = authHeader?.startsWith('Bearer ')
      ? authHeader.substring(7)
      : authHeader;

    const token = headerToken || cookieToken;

    if (!token) {
      return NextResponse.json(
        { success: false, authenticated: false, error: 'No active session token' },
        { status: 401 }
      );
    }

    // 2. Validate token against DB
    const user = await validateSessionToken(token);
    if (!user) {
      return NextResponse.json(
        { success: false, authenticated: false, error: 'Invalid, expired, or revoked token' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      authenticated: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        gender: (user as any).gender || 'Male',
        dob: (user as any).dob || '',
        city: user.city,
        authProvider: user.authProvider,
        status: user.status,
      },
    });
  } catch (error: any) {
    console.error('Session verification error:', error);
    return NextResponse.json(
      { success: false, authenticated: false, error: 'Auth verification failed' },
      { status: 500 }
    );
  }
}
