import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Check if the user has the secure cookie
  const hasSession = request.cookies.has('admin_session');
  // 2. If they're trying to access an admin page without a session, redirect to login
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!hasSession) {
      // if they don't have a valid session, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

    // 3. If they're trying to access the login page but already have a session, redirect to dashboard
  if (request.nextUrl.pathname === '/login') {
    if (hasSession) {
      // redirect to dashboard if they are already logged in
      return NextResponse.redirect(new URL('/admin/requests', request.url));
    }
  }

  return NextResponse.next();
}

// 4. Specify which paths should be protected by this middleware
export const config = {
  matcher: ['/admin/:path*', '/login'],
};