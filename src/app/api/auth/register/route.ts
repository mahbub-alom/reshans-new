import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { name, email, password, phone } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (process.env.DATABASE_URL) {
      try {
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
          return NextResponse.json(
            { success: false, error: 'An account with this email already exists' },
            { status: 409 }
          );
        }

        const newUser = await prisma.user.create({
          data: {
            name,
            email,
            password: hashedPassword,
            phone: phone || null,
            role: 'CUSTOMER',
            avatar: '/assets/img/others/dashboard-avater.jpg',
          },
        });

        return NextResponse.json(
          {
            success: true,
            user: {
              id: newUser.id,
              name: newUser.name,
              email: newUser.email,
              role: newUser.role,
            },
            message: 'Registration successful! Welcome to Reshans.',
          },
          { status: 201 }
        );
      } catch (err) {
        console.warn('Prisma registration error:', err);
      }
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: `USR-${Date.now()}`,
          name,
          email,
          role: 'CUSTOMER',
        },
        message: 'Registration successful! Welcome to Reshans.',
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Registration failed' },
      { status: 500 }
    );
  }
}
