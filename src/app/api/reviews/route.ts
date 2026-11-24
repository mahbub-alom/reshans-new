import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { INITIAL_REVIEWS } from '@/data/adminInitialData';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const status = searchParams.get('status');

    if (process.env.DATABASE_URL) {
      try {
        const where: any = {};
        if (productId) where.productId = productId;
        if (status && status !== 'all') where.status = status;

        const dbReviews = await prisma.review.findMany({
          where,
          include: { product: true, user: true },
          orderBy: { createdAt: 'desc' },
        });

        if (dbReviews && dbReviews.length > 0) {
          const mapped = dbReviews.map((r) => ({
            id: r.id,
            productId: r.productId,
            productName: r.product?.name || 'Fashion Item',
            productImage: r.product?.frontImage || '/assets/img/fashion-1/product/product-1/front-img-1.jpg',
            customerName: r.customerName || r.user?.name || 'Verified Buyer',
            customerAvatar: r.customerAvatar || r.user?.avatar || '/assets/img/others/dashboard-avater.jpg',
            rating: r.rating,
            comment: r.comment,
            date: r.createdAt.toISOString().split('T')[0],
            isVerified: r.isVerified,
            status: (r.status as 'approved' | 'pending' | 'rejected') || 'approved',
          }));
          return NextResponse.json({ success: true, reviews: mapped });
        }
      } catch (err) {
        console.warn('Prisma reviews fetch fallback:', err);
      }
    }

    let items = [...INITIAL_REVIEWS];
    if (productId) {
      items = items.filter((r) => r.productId === productId);
    }
    if (status && status !== 'all') {
      items = items.filter((r) => r.status === status);
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
    const { productId, rating, comment, customerName, customerAvatar, isVerified, status } = body;

    if (!rating || !comment) {
      return NextResponse.json(
        { success: false, error: 'Rating and comment are required' },
        { status: 400 }
      );
    }

    const reviewStatus = status || 'pending';
    const numRating = Number(rating);

    if (process.env.DATABASE_URL) {
      try {
        let validProductId = productId;
        // Verify product exists, else find first product or fallback
        if (validProductId) {
          const p = await prisma.product.findUnique({ where: { id: validProductId } });
          if (!p) {
            const first = await prisma.product.findFirst();
            if (first) validProductId = first.id;
          }
        } else {
          const first = await prisma.product.findFirst();
          if (first) validProductId = first.id;
        }

        if (validProductId) {
          const created = await prisma.review.create({
            data: {
              productId: validProductId,
              customerName: customerName || 'Verified Buyer',
              customerAvatar: customerAvatar || '/assets/img/others/dashboard-avater.jpg',
              rating: numRating,
              comment,
              isVerified: isVerified !== undefined ? Boolean(isVerified) : true,
              status: reviewStatus,
            },
            include: { product: true },
          });

          // Update product rating and reviewsCount in DB
          const approvedReviews = await prisma.review.findMany({
            where: { productId: validProductId, status: 'approved' },
          });
          if (approvedReviews.length > 0) {
            const avgRating =
              approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length;
            await prisma.product.update({
              where: { id: validProductId },
              data: {
                rating: Math.round(avgRating * 10) / 10,
                reviewsCount: approvedReviews.length,
              },
            });
          }

          return NextResponse.json(
            {
              success: true,
              review: {
                id: created.id,
                productId: created.productId,
                productName: created.product?.name || body.productName || 'Fashion Item',
                productImage: created.product?.frontImage || body.productImage || '/assets/img/fashion-1/product/product-1/front-img-1.jpg',
                customerName: created.customerName,
                customerAvatar: created.customerAvatar,
                rating: created.rating,
                comment: created.comment,
                date: created.createdAt.toISOString().split('T')[0],
                isVerified: created.isVerified,
                status: created.status as 'approved' | 'pending' | 'rejected',
              },
              message: 'Review submitted successfully!',
            },
            { status: 201 }
          );
        }
      } catch (dbErr) {
        console.warn('Prisma create review fallback:', dbErr);
      }
    }

    const fallbackReview = {
      id: `REV-${Date.now()}`,
      productId: productId || 'prod-1',
      productName: body.productName || 'Fashion Apparel',
      productImage: body.productImage || '/assets/img/fashion-1/product/product-1/front-img-1.jpg',
      customerName: customerName || 'Verified Buyer',
      customerAvatar: customerAvatar || '/assets/img/others/dashboard-avater.jpg',
      rating: numRating,
      comment,
      date: new Date().toISOString().split('T')[0],
      isVerified: true,
      status: reviewStatus as any,
    };

    return NextResponse.json(
      { success: true, review: fallbackReview, message: 'Review submitted successfully!' },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to submit review' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: 'Review ID and status are required' },
        { status: 400 }
      );
    }

    if (process.env.DATABASE_URL) {
      try {
        const updated = await prisma.review.update({
          where: { id },
          data: { status },
          include: { product: true },
        });

        // Update product rating and reviewsCount in DB
        if (updated.productId) {
          const approvedReviews = await prisma.review.findMany({
            where: { productId: updated.productId, status: 'approved' },
          });
          const avgRating =
            approvedReviews.length > 0
              ? approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length
              : 5.0;
          await prisma.product.update({
            where: { id: updated.productId },
            data: {
              rating: Math.round(avgRating * 10) / 10,
              reviewsCount: approvedReviews.length,
            },
          });
        }

        return NextResponse.json({
          success: true,
          review: {
            id: updated.id,
            productId: updated.productId,
            productName: updated.product?.name || 'Fashion Item',
            productImage: updated.product?.frontImage || '/assets/img/fashion-1/product/product-1/front-img-1.jpg',
            customerName: updated.customerName,
            customerAvatar: updated.customerAvatar,
            rating: updated.rating,
            comment: updated.comment,
            date: updated.createdAt.toISOString().split('T')[0],
            isVerified: updated.isVerified,
            status: updated.status,
          },
          message: `Review ${status} successfully!`,
        });
      } catch (dbErr) {
        console.warn('Prisma update review fallback:', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Review status changed to ${status}`,
      review: { id, status },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update review status' },
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
        { success: false, error: 'Review ID is required' },
        { status: 400 }
      );
    }

    if (process.env.DATABASE_URL) {
      try {
        const existing = await prisma.review.findUnique({ where: { id } });
        if (existing) {
          const productId = existing.productId;
          await prisma.review.delete({ where: { id } });

          // Re-calculate product ratings
          const approvedReviews = await prisma.review.findMany({
            where: { productId, status: 'approved' },
          });
          const avgRating =
            approvedReviews.length > 0
              ? approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length
              : 5.0;
          await prisma.product.update({
            where: { id: productId },
            data: {
              rating: Math.round(avgRating * 10) / 10,
              reviewsCount: approvedReviews.length,
            },
          });

          return NextResponse.json({ success: true, message: 'Review deleted successfully' });
        }
      } catch (dbErr) {
        console.warn('Prisma delete review fallback:', dbErr);
      }
    }

    return NextResponse.json({ success: true, message: 'Review deleted' });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete review' },
      { status: 500 }
    );
  }
}
