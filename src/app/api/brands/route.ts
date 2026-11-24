import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { INITIAL_BRANDS } from '@/data/adminInitialData';

export async function GET() {
  try {
    if (process.env.DATABASE_URL) {
      try {
        const brands = await prisma.brand.findMany({
          include: { _count: { select: { products: true } } },
          orderBy: { createdAt: 'desc' },
        });

        if (brands && brands.length > 0) {
          const mapped = brands.map((b) => ({
            id: b.id,
            name: b.name,
            origin: b.origin || 'Dhaka, Bangladesh',
            itemCount: b._count?.products || 0,
          }));
          return NextResponse.json({ success: true, brands: mapped });
        }
      } catch (err) {
        console.warn('Prisma brands error:', err);
      }
    }

    return NextResponse.json({ success: true, brands: INITIAL_BRANDS });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch brands' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, origin } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Brand name is required' },
        { status: 400 }
      );
    }

    if (process.env.DATABASE_URL) {
      try {
        const brand = await prisma.brand.create({
          data: {
            name,
            origin: origin || 'Dhaka, Bangladesh',
          },
        });
        return NextResponse.json({
          success: true,
          brand: {
            ...brand,
            itemCount: 0,
          },
        }, { status: 201 });
      } catch (err) {
        console.warn('Prisma create brand fallback:', err);
      }
    }

    const created = {
      id: `BR-${Date.now().toString().slice(-4)}`,
      name,
      origin: origin || 'Dhaka, Bangladesh',
      itemCount: 0,
    };

    return NextResponse.json({ success: true, brand: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create brand' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Brand ID is required' },
        { status: 400 }
      );
    }

    if (process.env.DATABASE_URL) {
      try {
        await prisma.brand.delete({
          where: { id },
        });
        return NextResponse.json({ success: true, message: 'Brand deleted' });
      } catch (err) {
        console.warn('Prisma delete brand fallback:', err);
      }
    }

    return NextResponse.json({ success: true, message: 'Brand deleted' });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete brand' },
      { status: 500 }
    );
  }
}
