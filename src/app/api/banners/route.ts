import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { INITIAL_BANNERS } from '@/data/adminInitialData';

export async function GET() {
  try {
    if (process.env.DATABASE_URL) {
      try {
        const setting = await prisma.setting.findUnique({
          where: { key: 'website_banners_v1' },
        });
        if (setting && setting.value) {
          const parsed = JSON.parse(setting.value);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return NextResponse.json({ success: true, banners: parsed });
          }
        }
      } catch (err) {
        console.warn('Prisma banners get fallback:', err);
      }
    }
    return NextResponse.json({ success: true, banners: INITIAL_BANNERS });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch banners' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { banners } = body;

    if (!Array.isArray(banners)) {
      return NextResponse.json(
        { success: false, error: 'Banners must be an array' },
        { status: 400 }
      );
    }

    if (process.env.DATABASE_URL) {
      try {
        await prisma.setting.upsert({
          where: { key: 'website_banners_v1' },
          update: { value: JSON.stringify(banners) },
          create: { key: 'website_banners_v1', value: JSON.stringify(banners) },
        });
      } catch (err) {
        console.warn('Prisma save banners fallback:', err);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Banners and announcement bar updated successfully',
      banners,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update banners' },
      { status: 500 }
    );
  }
}
