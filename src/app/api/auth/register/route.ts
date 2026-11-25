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
    const { name, email, password, phone } = body;

    if (!name || !email || !password) {
      await recordFailedAttempt(ip, 'Missing required registration fields');
      return NextResponse.json(
        { success: false, error: 'Full name, email, and password are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const normalizedEmail = email.trim().toLowerCase();
    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    // Password strength check
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters in length.' },
        { status: 400 }
      );
    }

    // 2. Check email uniqueness at database level
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      if (existingUser.authProvider !== 'LOCAL') {
        return NextResponse.json(
          {
            success: false,
            error: `An account with this email is already registered via ${existingUser.authProvider}. Please log in with ${existingUser.authProvider}.`,
          },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { success: false, error: 'An account with this email already exists. Please log in.' },
        { status: 409 }
      );
    }

    // 3. Hash password using bcrypt (salt rounds = 10)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create user with strictly CUSTOMER role (Normal User)
    // No one can register directly as an Admin
    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        phone: phone ? phone.trim() : null,
        role: 'CUSTOMER',
        authProvider: 'LOCAL',
        avatar: '/assets/img/others/dashboard-avater.jpg',
        status: 'Active',
      },
    });

    // 5. Create session token
    await resetIpRateLimit(ip);
    const sessionToken = await createSession(newUser.id, request);

    await logSecurityEvent({
      eventType: 'REGISTER',
      email: newUser.email,
      userId: newUser.id,
      ipAddress: ip,
      details: 'Customer account registered successfully via Email/Password',
    });

    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          avatar: newUser.avatar,
          phone: newUser.phone,
          gender: (newUser as any).gender || 'Male',
          dob: (newUser as any).dob || '',
          city: newUser.city,
          authProvider: newUser.authProvider,
        },
        token: sessionToken,
        message: 'Account registered successfully! Welcome to Reshans.',
      },
      { status: 201 }
    );

    // 6. Set HTTP-only, Secure cookie
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
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Registration failed' },
      { status: 500 }
    );
  }
}
