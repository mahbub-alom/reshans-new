import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { INITIAL_SETTINGS } from '@/data/adminInitialData';
import { SESSION_COOKIE_NAME, validateSessionToken } from '@/lib/auth';

async function verifyAdminAuth(request: Request) {
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const authHeader = request.headers.get('authorization');
  const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;
  const token = headerToken || cookieToken;
  if (!token) return null;
  const user = await validateSessionToken(token);
  if (!user || user.role !== 'ADMIN') return null;
  return user;
}

export async function GET() {
  try {
    if (process.env.DATABASE_URL) {
      try {
        const settings = await prisma.setting.findMany();
        if (settings && settings.length > 0) {
          const map: Record<string, any> = {};
          settings.forEach((s) => {
            const val = s.value;
            // Parse boolean and numeric values
            if (val === 'true') map[s.key] = true;
            else if (val === 'false') map[s.key] = false;
            else if (!isNaN(Number(val)) && val.trim() !== '' && !val.startsWith('0') && !val.startsWith('+') && s.key !== 'phone') {
              map[s.key] = Number(val);
            } else {
              map[s.key] = val;
            }
          });
          return NextResponse.json({ success: true, settings: { ...INITIAL_SETTINGS, ...map } });
        }
      } catch (err) {
        console.warn('Prisma settings fallback:', err);
      }
    }

    return NextResponse.json({ success: true, settings: INITIAL_SETTINGS });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const admin = await verifyAdminAuth(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Only administrators can modify store settings' },
        { status: 403 }
      );
    }

    const updates = await request.json();

    if (process.env.DATABASE_URL) {
      try {
        for (const [key, value] of Object.entries(updates)) {
          await prisma.setting.upsert({
            where: { key },
            update: { value: String(value) },
            create: { key, value: String(value) },
          });
        }
      } catch (err) {
        console.warn('Prisma update settings fallback:', err);
      }
    }

    return NextResponse.json({
      success: true,
      settings: updates,
      message: 'Website settings saved successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update settings' },
      { status: 500 }
    );
  }
}
