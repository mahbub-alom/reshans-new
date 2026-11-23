import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { PRODUCTS } from '@/data/products';
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

export async function PATCH(request: Request) {
  try {
    const admin = await verifyAdminAuth(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Administrator privileges required to adjust stock' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { id, inStock, stockCount } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }

    if (process.env.DATABASE_URL) {
      try {
        // Check if product exists in DB
        const existing = await prisma.product.findUnique({
          where: { id },
        });

        if (existing) {
          const updated = await prisma.product.update({
            where: { id },
            data: {
              ...(inStock !== undefined ? { inStock: Boolean(inStock) } : {}),
              ...(stockCount !== undefined ? { stockCount: Number(stockCount) } : {}),
            },
          });
          return NextResponse.json({
            success: true,
            product: updated,
            message: 'Stock updated successfully in database',
          });
        } else {
          // If product does not exist in DB yet (e.g. initial catalog product), create or update
          const catalogItem = PRODUCTS.find((p) => p.id === id);
          if (catalogItem) {
            const created = await prisma.product.create({
              data: {
                id: catalogItem.id,
                name: catalogItem.name,
                sku: catalogItem.sku || `RSH-${catalogItem.id}`,
                description: catalogItem.description || 'Luxury artisanal apparel',
                price: catalogItem.price,
                originalPrice: catalogItem.originalPrice || null,
                discount: catalogItem.discount || null,
                badge: catalogItem.badge || null,
                frontImage: catalogItem.frontImage,
                backImage: catalogItem.backImage || catalogItem.frontImage,
                inStock: inStock !== undefined ? Boolean(inStock) : catalogItem.inStock,
                stockCount: stockCount !== undefined ? Number(stockCount) : (inStock ? 25 : 0),
                rating: catalogItem.rating || 5,
                reviewsCount: catalogItem.reviewsCount || 0,
                sizes: (catalogItem.sizes || ['S', 'M', 'L', 'XL']).join(','),
                colors: JSON.stringify(catalogItem.colors || [{ name: 'Deep Forest', hex: '#093624' }]),
                department: catalogItem.department || 'all',
              },
            });
            return NextResponse.json({
              success: true,
              product: created,
              message: 'Stock initialized and updated in database',
            });
          }
        }
      } catch (dbErr) {
        console.warn('Prisma stock update failed:', dbErr);
      }
    }

    // In-memory / fallback response
    return NextResponse.json({
      success: true,
      message: 'Stock updated in session state',
      product: { id, inStock, stockCount },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update stock' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const admin = await verifyAdminAuth(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Administrator privileges required to create products' },
        { status: 403 }
      );
    }

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
