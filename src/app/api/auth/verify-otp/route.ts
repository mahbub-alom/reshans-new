import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, error: 'Email and 6-digit verification code are required.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid verification attempt or user not found.' },
        { status: 404 }
      );
    }

    // Verify OTP match
    if (!user.resetOtp || user.resetOtp !== otp.trim()) {
      return NextResponse.json(
        { success: false, error: 'Invalid 6-digit verification code. Please check your email and try again.' },
        { status: 400 }
      );
    }

    // Verify OTP expiration (10 minutes)
    if (user.resetOtpExpires && new Date() > user.resetOtpExpires) {
      return NextResponse.json(
        { success: false, error: 'Verification code has expired. Please request a new code.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Code verified successfully! You may now set your new password.',
    });
  } catch (error: any) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Verification failed.' },
      { status: 500 }
    );
  }
}
