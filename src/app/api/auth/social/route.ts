import { NextResponse } from 'next/server';
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
    // 1. IP Rate Limiting Check
    const ipCheck = await checkIpRateLimit(ip);
    if (ipCheck.isBlocked) {
      return NextResponse.json(
        { success: false, error: ipCheck.message, blocked: true },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { provider, email, name, avatar, socialId } = body;

    if (!provider || !email) {
      await recordFailedAttempt(ip, 'Invalid social authentication payload');
      return NextResponse.json(
        { success: false, error: 'Provider and verified email are required' },
        { status: 400 }
      );
    }

    const normalizedProvider = provider.toUpperCase() === 'GOOGLE' ? 'GOOGLE' : 'FACEBOOK';
    const normalizedEmail = email.trim().toLowerCase();

    // 2. Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (user) {
      // If user registered with LOCAL (password), enforce that password accounts don't get hijacked without linking
      if (user.authProvider === 'LOCAL' && user.password) {
        // If socialId not matching or not linked:
        // Prompt user or link socialId safely
        if (!user.socialId) {
          // Link social provider to existing account
          user = await prisma.user.update({
            where: { id: user.id },
            data: {
              socialId: socialId || `social-${Date.now()}`,
              avatar: user.avatar || avatar,
            },
          });
        }
      } else if (user.authProvider !== normalizedProvider) {
        // Registered with a different social provider
        return NextResponse.json(
          {
            success: false,
            error: `This email is already associated with ${user.authProvider}. Please sign in using ${user.authProvider}.`,
          },
          { status: 400 }
        );
      }
    } else {
      // 3. User does not exist -> Create new Social Account with role CUSTOMER
      user = await prisma.user.create({
        data: {
          name: name ? name.trim() : normalizedEmail.split('@')[0],
          email: normalizedEmail,
          password: null, // Social-only account has no password
          role: 'CUSTOMER', // Strictly CUSTOMER
          authProvider: normalizedProvider,
          socialId: socialId || `social-${Date.now()}`,
          avatar: avatar || '/assets/img/others/dashboard-avater.jpg',
          status: 'Active',
        },
      });

      await logSecurityEvent({
        eventType: 'REGISTER',
        email: user.email,
        userId: user.id,
        ipAddress: ip,
        details: `Account created via social authentication (${normalizedProvider})`,
      });
    }

    if (user.status === 'Blocked') {
      return NextResponse.json(
        { success: false, error: 'This account has been suspended. Please contact customer support.' },
        { status: 403 }
      );
    }

    // 4. Create new dynamic session token
    await resetIpRateLimit(ip);
    const sessionToken = await createSession(user.id, request);

    await logSecurityEvent({
      eventType: 'LOGIN_SUCCESS',
      email: user.email,
      userId: user.id,
      ipAddress: ip,
      details: `Successful social login via ${normalizedProvider}`,
    });

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
      message: `Signed in successfully via ${normalizedProvider}!`,
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error: any) {
    console.error('Social auth error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Social authentication failed' },
      { status: 500 }
    );
  }
}
