import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  SESSION_COOKIE_NAME,
  invalidateSession,
  logSecurityEvent,
  validateSessionToken,
  getClientIp,
} from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const cookieToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    const authHeader = request.headers.get('authorization');
    const headerToken = authHeader?.startsWith('Bearer ')
      ? authHeader.substring(7)
      : authHeader;

    const token = headerToken || cookieToken;

    if (token) {
      const user = await validateSessionToken(token);
      if (user) {
        await logSecurityEvent({
          eventType: 'LOGOUT',
          email: user.email,
          userId: user.id,
          ipAddress: getClientIp(request),
          details: 'User logged out and session revoked',
        });
      }
      await invalidateSession(token);
    }

    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });

    // Clear cookie
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });

    return response;
  } catch (error: any) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, error: 'Logout failed' },
      { status: 500 }
    );
  }
}
