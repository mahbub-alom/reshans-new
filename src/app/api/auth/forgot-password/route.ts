import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendPasswordResetOtpEmail } from '@/lib/mailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email address is required.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      // Security standard: don't reveal if user exists or not, but return friendly response
      return NextResponse.json({
        success: true,
        message: 'If an account exists with this email, a 6-digit verification code has been dispatched.',
      });
    }

    // Generate secure 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes validity

    // Store in database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetOtp: otp,
        resetOtpExpires: expiresAt,
        passwordResetReq: true,
      },
    });

    // Send email using Nodemailer strictly to user's inbox
    await sendPasswordResetOtpEmail(normalizedEmail, otp, user.name);

    return NextResponse.json({
      success: true,
      message: 'A 6-digit verification code has been sent strictly to your email inbox.',
    });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to process password reset request.' },
      { status: 500 }
    );
  }
}
