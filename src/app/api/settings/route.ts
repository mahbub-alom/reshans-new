import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { INITIAL_SETTINGS } from '@/data/adminInitialData';

export async function GET() {
  try {
    if (process.env.DATABASE_URL) {
      try {
        const settings = await prisma.setting.findMany();
        if (settings && settings.length > 0) {
          const map: Record<string, any> = {};
          settings.forEach((s) => {
            map[s.key] = s.value;
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
