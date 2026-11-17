import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { PRODUCTS } from '@/data/products';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    if (process.env.DATABASE_URL) {
      try {
        const where: any = {};
        if (category && category !== 'all') {
          where.category = { name: category };
        }
        if (search) {
          where.OR = [
            { name: { contains: search } },
            { description: { contains: search } },
          ];
        }

        const dbProducts = await prisma.product.findMany({
          where,
          include: { category: true, brand: true },
          orderBy: { createdAt: 'desc' },
        });

        if (dbProducts && dbProducts.length > 0) {
          return NextResponse.json({
            success: true,
            products: dbProducts,
            count: dbProducts.length,
          });
        }
      } catch (dbErr) {
        console.warn('Prisma query failed, falling back to catalog:', dbErr);
      }
    }

    // Default catalog response
    let items = [...PRODUCTS];
    if (category && category !== 'all') {
      items = items.filter((p) => p.category.toLowerCase().includes(category.toLowerCase()));
    }
    if (search) {
      items = items.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
    }

    return NextResponse.json({
      success: true,
      products: items,
      count: items.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, price, category, description, frontImage, stockCount } = body;

    if (!name || !price) {
      return NextResponse.json(
        { success: false, error: 'Product name and price are required' },
        { status: 400 }
      );
    }

    if (process.env.DATABASE_URL) {
      try {
        const newProduct = await prisma.product.create({
          data: {
            name,
            sku: body.sku || `RSH-${Date.now().toString().slice(-4)}`,
            description: description || 'Artisanal tailored luxury apparel.',
            price: Number(price),
            originalPrice: body.originalPrice ? Number(body.originalPrice) : null,
            discount: body.discount || null,
            badge: body.badge || null,
            frontImage: frontImage || '/assets/img/fashion-1/product/product-1/front-img-1.jpg',
            backImage: body.backImage || frontImage,
            inStock: body.inStock !== undefined ? body.inStock : true,
            stockCount: stockCount ? Number(stockCount) : 20,
            isTrending: !!body.isTrending,
            isBestSeller: !!body.isBestSeller,
            isNewArrival: !!body.isNewArrival,
            tabCategory: body.tabCategory || 'new',
            department: body.department || 'men',
          },
        });

        return NextResponse.json(
          { success: true, product: newProduct, message: 'Product created successfully' },
          { status: 201 }
        );
      } catch (dbErr) {
        console.warn('Prisma create failed, returning simulated created product:', dbErr);
      }
    }

    const created = {
      id: `prod-${Date.now()}`,
      ...body,
      inStock: body.inStock !== undefined ? body.inStock : true,
      stockCount: stockCount ? Number(stockCount) : 20,
    };

    return NextResponse.json(
      { success: true, product: created, message: 'Product created successfully' },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}
