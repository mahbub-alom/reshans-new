import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { INITIAL_CATEGORIES } from '@/data/adminInitialData';

export async function GET() {
  try {
    if (process.env.DATABASE_URL) {
      try {
        const categories = await prisma.category.findMany({
          include: { _count: { select: { products: true } } },
        });
        if (categories && categories.length > 0) {
          return NextResponse.json({ success: true, categories });
        }
      } catch (err) {
        console.warn('Prisma categories error:', err);
      }
    }

    return NextResponse.json({ success: true, categories: INITIAL_CATEGORIES });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, image, description } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Category name is required' },
        { status: 400 }
      );
    }

    const slug = body.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (process.env.DATABASE_URL) {
      try {
        const category = await prisma.category.create({
          data: {
            name,
            slug,
            image: image || '/assets/img/fashion-1/category/category-1.jpg',
            description: description || null,
          },
        });
        return NextResponse.json({ success: true, category }, { status: 201 });
      } catch (err) {
        console.warn('Prisma create category fallback:', err);
      }
    }

    const created = {
      id: `CAT-${Date.now()}`,
      name,
      slug,
      image: image || '/assets/img/fashion-1/category/category-1.jpg',
      description: description || '',
      itemCount: 0,
      status: 'Active',
    };

    return NextResponse.json({ success: true, category: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create category' },
      { status: 500 }
    );
  }
}
