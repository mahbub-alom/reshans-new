import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { INITIAL_COUPONS } from '@/data/adminInitialData';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (code) {
      if (process.env.DATABASE_URL) {
        try {
          const coupon = await prisma.coupon.findUnique({
            where: { code: code.toUpperCase() },
          });
          if (coupon) {
            return NextResponse.json({ success: true, coupon });
          }
        } catch (err) {
          console.warn('Prisma coupon lookup fallback:', err);
        }
      }

      const match = INITIAL_COUPONS.find(
        (c) => c.code.toUpperCase() === code.toUpperCase()
      );
      if (match) {
        return NextResponse.json({ success: true, coupon: match });
      }
      return NextResponse.json(
        { success: false, error: 'Invalid or expired coupon code' },
        { status: 404 }
      );
    }

    if (process.env.DATABASE_URL) {
      try {
        const coupons = await prisma.coupon.findMany();
        if (coupons && coupons.length > 0) {
          return NextResponse.json({ success: true, coupons });
        }
      } catch (err) {
        console.warn('Prisma coupons fallback:', err);
      }
    }

    return NextResponse.json({ success: true, coupons: INITIAL_COUPONS });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch coupons' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, discountType, discountValue, minSpend, expiryDate } = body;

    if (!code || !discountValue) {
      return NextResponse.json(
        { success: false, error: 'Coupon code and discount value are required' },
        { status: 400 }
      );
    }

    if (process.env.DATABASE_URL) {
      try {
        const coupon = await prisma.coupon.create({
          data: {
            code: code.toUpperCase(),
            discountType: discountType || 'percentage',
            discountValue: Number(discountValue),
            minSpend: minSpend ? Number(minSpend) : 0,
            expiryDate: expiryDate ? new Date(expiryDate) : null,
            usageLimit: body.usageLimit ? Number(body.usageLimit) : 100,
            isActive: body.isActive !== undefined ? body.isActive : true,
          },
        });
        return NextResponse.json({ success: true, coupon }, { status: 201 });
      } catch (err) {
        console.warn('Prisma create coupon fallback:', err);
      }
    }

    const created = {
      id: `CPN-${Date.now()}`,
      code: code.toUpperCase(),
      discountType: discountType || 'percentage',
      discountValue: Number(discountValue),
      minSpend: minSpend ? Number(minSpend) : 0,
      expiryDate: expiryDate || '2026-12-31',
      usageLimit: body.usageLimit ? Number(body.usageLimit) : 100,
      usageCount: 0,
      isActive: true,
    };

    return NextResponse.json({ success: true, coupon: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create coupon' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const code = searchParams.get('code');

    if (!id && !code) {
      return NextResponse.json(
        { success: false, error: 'Coupon ID or code is required' },
        { status: 400 }
      );
    }

    if (process.env.DATABASE_URL) {
      try {
        if (id) {
          await prisma.coupon.delete({ where: { id } });
        } else if (code) {
          await prisma.coupon.delete({ where: { code: code.toUpperCase() } });
        }
        return NextResponse.json({ success: true, message: 'Coupon deleted from database' });
      } catch (err: any) {
        console.warn('Prisma coupon delete fallback:', err);
        // If not found in DB, return success true so local state cleans up
        return NextResponse.json({ success: true, message: 'Coupon deleted' });
      }
    }

    return NextResponse.json({ success: true, message: 'Coupon deleted' });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete coupon' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, code, isActive, incrementUsage } = body;

    if (!id && !code) {
      return NextResponse.json(
        { success: false, error: 'Coupon ID or code is required' },
        { status: 400 }
      );
    }

    if (process.env.DATABASE_URL) {
      try {
        let existing: any = null;
        if (id) {
          existing = await prisma.coupon.findUnique({ where: { id } });
        } else if (code) {
          existing = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });
        }

        if (existing) {
          const updateData: any = {};
          if (isActive !== undefined) {
            updateData.isActive = Boolean(isActive);
          }
          if (incrementUsage) {
            const nextUsage = existing.usageCount + 1;
            updateData.usageCount = nextUsage;
            // Requirement: If usage limit crossed/reached, automatically turn OFF the coupon!
            if (nextUsage >= existing.usageLimit) {
              updateData.isActive = false;
            }
          }

          const updated = await prisma.coupon.update({
            where: { id: existing.id },
            data: updateData,
          });

          return NextResponse.json({ success: true, coupon: updated });
        }
      } catch (err) {
        console.warn('Prisma coupon update fallback:', err);
      }
    }

    return NextResponse.json({ success: true, updated: body });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update coupon' },
      { status: 500 }
    );
  }
}
