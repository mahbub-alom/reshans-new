import { cookies, headers } from 'next/headers';
import crypto from 'crypto';
import prisma from './prisma';

export const SESSION_COOKIE_NAME = 'reshans_session_token';

// 1 Hour temporary IP block duration
const BLOCK_DURATION_MS = 60 * 60 * 1000;
// Maximum failed attempts / requests before 1 hour temporary block
const MAX_ATTEMPTS_BEFORE_BLOCK = 10;
// Rolling evaluation window (10 minutes)
const WINDOW_DURATION_MS = 10 * 60 * 1000;

export function getClientIp(req?: Request): string {
  if (req) {
    const xForwardedFor = req.headers.get('x-forwarded-for');
    if (xForwardedFor) {
      const first = xForwardedFor.split(',')[0].trim();
      if (first) return first;
    }
    const realIp = req.headers.get('x-real-ip');
    if (realIp) return realIp.trim();
    const cfConnectingIp = req.headers.get('cf-connecting-ip');
    if (cfConnectingIp) return cfConnectingIp.trim();
  }
  return '127.0.0.1';
}

/**
 * Check if the given IP address is currently blocked
 */
export async function checkIpRateLimit(ip: string): Promise<{ isBlocked: boolean; message?: string; remainingMs?: number }> {
  try {
    const record = await prisma.ipRateLimit.findUnique({
      where: { ipAddress: ip },
    });

    if (!record) {
      return { isBlocked: false };
    }

    const now = new Date();
    if (record.blockedUntil && record.blockedUntil > now) {
      const remainingMs = record.blockedUntil.getTime() - now.getTime();
      return {
        isBlocked: true,
        remainingMs,
        message: 'Your access has been temporarily blocked due to suspicious activity. Please try again after 1 hour.',
      };
    }

    return { isBlocked: false };
  } catch (err) {
    console.error('Error checking IP rate limit:', err);
    return { isBlocked: false };
  }
}

/**
 * Record a suspicious or failed attempt against an IP address
 */
export async function recordFailedAttempt(ip: string, reason = 'Repeated failed authentication'): Promise<{ isBlocked: boolean; message?: string }> {
  try {
    const now = new Date();
    const record = await prisma.ipRateLimit.findUnique({
      where: { ipAddress: ip },
    });

    if (!record) {
      await prisma.ipRateLimit.create({
        data: {
          ipAddress: ip,
          attempts: 1,
          windowStart: now,
        },
      });
      return { isBlocked: false };
    }

    // Check if previous window expired
    const windowElapsed = now.getTime() - record.windowStart.getTime();
    let newAttempts = record.attempts + 1;
    let windowStart = record.windowStart;

    if (windowElapsed > WINDOW_DURATION_MS) {
      newAttempts = 1;
      windowStart = now;
    }

    if (newAttempts >= MAX_ATTEMPTS_BEFORE_BLOCK) {
      const blockedUntil = new Date(now.getTime() + BLOCK_DURATION_MS);
      await prisma.ipRateLimit.update({
        where: { ipAddress: ip },
        data: {
          attempts: newAttempts,
          blockedUntil,
          blockedReason: reason,
        },
      });

      // Log security event
      await logSecurityEvent({
        eventType: 'IP_BLOCKED',
        ipAddress: ip,
        details: `IP ${ip} blocked for 1 hour. Reason: ${reason}. Attempts: ${newAttempts}`,
      });

      return {
        isBlocked: true,
        message: 'Your access has been temporarily blocked due to suspicious activity. Please try again after 1 hour.',
      };
    }

    await prisma.ipRateLimit.update({
      where: { ipAddress: ip },
      data: {
        attempts: newAttempts,
        windowStart,
      },
    });

    return { isBlocked: false };
  } catch (err) {
    console.error('Error recording failed attempt:', err);
    return { isBlocked: false };
  }
}

/**
 * Reset rate limit counter on successful authenticated action
 */
export async function resetIpRateLimit(ip: string) {
  try {
    await prisma.ipRateLimit.deleteMany({
      where: { ipAddress: ip },
    });
  } catch (err) {
    // Ignore error
  }
}

/**
 * Record important security audits
 */
export async function logSecurityEvent(params: {
  eventType: 'LOGIN_SUCCESS' | 'LOGIN_FAILED' | 'LOGOUT' | 'REGISTER' | 'ROLE_CHANGE' | 'PASSWORD_RESET' | 'IP_BLOCKED';
  email?: string;
  userId?: string;
  ipAddress?: string;
  details?: string;
}) {
  try {
    await prisma.securityLog.create({
      data: {
        eventType: params.eventType,
        email: params.email || null,
        userId: params.userId || null,
        ipAddress: params.ipAddress || null,
        details: params.details || null,
      },
    });
  } catch (err) {
    console.error('Failed to write security log:', err);
  }
}

/**
 * Generate secure cryptographically random session token
 */
export function generateSecureToken(): string {
  return crypto.randomBytes(48).toString('base64url');
}

/**
 * Create server-side session and store in DB
 */
export async function createSession(userId: string, req?: Request): Promise<string> {
  const token = generateSecureToken();
  const ipAddress = req ? getClientIp(req) : null;
  const userAgent = req ? req.headers.get('user-agent') : null;
  // Session valid for 7 days
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await prisma.session.create({
    data: {
      token,
      userId,
      ipAddress,
      userAgent,
      expiresAt,
    },
  });

  return token;
}

/**
 * Validate session token against database and return user if active & valid
 */
export async function validateSessionToken(token: string) {
  if (!token) return null;

  try {
    const session = await prisma.session.findUnique({
      where: { token },
      include: {
        user: true,
      },
    });

    if (!session) return null;

    // Check expiration
    if (session.expiresAt < new Date()) {
      await prisma.session.delete({ where: { token } }).catch(() => {});
      return null;
    }

    // Check user account status
    if (session.user.status === 'Blocked') {
      return null;
    }

    return session.user;
  } catch (err) {
    console.error('Session validation error:', err);
    return null;
  }
}

/**
 * Invalidate a single session token (e.g. on logout)
 */
export async function invalidateSession(token: string) {
  try {
    await prisma.session.deleteMany({
      where: { token },
    });
  } catch (err) {
    // Ignore error
  }
}

/**
 * Invalidate all sessions of a user (e.g. after password change or role modification)
 */
export async function invalidateAllUserSessions(userId: string) {
  try {
    await prisma.session.deleteMany({
      where: { userId },
    });
  } catch (err) {
    // Ignore error
  }
}
