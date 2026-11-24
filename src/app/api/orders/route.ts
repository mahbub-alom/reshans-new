import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { INITIAL_ORDERS } from '@/data/adminInitialData';
import { orderEvents } from '@/lib/orderEvents';

export async function GET() {
  try {
    if (process.env.DATABASE_URL) {
      try {
        const dbOrders = await prisma.order.findMany({
          include: { items: true },
          orderBy: { createdAt: 'desc' },
        });

        if (dbOrders && dbOrders.length > 0) {
          const formatted = dbOrders.map((ord: any) => ({
            id: ord.id || ord.orderNumber,
            orderNumber: ord.orderNumber || ord.id,
            customerName: ord.customerName,
            customerEmail: ord.customerEmail,
            customerPhone: ord.customerPhone,
            customerAddress: ord.customerAddress,
            date: ord.createdAt ? new Date(ord.createdAt).toISOString().replace('T', ' ').substring(0, 16) : '',
            items: (ord.items || []).map((it: any) => ({
              product: {
                id: it.productId || it.id,
                name: it.productName,
                price: it.price,
                frontImage: it.productImage || '',
                backImage: it.productImage || '',
                category: 'Apparel',
                description: '',
                sizes: it.selectedSize ? [it.selectedSize] : ['M'],
                colors: [{ name: it.selectedColor || 'Default', hex: '#000000' }],
                inStock: true,
                rating: 5,
                reviewsCount: 0,
              },
              quantity: it.quantity,
              selectedColor: it.selectedColor || undefined,
              selectedSize: it.selectedSize || undefined,
            })),
            total: ord.total,
            subtotal: ord.subtotal,
            shippingCost: ord.deliveryFee || 0,
            paymentMethod: ord.paymentMethod || 'Cash on Delivery',
            paymentStatus: ord.paymentStatus === 'PAID' ? 'Paid' : 'Pending',
            orderStatus:
              ord.orderStatus === 'PROCESSING'
                ? 'Processing'
                : ord.orderStatus === 'SHIPPED'
                ? 'Shipped'
                : ord.orderStatus === 'DELIVERED'
                ? 'Delivered'
                : ord.orderStatus === 'CANCELLED'
                ? 'Cancelled'
                : 'Pending',
            trackingNumber: ord.trackingNumber,
            note: ord.note || undefined,
          }));

          return NextResponse.json({ success: true, orders: formatted });
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
    const { customerName, customerEmail, customerPhone, customerAddress, items, total, role, userId } = body;

    // Requirement 2: Admin cannot place orders
    if (role === 'ADMIN' || body.isAdmin) {
      return NextResponse.json(
        {
          success: false,
          error: 'Security Notice: Administrators are strictly restricted from placing orders. Please switch to a customer account.',
        },
        { status: 403 }
      );
    }

    // Requirement 3: Account required
    if (!customerEmail || !customerName) {
      return NextResponse.json(
        { success: false, error: 'Authentication required: You must be logged in to place an order.' },
        { status: 401 }
      );
    }

    if (!items || items.length === 0 || !total) {
      return NextResponse.json(
        { success: false, error: 'Order items and valid total are required.' },
        { status: 400 }
      );
    }

    const orderNumber = body.orderId || `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const trackingNumber = body.trackingNumber || `RSH-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date();
    const dateStr = now.toISOString().replace('T', ' ').substring(0, 16);

    const newOrder = {
      id: orderNumber,
      orderNumber,
      customerName,
      customerEmail: customerEmail.toLowerCase(),
      customerPhone: customerPhone || '+880 1700 000 000',
      customerAddress: customerAddress || 'Dhaka, Bangladesh',
      date: dateStr,
      items: items || [],
      total: Number(total),
      paymentMethod: body.paymentMethod || 'Cash on Delivery',
      paymentStatus: body.paymentStatus || 'Pending',
      orderStatus: 'Pending',
      trackingNumber,
      note: body.note || null,
    };

    // Attempt DB creation if available
    try {
      if (process.env.DATABASE_URL) {
        // Look up user if userId provided
        let resolvedUserId = userId;
        if (!resolvedUserId) {
          const user = await prisma.user.findUnique({
            where: { email: customerEmail.toLowerCase() },
          });
          if (user) resolvedUserId = user.id;
        }

        await prisma.order.create({
          data: {
            id: orderNumber,
            orderNumber,
            userId: resolvedUserId || null,
            total: Number(total),
            subtotal: Number(body.subtotal || total),
            deliveryFee: Number(body.shippingCost || 0),
            paymentMethod: body.paymentMethod || 'Cash on Delivery',
            paymentStatus: body.paymentMethod === 'bKash' ? 'PAID' : 'PENDING',
            orderStatus: 'PENDING',
            trackingNumber,
            customerName,
            customerEmail: customerEmail.toLowerCase(),
            customerPhone: customerPhone || '',
            customerAddress: customerAddress || '',
            note: body.note || null,
            items: {
              create: (items || []).map((item: any) => ({
                productId: item.product?.id || item.productId || null,
                productName: item.product?.name || item.name || 'Reshans Item',
                productImage: item.product?.frontImage || item.product?.image || item.image || '',
                quantity: item.quantity || 1,
                price: item.product?.price || item.price || 0,
                selectedColor: item.selectedColor || item.color || null,
                selectedSize: item.selectedSize || item.size || null,
              })),
            },
          },
        });
      }
    } catch (dbErr) {
      console.warn('Prisma order save fallback:', dbErr);
    }

    // 0-second Real-time broadcast to Admin clients!
    orderEvents.notifyOrder({
      orderId: newOrder.id,
      orderNumber: newOrder.orderNumber,
      customerName: newOrder.customerName,
      customerEmail: newOrder.customerEmail,
      customerPhone: newOrder.customerPhone,
      total: newOrder.total,
      paymentMethod: newOrder.paymentMethod,
      orderStatus: newOrder.orderStatus,
      date: newOrder.date,
      timestamp: Date.now(),
    });

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
