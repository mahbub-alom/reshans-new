import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { INITIAL_CATEGORIES } from '@/data/adminInitialData';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page');
    const status = searchParams.get('status');

    if (process.env.DATABASE_URL) {
      try {
        const where: any = {};
        if (page && page !== 'all') {
          where.page = page;
        }
        if (status) {
          where.status = status;
        }

        const categories = await prisma.category.findMany({
          where,
          include: { _count: { select: { products: true } } },
          orderBy: { createdAt: 'desc' },
        });

        if (categories && categories.length > 0) {
          const mapped = categories.map((c) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            page: c.page || 'Shop',
            image: c.image || '',
            description: c.description || '',
            status: c.status || 'Active',
            itemCount: c._count?.products || 0,
          }));
          return NextResponse.json({ success: true, categories: mapped });
        }
      } catch (err) {
        console.warn('Prisma categories error:', err);
      }
    }

    let result = INITIAL_CATEGORIES;
    if (page && page !== 'all') {
      result = result.filter((c) => (c.page || 'Shop').toLowerCase() === page.toLowerCase());
    }
    if (status) {
      result = result.filter((c) => c.status === status);
    }

    return NextResponse.json({ success: true, categories: result });
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
    const { name, page, image, description, status } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Category name is required' },
        { status: 400 }
      );
    }

    const assignedPage = page || 'Shop';
    const assignedStatus = status || 'Active';
    const slug = body.slug || `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-4)}`;

    if (process.env.DATABASE_URL) {
      try {
        const category = await prisma.category.create({
          data: {
            name,
            slug,
            page: assignedPage,
            image: image || null,
            description: description || null,
            status: assignedStatus,
          },
        });
        return NextResponse.json({
          success: true,
          category: {
            ...category,
            itemCount: 0,
          },
        }, { status: 201 });
      } catch (err) {
        console.warn('Prisma create category fallback:', err);
      }
    }

    const created = {
      id: `CAT-${Date.now()}`,
      name,
      slug,
      page: assignedPage,
      image: image || '',
      description: description || '',
      itemCount: 0,
      status: assignedStatus,
    };

    return NextResponse.json({ success: true, category: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create category' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, page, image, description, status, slug } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Category ID is required' },
        { status: 400 }
      );
    }

    if (process.env.DATABASE_URL) {
      try {
        const updated = await prisma.category.update({
          where: { id },
          data: {
            ...(name ? { name } : {}),
            ...(page ? { page } : {}),
            ...(image !== undefined ? { image } : {}),
            ...(description !== undefined ? { description } : {}),
            ...(status ? { status } : {}),
            ...(slug ? { slug } : {}),
          },
        });
        return NextResponse.json({ success: true, category: updated });
      } catch (err) {
        console.warn('Prisma update category fallback:', err);
      }
    }

    return NextResponse.json({ success: true, category: body });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update category' },
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
        { success: false, error: 'Category ID is required' },
        { status: 400 }
      );
    }

    if (process.env.DATABASE_URL) {
      try {
        await prisma.category.delete({
          where: { id },
        });
        return NextResponse.json({ success: true, message: 'Category deleted' });
      } catch (err) {
        console.warn('Prisma delete category fallback:', err);
      }
    }

    return NextResponse.json({ success: true, message: 'Category deleted' });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete category' },
      { status: 500 }
    );
  }
}
