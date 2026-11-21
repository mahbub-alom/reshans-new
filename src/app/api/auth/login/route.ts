import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import {
  SESSION_COOKIE_NAME,
  createSession,
  getClientIp,
  checkIpRateLimit,
  recordFailedAttempt,
  resetIpRateLimit,
  logSecurityEvent,
} from '@/lib/auth';

export async function POST(request: Request) {
  const ip = getClientIp(request);

  try {
    // 1. IP Rate Limiting & Temporary Block Evaluation
    const ipCheck = await checkIpRateLimit(ip);
    if (ipCheck.isBlocked) {
      return NextResponse.json(
        {
          success: false,
          error: ipCheck.message,
          blocked: true,
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      await recordFailedAttempt(ip, 'Missing email or password on login');
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 2. Fetch User dynamically from database
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      const failStatus = await recordFailedAttempt(ip, `Failed login attempt for non-existing email ${normalizedEmail}`);
      await logSecurityEvent({
        eventType: 'LOGIN_FAILED',
        email: normalizedEmail,
        ipAddress: ip,
        details: 'User does not exist',
      });

      if (failStatus.isBlocked) {
        return NextResponse.json(
          { success: false, error: failStatus.message, blocked: true },
          { status: 429 }
        );
      }

      return NextResponse.json(
        { success: false, error: 'Invalid credentials. Please verify your email and password.' },
        { status: 401 }
      );
    }

    // 3. Social account enforcement:
    // If account was created through social login without password, reject password login
    if (user.authProvider !== 'LOCAL' && !user.password) {
      await recordFailedAttempt(ip, `Password login attempted on ${user.authProvider} social account`);
      return NextResponse.json(
        {
          success: false,
          error: `This account was registered using ${user.authProvider}. Please sign in using your social account.`,
        },
        { status: 400 }
      );
    }

    // 4. Verify account active status
    if (user.status === 'Blocked') {
      return NextResponse.json(
        { success: false, error: 'This account has been suspended. Please contact customer support.' },
        { status: 403 }
      );
    }

    // 5. Compare secure password hash
    const isPasswordValid = await bcrypt.compare(password, user.password || '');
    if (!isPasswordValid) {
      const failStatus = await recordFailedAttempt(ip, `Incorrect password for ${normalizedEmail}`);
      await logSecurityEvent({
        eventType: 'LOGIN_FAILED',
        email: normalizedEmail,
        userId: user.id,
        ipAddress: ip,
        details: 'Invalid password provided',
      });

      if (failStatus.isBlocked) {
        return NextResponse.json(
          { success: false, error: failStatus.message, blocked: true },
          { status: 429 }
        );
      }

      return NextResponse.json(
        { success: false, error: 'Invalid credentials. Please verify your email and password.' },
        { status: 401 }
      );
    }

    // 6. Successful Authentication: Reset IP failure rate limit & Create dynamic session token
    await resetIpRateLimit(ip);
    const sessionToken = await createSession(user.id, request);

    await logSecurityEvent({
      eventType: 'LOGIN_SUCCESS',
      email: user.email,
      userId: user.id,
      ipAddress: ip,
      details: `Successful login as ${user.role}`,
    });

    // 7. Prepare response and set HTTP-only, Secure, SameSite Cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        city: user.city,
        authProvider: user.authProvider,
      },
      token: sessionToken,
      message: user.role === 'ADMIN' ? 'Welcome back, Administrator!' : 'Welcome back!',
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Authentication failed' },
      { status: 500 }
    );
  }
}
