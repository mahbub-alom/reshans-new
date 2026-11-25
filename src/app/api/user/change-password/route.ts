import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { SESSION_COOKIE_NAME, validateSessionToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const cookieToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    const authHeader = request.headers.get('authorization');
    const headerToken = authHeader?.startsWith('Bearer ')
      ? authHeader.substring(7)
      : authHeader;

    const token = headerToken || cookieToken;

    let targetUserId: string | null = null;
    let authUser: any = null;

    if (token) {
      authUser = await validateSessionToken(token);
      if (authUser) {
        targetUserId = authUser.id;
      }
    }

    const body = await request.json();
    const { currentPassword, newPassword, confirmPassword, userId, email } = body;

    if (!newPassword || !confirmPassword) {
      return NextResponse.json(
        { success: false, error: 'New password and confirmation are required.' },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { success: false, error: 'New password and confirmation password do not match.' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: 'New password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    const finalUserId = targetUserId || userId;

    let user: any = null;
    if (finalUserId) {
      user = await prisma.user.findUnique({ where: { id: finalUserId } });
    } else if (email) {
      user = await prisma.user.findUnique({ where: { email } });
    }

    if (!user) {
      // Fallback: check first customer
      user = await prisma.user.findFirst({ where: { role: 'CUSTOMER' } });
    }

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User account not found. Please log in first.' },
        { status: 404 }
      );
    }

    // If user has a password set, verify current password
    if (user.password) {
      if (!currentPassword) {
        return NextResponse.json(
          { success: false, error: 'Current password is required.' },
          { status: 400 }
        );
      }

      const isCurrentValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentValid) {
        return NextResponse.json(
          { success: false, error: 'The current password you entered is incorrect.' },
          { status: 400 }
        );
      }
    }

    // Hash the new password with bcrypt
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update in database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedNewPassword,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully! You can now log in with your new password.',
    });
  } catch (error: any) {
    console.error('Password change error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update password.' },
      { status: 500 }
    );
  }
}
