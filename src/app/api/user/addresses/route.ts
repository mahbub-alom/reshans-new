import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { SESSION_COOKIE_NAME, validateSessionToken } from '@/lib/auth';

async function getAuthUserId(request: Request) {
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  const authHeader = request.headers.get('authorization');
  const headerToken = authHeader?.startsWith('Bearer ')
    ? authHeader.substring(7)
    : authHeader;

  const token = headerToken || cookieToken;
  if (!token) return null;

  const user = await validateSessionToken(token);
  return user?.id || null;
}

// GET: Fetch user's saved addresses
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryUserId = searchParams.get('userId');
    const authId = await getAuthUserId(request);
    let userId = authId || queryUserId;

    if (!userId) {
      // Fallback to first customer in DB for guest/demo view
      const firstCustomer = await prisma.user.findFirst({
        where: { role: 'CUSTOMER' },
      });
      if (firstCustomer) {
        userId = firstCustomer.id;
      }
    }

    if (!userId) {
      return NextResponse.json({ success: true, addresses: [] });
    }

    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json({
      success: true,
      addresses: addresses.map((a) => ({
        id: a.id,
        title: a.title,
        name: a.name,
        street: a.street,
        city: a.city,
        area: (a as any).area || 'Banani',
        postalCode: a.postalCode || '',
        phone: a.phone,
        isDefault: a.isDefault,
        createdAt: a.createdAt.toISOString(),
      })),
    });
  } catch (error: any) {
    console.error('Fetch addresses error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch addresses' },
      { status: 500 }
    );
  }
}

// POST: Create a new saved address
export async function POST(request: Request) {
  try {
    const authId = await getAuthUserId(request);
    const body = await request.json();
    const { title, name, street, city, area, postalCode, phone, isDefault, userId: bodyUserId } = body;

    let targetUserId = authId || bodyUserId;
    if (!targetUserId) {
      const firstCustomer = await prisma.user.findFirst({
        where: { role: 'CUSTOMER' },
      });
      if (firstCustomer) targetUserId = firstCustomer.id;
    }

    if (!targetUserId) {
      return NextResponse.json(
        { success: false, error: 'User must be authenticated to add an address.' },
        { status: 401 }
      );
    }

    if (!title || !name || !street || !phone) {
      return NextResponse.json(
        { success: false, error: 'Title, recipient name, street address, and phone number are required.' },
        { status: 400 }
      );
    }

    // If marked as default, unset other defaults
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: targetUserId },
        data: { isDefault: false },
      });
    }

    // Check if this is user's first address -> make it default automatically
    const existingCount = await prisma.address.count({
      where: { userId: targetUserId },
    });

    const newAddress = await prisma.address.create({
      data: {
        userId: targetUserId,
        title: title.trim(),
        name: name.trim(),
        street: street.trim(),
        city: city ? city.trim() : 'Dhaka',
        area: area ? area.trim() : 'Banani',
        postalCode: postalCode ? postalCode.trim() : null,
        phone: phone.trim(),
        isDefault: isDefault || existingCount === 0,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Address saved successfully!',
      address: {
        id: newAddress.id,
        title: newAddress.title,
        name: newAddress.name,
        street: newAddress.street,
        city: newAddress.city,
        area: (newAddress as any).area || 'Banani',
        postalCode: newAddress.postalCode || '',
        phone: newAddress.phone,
        isDefault: newAddress.isDefault,
        createdAt: newAddress.createdAt.toISOString(),
      },
    });
  } catch (error: any) {
    console.error('Create address error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save address' },
      { status: 500 }
    );
  }
}

// PUT: Update an existing address or set as default
export async function PUT(request: Request) {
  try {
    const authId = await getAuthUserId(request);
    const body = await request.json();
    const { id, title, name, street, city, area, postalCode, phone, isDefault } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Address ID is required' },
        { status: 400 }
      );
    }

    const existing = await prisma.address.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Address not found' },
        { status: 404 }
      );
    }

    // If setting as default, unmark other defaults for this user
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: existing.userId },
        data: { isDefault: false },
      });
    }

    const updated = await prisma.address.update({
      where: { id },
      data: {
        title: title !== undefined ? title.trim() : existing.title,
        name: name !== undefined ? name.trim() : existing.name,
        street: street !== undefined ? street.trim() : existing.street,
        city: city !== undefined ? city.trim() : existing.city,
        area: area !== undefined ? area.trim() : (existing as any).area,
        postalCode: postalCode !== undefined ? postalCode.trim() : existing.postalCode,
        phone: phone !== undefined ? phone.trim() : existing.phone,
        isDefault: isDefault !== undefined ? isDefault : existing.isDefault,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Address updated successfully!',
      address: {
        id: updated.id,
        title: updated.title,
        name: updated.name,
        street: updated.street,
        city: updated.city,
        area: (updated as any).area || 'Banani',
        postalCode: updated.postalCode || '',
        phone: updated.phone,
        isDefault: updated.isDefault,
        createdAt: updated.createdAt.toISOString(),
      },
    });
  } catch (error: any) {
    console.error('Update address error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update address' },
      { status: 500 }
    );
  }
}

// DELETE: Delete an address
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Address ID is required' },
        { status: 400 }
      );
    }

    const existing = await prisma.address.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: true, message: 'Address already deleted' });
    }

    await prisma.address.delete({ where: { id } });

    // If the deleted address was default, make the next one default
    if (existing.isDefault) {
      const nextOne = await prisma.address.findFirst({
        where: { userId: existing.userId },
        orderBy: { createdAt: 'desc' },
      });
      if (nextOne) {
        await prisma.address.update({
          where: { id: nextOne.id },
          data: { isDefault: true },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Address deleted successfully!',
    });
  } catch (error: any) {
    console.error('Delete address error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete address' },
      { status: 500 }
    );
  }
}
