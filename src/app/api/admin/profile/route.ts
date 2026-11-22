import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { v2 as cloudinary } from 'cloudinary';
import prisma from '@/lib/prisma';
import {
  SESSION_COOKIE_NAME,
  validateSessionToken,
  invalidateAllUserSessions,
  invalidateSession,
  logSecurityEvent,
  getClientIp,
} from '@/lib/auth';

// Configure cloudinary
if (process.env.CLOUDINARY_URL) {
  cloudinary.config({
    cloudinary_url: process.env.CLOUDINARY_URL,
  });
}

// Password Regex: min 8 chars, at least 1 uppercase, at least 1 lowercase, at least 1 special char
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

// Helper to authenticate caller as ADMIN
async function authenticateAdmin(request: Request) {
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  const authHeader = request.headers.get('authorization');
  const headerToken = authHeader?.startsWith('Bearer ')
    ? authHeader.substring(7)
    : authHeader;

  const token = headerToken || cookieToken;
  if (!token) return null;

  const user = await validateSessionToken(token);
  if (!user || user.role !== 'ADMIN') return null;

  return { user, token };
}

// GET: Fetch Admin's own profile and active devices/sessions
export async function GET(request: Request) {
  try {
    const auth = await authenticateAdmin(request);
    if (!auth) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    const { user, token } = auth;

    // Fetch fresh user details
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        phone: true,
        city: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!dbUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Fetch active sessions for this admin
    const sessions = await prisma.session.findMany({
      where: {
        userId: user.id,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        token: true,
        ipAddress: true,
        userAgent: true,
        createdAt: true,
        expiresAt: true,
      },
    });

    const formattedSessions = sessions.map((s) => ({
      id: s.id,
      ipAddress: s.ipAddress || 'Unknown IP',
      userAgent: s.userAgent || 'Unknown Device',
      createdAt: s.createdAt,
      isCurrent: s.token === token,
    }));

    return NextResponse.json({
      success: true,
      admin: dbUser,
      sessions: formattedSessions,
    });
  } catch (error: any) {
    console.error('Error fetching admin profile:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT: Update Admin profile (Name, Avatar, Password)
// NOTE: Admin CANNOT change email! Console role option is removed.
export async function PUT(request: Request) {
  const ip = getClientIp(request);

  try {
    const auth = await authenticateAdmin(request);
    if (!auth) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    const { user, token } = auth;
    const body = await request.json();
    const { action } = body;

    // ACTION 1: Update profile basic info (Name, Avatar)
    if (action === 'update_profile') {
      const { name, avatar } = body;
      const updateData: any = {};

      if (name && typeof name === 'string' && name.trim()) {
        updateData.name = name.trim();
      }

      if (avatar !== undefined) {
        updateData.avatar = avatar;
      }

      // Explicitly reject any attempt to modify email
      if (body.email && body.email !== user.email) {
        return NextResponse.json(
          { success: false, error: 'Admin email cannot be modified.' },
          { status: 400 }
        );
      }

      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: updateData,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatar: true,
          phone: true,
          city: true,
        },
      });

      await logSecurityEvent({
        eventType: 'ROLE_CHANGE',
        userId: user.id,
        email: user.email,
        ipAddress: ip,
        details: `Admin profile updated for ${user.email}`,
      });

      return NextResponse.json({
        success: true,
        message: 'Admin profile updated successfully',
        admin: updatedUser,
      });
    }

    // ACTION 2: Change Password with strict Regex & Bcrypt Hash
    if (action === 'change_password') {
      const { currentPassword, newPassword, confirmPassword } = body;

      if (!currentPassword || !newPassword) {
        return NextResponse.json(
          { success: false, error: 'Current password and new password are required' },
          { status: 400 }
        );
      }

      if (newPassword !== confirmPassword) {
        return NextResponse.json(
          { success: false, error: 'New password and confirm password do not match' },
          { status: 400 }
        );
      }

      // Validate Password Regex: 8 chars min, 1 uppercase, 1 lowercase, 1 special character
      if (!PASSWORD_REGEX.test(newPassword)) {
        return NextResponse.json(
          {
            success: false,
            error:
              'Password must be at least 8 characters long and contain at least 1 uppercase letter, 1 lowercase letter, and 1 special character.',
          },
          { status: 400 }
        );
      }

      // Fetch user with current password
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
      });

      if (!dbUser || !dbUser.password) {
        return NextResponse.json(
          { success: false, error: 'Password authentication not configured for this account' },
          { status: 400 }
        );
      }

      // Verify current password
      const isMatch = await bcrypt.compare(currentPassword, dbUser.password);
      if (!isMatch) {
        return NextResponse.json(
          { success: false, error: 'Incorrect current password' },
          { status: 400 }
        );
      }

      // Hash new password using bcrypt
      const hashedPassword = await bcrypt.hash(newPassword, 12);

      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });

      await logSecurityEvent({
        eventType: 'PASSWORD_RESET',
        userId: user.id,
        email: user.email,
        ipAddress: ip,
        details: `Admin ${user.email} changed their password securely`,
      });

      return NextResponse.json({
        success: true,
        message: 'Password changed successfully',
      });
    }

    // ACTION 3: Revoke a specific active device/session
    if (action === 'revoke_session') {
      const { sessionId } = body;
      if (!sessionId) {
        return NextResponse.json(
          { success: false, error: 'Session ID is required' },
          { status: 400 }
        );
      }

      const sessionToRevoke = await prisma.session.findUnique({
        where: { id: sessionId },
      });

      if (!sessionToRevoke || sessionToRevoke.userId !== user.id) {
        return NextResponse.json(
          { success: false, error: 'Session not found or not owned by you' },
          { status: 404 }
        );
      }

      await prisma.session.delete({
        where: { id: sessionId },
      });

      await logSecurityEvent({
        eventType: 'LOGOUT',
        userId: user.id,
        email: user.email,
        ipAddress: ip,
        details: `Revoked session ${sessionId}`,
      });

      return NextResponse.json({
        success: true,
        message: 'Device session revoked successfully',
      });
    }

    // ACTION 4: Revoke ALL OTHER device sessions (Keep only current session)
    if (action === 'revoke_other_sessions') {
      await prisma.session.deleteMany({
        where: {
          userId: user.id,
          token: { not: token },
        },
      });

      await logSecurityEvent({
        eventType: 'LOGOUT',
        userId: user.id,
        email: user.email,
        ipAddress: ip,
        details: `Revoked all other active sessions for ${user.email}`,
      });

      return NextResponse.json({
        success: true,
        message: 'All other device sessions have been logged out successfully',
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action provided' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Error in admin profile update:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
