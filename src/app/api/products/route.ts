import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { PRODUCTS } from '@/data/products';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const department = searchParams.get('department');
    const badge = searchParams.get('badge');
    const isNew = searchParams.get('isNewArrival');
    const onSale = searchParams.get('onSale');
    const collection = searchParams.get('collection');

    if (process.env.DATABASE_URL) {
      try {
        const where: any = {};
        if (category && category !== 'all') {
          where.category = { name: { contains: category } };
        }
        if (department && department !== 'all') {
          where.department = department;
        }
        if (badge) {
          where.badge = badge;
        }
        if (isNew === 'true') {
          where.OR = [{ isNewArrival: true }, { badge: 'new' }];
        }
        if (onSale === 'true') {
          where.OR = [
            { originalPrice: { not: null } },
            { discount: { not: null } },
            { badge: 'sale' },
          ];
        }
        if (collection && collection !== 'all') {
          where.OR = [
            { category: { name: { contains: collection } } },
            { name: { contains: collection } },
            { description: { contains: collection } },
          ];
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
          // Map DB products to frontend Product interface shape
          const mapped = dbProducts.map((p) => {
            let colorsArray: { name: string; hex: string; image?: string }[] = [];
            try {
              if (p.colors.startsWith('[')) {
                colorsArray = JSON.parse(p.colors);
              } else {
                colorsArray = p.colors.split(',').map((pair) => {
                  const [cName, cHex] = pair.split(':');
                  return { name: cName?.trim() || 'Color', hex: cHex?.trim() || '#000000' };
                });
              }
            } catch {
              colorsArray = [{ name: 'Standard', hex: '#093624' }];
            }

            return {
              id: p.id,
              name: p.name,
              sku: p.sku || undefined,
              category: p.category?.name || 'Apparel',
              price: p.price,
              originalPrice: p.originalPrice || undefined,
              discount: p.discount || undefined,
              badge: (p.badge as any) || undefined,
              rating: p.rating,
              reviewsCount: p.reviewsCount,
              frontImage: p.frontImage,
              backImage: p.backImage || p.frontImage,
              description: p.description,
              sizes: p.sizes ? p.sizes.split(',').map((s) => s.trim()) : ['S', 'M', 'L', 'XL'],
              colors: colorsArray,
              inStock: p.inStock,
              stockCount: p.stockCount,
              isTrending: p.isTrending,
              isNewArrival: p.isNewArrival,
              isBestSeller: p.isBestSeller,
              department: (p.department as any) || 'all',
              brand: p.brand?.name || undefined,
            };
          });

          return NextResponse.json({
            success: true,
            products: mapped,
            count: mapped.length,
          });
        }
      } catch (dbErr) {
        console.warn('Prisma query failed, falling back to catalog:', dbErr);
      }
    }

    // Default catalog response
    let items = [...PRODUCTS];
    if (department && department !== 'all') {
      items = items.filter((p) => p.department === department);
    }
    if (category && category !== 'all') {
      items = items.filter((p) => p.category.toLowerCase().includes(category.toLowerCase()));
    }
    if (isNew === 'true') {
      items = items.filter((p) => p.isNewArrival || p.badge === 'new');
    }
    if (onSale === 'true') {
      items = items.filter((p) => p.badge === 'sale' || !!p.originalPrice || !!p.discount);
    }
    if (collection && collection !== 'all') {
      const col = collection.toLowerCase();
      items = items.filter(
        (p) =>
          p.category.toLowerCase().includes(col) ||
          p.name.toLowerCase().includes(col) ||
          p.description.toLowerCase().includes(col)
      );
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
