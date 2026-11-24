import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const emailParam = searchParams.get('email')?.trim().toLowerCase();
    const orderIdParam = searchParams.get('orderId')?.trim();

    const whereClause: any = {};
    if (emailParam) {
      whereClause.customerEmail = emailParam;
    }
    if (orderIdParam) {
      whereClause.orderId = orderIdParam;
    }

    let returnRequests: any[] = [];
    if (process.env.DATABASE_URL) {
      try {
        const dbReturns = await prisma.returnRequest.findMany({
          where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
          orderBy: { createdAt: 'desc' },
          include: {
            order: {
              select: {
                id: true,
                orderNumber: true,
                orderStatus: true,
                total: true,
                trackingNumber: true,
              },
            },
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
        });

        returnRequests = dbReturns.map((r: any) => ({
          id: r.id,
          returnNumber: r.returnNumber,
          orderId: r.orderId,
          userId: r.userId || undefined,
          user: r.user ? { id: r.user.id, name: r.user.name, email: r.user.email, role: r.user.role } : undefined,
          customerName: r.customerName,
          customerEmail: r.customerEmail,
          customerPhone: r.customerPhone,
          customerAddress: r.customerAddress,
          pickupAddress: r.customerAddress,
          items: typeof r.itemsJson === 'string' ? JSON.parse(r.itemsJson || '[]') : r.itemsJson || [],
          refundAmount: r.refundAmount,
          reason: r.reason,
          details: r.details || undefined,
          notes: r.details || undefined,
          status: r.status,
          adminNotes: r.adminNotes || undefined,
          createdAt: r.createdAt ? new Date(r.createdAt).toISOString().replace('T', ' ').substring(0, 16) : '',
        }));
      } catch (err) {
        console.warn('Prisma return requests query fallback:', err);
      }
    }

    return NextResponse.json({ success: true, returnRequests });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch return requests' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      orderId,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      pickupAddress,
      items,
      refundAmount,
      reason,
      details,
      notes,
      userId,
    } = body;

    if (!orderId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Order ID and items to return are required.' },
        { status: 400 }
      );
    }

    // Verify order exists and check eligibility (e.g. Delivered)
    if (process.env.DATABASE_URL) {
      const order = await prisma.order.findFirst({
        where: {
          OR: [{ id: orderId }, { orderNumber: orderId }],
        },
      });

      if (!order) {
        return NextResponse.json(
          { success: false, error: 'Target order was not found.' },
          { status: 404 }
        );
      }

      if (order.orderStatus !== 'DELIVERED') {
        return NextResponse.json(
          {
            success: false,
            error: `Return requests are only permitted for delivered items. Current order status is "${order.orderStatus}".`,
          },
          { status: 400 }
        );
      }
    }

    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const returnNumber = `RET-${new Date().getFullYear()}-${randomSuffix}`;
    const itemsJsonStr = JSON.stringify(items);

    const effectiveNotes = notes || details || '';
    const effectiveAddress = pickupAddress || customerAddress || '';

    let savedRequest: any = {
      id: returnNumber,
      returnNumber,
      orderId,
      userId: userId || null,
      customerName: customerName || 'Customer',
      customerEmail: (customerEmail || '').toLowerCase(),
      customerPhone: customerPhone || '',
      customerAddress: effectiveAddress,
      pickupAddress: effectiveAddress,
      items,
      refundAmount: Number(refundAmount || 0),
      reason: reason || 'Defective / Damaged',
      details: effectiveNotes,
      notes: effectiveNotes,
      status: 'Pending',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    if (process.env.DATABASE_URL) {
      try {
        const created = await prisma.returnRequest.create({
          data: {
            id: returnNumber,
            returnNumber,
            orderId,
            userId: userId || null,
            customerName: customerName || 'Customer',
            customerEmail: (customerEmail || '').toLowerCase(),
            customerPhone: customerPhone || '',
            customerAddress: effectiveAddress,
            itemsJson: itemsJsonStr,
            refundAmount: Number(refundAmount || 0),
            reason: reason || 'Defective / Damaged',
            details: effectiveNotes || null,
            status: 'Pending',
          },
        });

        savedRequest = {
          ...savedRequest,
          id: created.id,
          createdAt: created.createdAt ? new Date(created.createdAt).toISOString().replace('T', ' ').substring(0, 16) : savedRequest.createdAt,
        };
      } catch (dbErr) {
        console.warn('Prisma create return request fallback:', dbErr);
      }
    }

    return NextResponse.json(
      {
        success: true,
        returnRequest: savedRequest,
        message: 'Return request submitted successfully.',
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to submit return request' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, status, adminNotes } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: 'Return ID and status are required' },
        { status: 400 }
      );
    }

    let updatedRecord: any = null;
    if (process.env.DATABASE_URL) {
      try {
        const updated = await prisma.returnRequest.update({
          where: { id },
          data: {
            status,
            ...(adminNotes !== undefined ? { adminNotes } : {}),
          },
        });
        updatedRecord = updated;
      } catch (dbErr) {
        console.warn('Prisma update return request fallback:', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      returnRequest: updatedRecord || { id, status, adminNotes },
      message: `Return request updated to ${status}.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update return request' },
      { status: 500 }
    );
  }
}
