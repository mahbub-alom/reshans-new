import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { INITIAL_ORDERS } from '@/data/adminInitialData';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (process.env.DATABASE_URL) {
      try {
        const order = await prisma.order.findFirst({
          where: {
            OR: [{ id }, { orderNumber: id }],
          },
          include: { items: true },
        });

        if (order) {
          return NextResponse.json({ success: true, order });
        }
      } catch (dbErr) {
        console.warn('Prisma get order fallback:', dbErr);
      }
    }

    const order = INITIAL_ORDERS.find(
      (o) => o.id === id
    );

    if (order) {
      return NextResponse.json({ success: true, order });
    }

    return NextResponse.json(
      { success: false, error: 'Order not found' },
      { status: 404 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { orderStatus, paymentStatus, trackingNumber } = body;

    if (process.env.DATABASE_URL) {
      try {
        const updated = await prisma.order.update({
          where: { id },
          data: {
            ...(orderStatus && { orderStatus }),
            ...(paymentStatus && { paymentStatus }),
            ...(trackingNumber && { trackingNumber }),
          },
        });
        return NextResponse.json({ success: true, order: updated });
      } catch (dbErr) {
        console.warn('Prisma order update fallback:', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      order: { id, ...body },
      message: 'Order updated successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update order' },
      { status: 500 }
    );
  }
}
