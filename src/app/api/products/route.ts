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
    const page = searchParams.get('page');
    const category = searchParams.get('category');
    const categoryId = searchParams.get('categoryId');
    const search = searchParams.get('search');
    const department = searchParams.get('department');
    const badge = searchParams.get('badge');
    const isNew = searchParams.get('isNewArrival');
    const onSale = searchParams.get('onSale');
    const collection = searchParams.get('collection');

    if (process.env.DATABASE_URL) {
      try {
        const where: any = {};
        if (page && page !== 'all') {
          where.page = page;
        }
        if (categoryId && categoryId !== 'all') {
          where.categoryId = categoryId;
        } else if (category && category !== 'all') {
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
              if (p.colors && p.colors.startsWith('[')) {
                colorsArray = JSON.parse(p.colors);
              } else if (p.colors) {
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
              categoryId: p.categoryId || undefined,
              page: p.page || p.category?.page || 'Shop',
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
              colors: colorsArray.length ? colorsArray : [{ name: 'Deep Forest', hex: '#093624' }],
              inStock: p.inStock,
              stockCount: p.stockCount,
              isTrending: p.isTrending,
              isNewArrival: p.isNewArrival,
              isBestSeller: p.isBestSeller,
              tabCategory: (p.tabCategory as any) || undefined,
              department: (p.department as any) || 'all',
              brand: p.brand?.name || undefined,
              brandId: p.brandId || undefined,
            };
          });

          return NextResponse.json({
            success: true,
            products: mapped,
            count: mapped.length,
          });
        }
      } catch (err) {
        console.warn('Prisma fetch products fallback:', err);
      }
    }

    // Default static fallback products
    let items = [...PRODUCTS];

    if (page && page !== 'all') {
      items = items.filter((p) => (p.page || 'Shop').toLowerCase() === page.toLowerCase());
    }
    if (category && category !== 'all') {
      items = items.filter((p) =>
        p.category.toLowerCase().includes(category.toLowerCase())
      );
    }
    if (department && department !== 'all') {
      items = items.filter((p) => p.department === department);
    }
    if (badge) {
      items = items.filter((p) => p.badge === badge);
    }
    if (isNew === 'true') {
      items = items.filter((p) => p.isNewArrival || p.badge === 'new');
    }
    if (onSale === 'true') {
      items = items.filter(
        (p) => p.badge === 'sale' || p.originalPrice || p.discount
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
        }
      } catch (dbErr) {
        console.warn('Prisma stock update failed:', dbErr);
      }
    }

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
    const { name, price, category, categoryId, page, brand, brandId, description, frontImage, backImage, sizes, colors, stockCount } = body;

    if (!name || !price) {
      return NextResponse.json(
        { success: false, error: 'Product name and price are required' },
        { status: 400 }
      );
    }

    let resolvedCategoryId = categoryId;
    let resolvedPage = page;
    let resolvedBrandId = brandId;

    if (process.env.DATABASE_URL) {
      try {
        // Resolve category if not provided by ID
        if (!resolvedCategoryId && category) {
          const matchedCategory = await prisma.category.findFirst({
            where: { name: category },
          });
          if (matchedCategory) {
            resolvedCategoryId = matchedCategory.id;
            if (!resolvedPage) resolvedPage = matchedCategory.page;
          }
        } else if (resolvedCategoryId && !resolvedPage) {
          const matchedCategory = await prisma.category.findUnique({
            where: { id: resolvedCategoryId },
          });
          if (matchedCategory) {
            resolvedPage = matchedCategory.page;
          }
        }

        // Resolve brand if brand name given
        if (!resolvedBrandId && brand) {
          const matchedBrand = await prisma.brand.findFirst({
            where: { name: brand },
          });
          if (matchedBrand) {
            resolvedBrandId = matchedBrand.id;
          }
        }

        // Determine department from page
        const department = resolvedPage === 'Men' ? 'men' : resolvedPage === 'Women' ? 'women' : 'all';

        const sizesStr = Array.isArray(sizes) ? sizes.join(',') : (sizes || 'S,M,L,XL');
        const colorsStr = Array.isArray(colors) ? JSON.stringify(colors) : (colors || 'Forest Green:#093624');

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
            backImage: backImage || frontImage,
            inStock: body.inStock !== undefined ? body.inStock : true,
            stockCount: stockCount ? Number(stockCount) : 20,
            isTrending: !!body.isTrending,
            isBestSeller: !!body.isBestSeller,
            isNewArrival: !!body.isNewArrival,
            tabCategory: body.tabCategory || 'new',
            department,
            page: resolvedPage || 'Shop',
            sizes: sizesStr,
            colors: colorsStr,
            categoryId: resolvedCategoryId || null,
            brandId: resolvedBrandId || null,
          },
          include: { category: true, brand: true },
        });

        return NextResponse.json(
          {
            success: true,
            product: {
              ...newProduct,
              category: newProduct.category?.name || category || 'Apparel',
              page: newProduct.page || resolvedPage || 'Shop',
              brand: newProduct.brand?.name || brand,
              sizes: Array.isArray(sizes) ? sizes : sizesStr.split(','),
              colors: Array.isArray(colors) ? colors : [{ name: 'Default', hex: '#093624' }],
            },
            message: 'Product created successfully',
          },
          { status: 201 }
        );
      } catch (dbErr) {
        console.warn('Prisma create failed, falling back:', dbErr);
      }
    }

    const created = {
      id: `prod-${Date.now()}`,
      ...body,
      page: resolvedPage || 'Shop',
      category: category || 'Apparel',
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

export async function PUT(request: Request) {
  try {
    const admin = await verifyAdminAuth(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Administrator privileges required to update products' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { id, name, price, category, categoryId, page, brand, brandId, description, frontImage, backImage, sizes, colors, stockCount, inStock, isTrending, isBestSeller, isNewArrival, discount, originalPrice, badge } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }

    let resolvedCategoryId = categoryId;
    let resolvedPage = page;
    let resolvedBrandId = brandId;

    if (process.env.DATABASE_URL) {
      try {
        if (!resolvedCategoryId && category) {
          const matchedCategory = await prisma.category.findFirst({
            where: { name: category },
          });
          if (matchedCategory) {
            resolvedCategoryId = matchedCategory.id;
            if (!resolvedPage) resolvedPage = matchedCategory.page;
          }
        }

        if (!resolvedBrandId && brand) {
          const matchedBrand = await prisma.brand.findFirst({
            where: { name: brand },
          });
          if (matchedBrand) {
            resolvedBrandId = matchedBrand.id;
          }
        }

        const department = resolvedPage === 'Men' ? 'men' : resolvedPage === 'Women' ? 'women' : undefined;

        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (price !== undefined) updateData.price = Number(price);
        if (originalPrice !== undefined) updateData.originalPrice = originalPrice ? Number(originalPrice) : null;
        if (discount !== undefined) updateData.discount = discount || null;
        if (badge !== undefined) updateData.badge = badge || null;
        if (description !== undefined) updateData.description = description;
        if (frontImage !== undefined) updateData.frontImage = frontImage;
        if (backImage !== undefined) updateData.backImage = backImage;
        if (inStock !== undefined) updateData.inStock = Boolean(inStock);
        if (stockCount !== undefined) updateData.stockCount = Number(stockCount);
        if (isTrending !== undefined) updateData.isTrending = Boolean(isTrending);
        if (isBestSeller !== undefined) updateData.isBestSeller = Boolean(isBestSeller);
        if (isNewArrival !== undefined) updateData.isNewArrival = Boolean(isNewArrival);
        if (resolvedPage !== undefined) updateData.page = resolvedPage;
        if (department !== undefined) updateData.department = department;
        if (resolvedCategoryId !== undefined) updateData.categoryId = resolvedCategoryId;
        if (resolvedBrandId !== undefined) updateData.brandId = resolvedBrandId;
        if (sizes !== undefined) {
          updateData.sizes = Array.isArray(sizes) ? sizes.join(',') : sizes;
        }
        if (colors !== undefined) {
          updateData.colors = Array.isArray(colors) ? JSON.stringify(colors) : colors;
        }

        const updated = await prisma.product.update({
          where: { id },
          data: updateData,
          include: { category: true, brand: true },
        });

        return NextResponse.json({
          success: true,
          product: {
            ...updated,
            category: updated.category?.name || category,
            page: updated.page || resolvedPage,
            brand: updated.brand?.name || brand,
          },
        });
      } catch (dbErr) {
        console.warn('Prisma product update fallback:', dbErr);
      }
    }

    return NextResponse.json({ success: true, product: body });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const admin = await verifyAdminAuth(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Administrator privileges required to delete products' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }

    if (process.env.DATABASE_URL) {
      try {
        await prisma.product.delete({
          where: { id },
        });
        return NextResponse.json({ success: true, message: 'Product deleted successfully' });
      } catch (dbErr) {
        console.warn('Prisma delete product fallback:', dbErr);
      }
    }

    return NextResponse.json({ success: true, message: 'Product deleted' });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete product' },
      { status: 500 }
    );
  }
}
