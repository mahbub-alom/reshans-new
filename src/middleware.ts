import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('reshans_session_token')?.value;

  // Protect Admin API routes directly
  if (pathname.startsWith('/api/admin')) {
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Authentication required.' },
        { status: 401 }
      );
    }
  }

  // Protect URL browser navigation to protected dashboards:
  // If user enters /admin or /dashboard directly in the URL without token, redirect immediately to /login
  if (pathname.startsWith('/admin') || pathname.startsWith('/dashboard')) {
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/admin/:path*', '/admin/:path*', '/admin', '/dashboard/:path*', '/dashboard'],
};
