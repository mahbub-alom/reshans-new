import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { INITIAL_ORDERS } from '@/data/adminInitialData';
import { orderEvents } from '@/lib/orderEvents';

const mapOrderStatusToPrisma = (status: string) => {
  const upper = status.toUpperCase();
  if (upper === 'PROCESSING') return 'PROCESSING';
  if (upper === 'SHIPPED') return 'SHIPPED';
  if (upper === 'DELIVERED') return 'DELIVERED';
  if (upper === 'CANCELLED') return 'CANCELLED';
  return 'PENDING';
};

const mapOrderStatusFromPrisma = (status: string) => {
  const upper = status.toUpperCase();
  if (upper === 'PROCESSING') return 'Processing';
  if (upper === 'SHIPPED') return 'Shipped';
  if (upper === 'DELIVERED') return 'Delivered';
  if (upper === 'CANCELLED') return 'Cancelled';
  return 'Pending';
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const decodedId = decodeURIComponent(id).trim();

    if (process.env.DATABASE_URL) {
      try {
        const order = await prisma.order.findFirst({
          where: {
            OR: [
              { id: decodedId },
              { orderNumber: decodedId },
              { trackingNumber: decodedId },
            ],
          },
          include: { items: true },
        });

        if (order) {
          const formatted = {
            id: order.id || order.orderNumber,
            orderNumber: order.orderNumber || order.id,
            customerName: order.customerName,
            customerEmail: order.customerEmail,
            customerPhone: order.customerPhone,
            customerAddress: order.customerAddress,
            date: order.createdAt ? new Date(order.createdAt).toISOString().replace('T', ' ').substring(0, 16) : '',
            items: (order.items || []).map((it: any) => ({
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
            total: order.total,
            subtotal: order.subtotal,
            shippingCost: order.deliveryFee || 0,
            paymentMethod: order.paymentMethod || 'Cash on Delivery',
            paymentStatus: order.paymentStatus === 'PAID' ? 'Paid' : 'Pending',
            orderStatus: mapOrderStatusFromPrisma(order.orderStatus),
            trackingNumber: order.trackingNumber || order.id,
            note: order.note || undefined,
          };
          return NextResponse.json({ success: true, order: formatted });
        }
      } catch (dbErr) {
        console.warn('Prisma get order fallback:', dbErr);
      }
    }

    const order = INITIAL_ORDERS.find(
      (o) =>
        o.id.toLowerCase() === decodedId.toLowerCase() ||
        (o.trackingNumber && o.trackingNumber.toLowerCase() === decodedId.toLowerCase())
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
    const decodedId = decodeURIComponent(id).trim();
    const body = await request.json();
    const { orderStatus, paymentStatus, trackingNumber } = body;

    let updatedOrder: any = null;

    if (process.env.DATABASE_URL) {
      try {
        const prismaOrderStatus = orderStatus ? mapOrderStatusToPrisma(orderStatus) : undefined;
        const prismaPaymentStatus =
          paymentStatus && paymentStatus.toUpperCase() === 'PAID'
            ? 'PAID'
            : paymentStatus && paymentStatus.toUpperCase() === 'REFUNDED'
            ? 'REFUNDED'
            : paymentStatus
            ? 'PENDING'
            : undefined;

        // Find by id or orderNumber
        const existing = await prisma.order.findFirst({
          where: {
            OR: [{ id: decodedId }, { orderNumber: decodedId }],
          },
        });

        if (existing) {
          const updated = await prisma.order.update({
            where: { id: existing.id },
            data: {
              ...(prismaOrderStatus && { orderStatus: prismaOrderStatus as any }),
              ...(prismaPaymentStatus && { paymentStatus: prismaPaymentStatus as any }),
              ...(trackingNumber && { trackingNumber }),
            },
            include: { items: true },
          });

          updatedOrder = {
            id: updated.id,
            orderNumber: updated.orderNumber,
            customerName: updated.customerName,
            customerEmail: updated.customerEmail,
            customerPhone: updated.customerPhone,
            total: updated.total,
            paymentMethod: updated.paymentMethod,
            paymentStatus: updated.paymentStatus === 'PAID' ? 'Paid' : updated.paymentStatus === 'REFUNDED' ? 'Refunded' : 'Pending',
            orderStatus: mapOrderStatusFromPrisma(updated.orderStatus),
            trackingNumber: updated.trackingNumber,
            date: updated.createdAt ? new Date(updated.createdAt).toISOString().replace('T', ' ').substring(0, 16) : '',
          };
        }
      } catch (dbErr) {
        console.warn('Prisma order update fallback:', dbErr);
      }
    }

    // Broadcast SSE update event
    if (updatedOrder) {
      orderEvents.notifyOrder({
        orderId: updatedOrder.id,
        orderNumber: updatedOrder.orderNumber,
        customerName: updatedOrder.customerName,
        customerEmail: updatedOrder.customerEmail,
        customerPhone: updatedOrder.customerPhone,
        total: updatedOrder.total,
        paymentMethod: updatedOrder.paymentMethod,
        orderStatus: updatedOrder.orderStatus,
        paymentStatus: updatedOrder.paymentStatus,
        date: updatedOrder.date,
        timestamp: Date.now(),
      });
    } else {
      orderEvents.notifyOrder({
        orderId: decodedId,
        orderNumber: decodedId,
        customerName: '',
        customerEmail: '',
        total: 0,
        paymentMethod: '',
        orderStatus: orderStatus || '',
        paymentStatus: paymentStatus || '',
        date: '',
        timestamp: Date.now(),
      });
    }

    return NextResponse.json({
      success: true,
      order: updatedOrder || { id: decodedId, ...body },
      message: 'Order updated successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update order' },
      { status: 500 }
    );
  }
}
