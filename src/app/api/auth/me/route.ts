import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ success: false, authenticated: false }, { status: 401 });
    }

    if (authHeader.includes('admin')) {
      return NextResponse.json({
        success: true,
        authenticated: true,
        user: {
          id: 'USR-ADMIN-01',
          name: 'Reshans Admin',
          email: 'admin@reshans.com',
          role: 'ADMIN',
          avatar: '/assets/img/others/dashboard-avater.jpg',
        },
      });
    }

    return NextResponse.json({
      success: true,
      authenticated: true,
      user: {
        id: 'USR-CUST-01',
        name: 'Floyd Miles',
        email: 'floyd.miles@example.com',
        role: 'CUSTOMER',
        avatar: '/assets/img/others/dashboard-avater.jpg',
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Auth check failed' },
      { status: 500 }
    );
  }
}
