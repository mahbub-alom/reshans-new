import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import {
  SESSION_COOKIE_NAME,
  validateSessionToken,
  invalidateAllUserSessions,
  logSecurityEvent,
  getClientIp,
} from '@/lib/auth';

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

  return user;
}

// GET: List users for Admin (supports ?type=customers or ?type=all)
export async function GET(request: Request) {
  try {
    const admin = await authenticateAdmin(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';

    // Build filter:
    // If type === 'customers': only CUSTOMER role
    // If type === 'all': exclude currently logged-in Admin's own account (per rule: "The currently logged-in Admin's own account must not appear in the All Users list")
    const whereClause: any = {};
    if (type === 'customers') {
      whereClause.role = 'CUSTOMER';
    } else {
      whereClause.id = { not: admin.id };
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        authProvider: true,
        phone: true,
        city: true,
        createdAt: true,
        updatedAt: true,
        orders: {
          select: {
            id: true,
            total: true,
            orderStatus: true,
            paymentStatus: true,
            createdAt: true,
            trackingNumber: true,
            items: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        addresses: {
          select: {
            id: true,
            title: true,
            street: true,
            city: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      status: u.status,
      authProvider: u.authProvider,
      phone: u.phone,
      city: u.city,
      ordersCount: u.orders.length,
      totalSpent: u.orders.reduce((acc, o) => acc + o.total, 0),
      createdAt: u.createdAt,
      orders: u.orders,
      addresses: u.addresses,
    }));

    return NextResponse.json({ success: true, users: formatted });
  } catch (error: any) {
    console.error('Admin users fetch error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// PATCH: Update user role, status (Block/Active), or issue password reset
export async function PATCH(request: Request) {
  const ip = getClientIp(request);

  try {
    const admin = await authenticateAdmin(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { userId, action, role, status, temporaryPassword } = body;

    if (!userId || !action) {
      return NextResponse.json(
        { success: false, error: 'Target userId and action are required' },
        { status: 400 }
      );
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser) {
      return NextResponse.json(
        { success: false, error: 'Target user not found' },
        { status: 404 }
      );
    }

    // ACTION: CHANGE ROLE (Only admin can promote/demote)
    if (action === 'CHANGE_ROLE') {
      if (role !== 'ADMIN' && role !== 'CUSTOMER') {
        return NextResponse.json(
          { success: false, error: 'Invalid role specified' },
          { status: 400 }
        );
      }

      // Rule 1: An Admin must never be able to demote their own account.
      if (targetUser.id === admin.id && role !== 'ADMIN') {
        return NextResponse.json(
          { success: false, error: 'Security Violation: An administrator cannot demote their own account.' },
          { status: 400 }
        );
      }

      // Rule 8: Ensure that at least one active Admin account always remains in the system.
      if (targetUser.role === 'ADMIN' && role === 'CUSTOMER') {
        const activeAdminsCount = await prisma.user.count({
          where: {
            role: 'ADMIN',
            status: 'Active',
            id: { not: targetUser.id },
          },
        });

        if (activeAdminsCount < 1) {
          return NextResponse.json(
            {
              success: false,
              error: 'Security Violation: Cannot demote this administrator. At least one active Administrator account must always remain in the system.',
            },
            { status: 400 }
          );
        }
      }

      const updated = await prisma.user.update({
        where: { id: userId },
        data: { role },
      });

      // Security measure: Invalidate target user's existing sessions so new role takes effect immediately
      await invalidateAllUserSessions(userId);

      await logSecurityEvent({
        eventType: 'ROLE_CHANGE',
        userId: targetUser.id,
        email: targetUser.email,
        ipAddress: ip,
        details: `Role updated from ${targetUser.role} to ${role} by Admin ${admin.email}`,
      });

      return NextResponse.json({
        success: true,
        message: `User ${targetUser.name} role changed to ${role} successfully.`,
        user: { id: updated.id, role: updated.role },
      });
    }

    // ACTION: CHANGE STATUS (Active / Blocked)
    if (action === 'CHANGE_STATUS') {
      if (status !== 'Active' && status !== 'Blocked') {
        return NextResponse.json(
          { success: false, error: 'Invalid status' },
          { status: 400 }
        );
      }

      if (targetUser.id === admin.id && status === 'Blocked') {
        return NextResponse.json(
          { success: false, error: 'You cannot block your own admin account.' },
          { status: 400 }
        );
      }

      // Check if blocking an Admin would leave 0 active Admins
      if (targetUser.role === 'ADMIN' && status === 'Blocked') {
        const activeAdminsCount = await prisma.user.count({
          where: {
            role: 'ADMIN',
            status: 'Active',
            id: { not: targetUser.id },
          },
        });

        if (activeAdminsCount < 1) {
          return NextResponse.json(
            {
              success: false,
              error: 'Security Violation: Cannot suspend this administrator. At least one active Administrator must remain.',
            },
            { status: 400 }
          );
        }
      }

      const updated = await prisma.user.update({
        where: { id: userId },
        data: { status },
      });

      if (status === 'Blocked') {
        await invalidateAllUserSessions(userId);
      }

      return NextResponse.json({
        success: true,
        message: `User status changed to ${status}.`,
        user: { id: updated.id, status: updated.status },
      });
    }

    // ACTION: RESET_PASSWORD (Assign secure temporary password or reset)
    // Admin CANNOT see the user's existing password (stored hashed)
    if (action === 'RESET_PASSWORD') {
      const newTempPassword = temporaryPassword || `Reshans@${Math.floor(100000 + Math.random() * 900000)}`;
      const hashedPassword = await bcrypt.hash(newTempPassword, 10);

      await prisma.user.update({
        where: { id: userId },
        data: {
          password: hashedPassword,
          passwordResetReq: true,
          authProvider: 'LOCAL', // Allow password login if it was previously social-only
        },
      });

      // Invalidate old sessions
      await invalidateAllUserSessions(userId);

      await logSecurityEvent({
        eventType: 'PASSWORD_RESET',
        userId: targetUser.id,
        email: targetUser.email,
        ipAddress: ip,
        details: `Password reset initiated by Admin ${admin.email}`,
      });

      return NextResponse.json({
        success: true,
        message: `Password reset successfully. A temporary password has been assigned.`,
        temporaryPassword: newTempPassword,
      });
    }

    return NextResponse.json(
      { success: false, error: 'Unknown action specified' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Admin user update error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Operation failed' },
      { status: 500 }
    );
  }
}
