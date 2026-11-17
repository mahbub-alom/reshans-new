import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { INITIAL_ORDERS } from '@/data/adminInitialData';

export async function GET() {
  try {
    if (process.env.DATABASE_URL) {
      try {
        const dbOrders = await prisma.order.findMany({
          include: { items: true },
          orderBy: { createdAt: 'desc' },
        });

        if (dbOrders && dbOrders.length > 0) {
          return NextResponse.json({ success: true, orders: dbOrders });
        }
      } catch (err) {
        console.warn('Prisma orders query fallback:', err);
      }
    }

    return NextResponse.json({ success: true, orders: INITIAL_ORDERS });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, customerEmail, customerPhone, customerAddress, items, total } = body;

    if (!customerName || !items || !total) {
      return NextResponse.json(
        { success: false, error: 'Customer details and items are required' },
        { status: 400 }
      );
    }

    const orderNumber = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder = {
      id: orderNumber,
      orderNumber,
      customerName,
      customerEmail: customerEmail || 'customer@example.com',
      customerPhone: customerPhone || '+880 1700 000 000',
      customerAddress: customerAddress || 'Dhaka, Bangladesh',
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      items: items || [],
      total: Number(total),
      paymentMethod: body.paymentMethod || 'Cash on Delivery',
      paymentStatus: body.paymentStatus || 'Pending',
      orderStatus: 'Pending',
      trackingNumber: `RSH-BD-${Math.floor(10000 + Math.random() * 90000)}`,
      note: body.note || null,
    };

    return NextResponse.json(
      { success: true, order: newOrder, message: 'Order placed successfully!' },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to place order' },
      { status: 500 }
    );
  }
}
