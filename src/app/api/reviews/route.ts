import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { INITIAL_REVIEWS } from '@/data/adminInitialData';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (process.env.DATABASE_URL) {
      try {
        const where: any = {};
        if (productId) where.productId = productId;
        const reviews = await prisma.review.findMany({
          where,
          include: { product: true, user: true },
          orderBy: { createdAt: 'desc' },
        });
        if (reviews && reviews.length > 0) {
          return NextResponse.json({ success: true, reviews });
        }
      } catch (err) {
        console.warn('Prisma reviews fallback:', err);
      }
    }

    let items = [...INITIAL_REVIEWS];
    if (productId) {
      items = items.filter((r) => r.productId === productId);
    }

    return NextResponse.json({ success: true, reviews: items });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, rating, comment, customerName } = body;

    if (!rating || !comment) {
      return NextResponse.json(
        { success: false, error: 'Rating and comment are required' },
        { status: 400 }
      );
    }

    const newReview = {
      id: `REV-${Date.now()}`,
      productId: productId || 'prod-1',
      productName: body.productName || 'Fashion Apparel',
      productImage: body.productImage || '/assets/img/fashion-1/product/product-1/front-img-1.jpg',
      customerName: customerName || 'Verified Buyer',
      customerAvatar: '/assets/img/others/dashboard-avater.jpg',
      rating: Number(rating),
      comment,
      date: new Date().toISOString().split('T')[0],
      isVerified: true,
      status: 'approved' as const,
    };

    return NextResponse.json(
      { success: true, review: newReview, message: 'Review submitted successfully!' },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to submit review' },
      { status: 500 }
    );
  }
}
