import { NextResponse } from 'next/server';
import { decrypt } from '@/lib/auth';

export async function middleware(request) {
  const path = request.nextUrl.pathname;
  
  // Protect admin routes except the login endpoint itself
  if (path.startsWith('/admin/dashboard') || (path.startsWith('/api/admin') && path !== '/api/admin/login')) {
    const sessionCookie = request.cookies.get('admin_session')?.value;
    
    if (!sessionCookie) {
      if (path.startsWith('/api/')) {
         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    
    // Verify the token
    const payload = await decrypt(sessionCookie);
    if (!payload || payload.role !== 'admin') {
      if (path.startsWith('/api/')) {
         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  // If user is already logged in, redirect them away from /admin login page
  if (path === '/admin') {
    const sessionCookie = request.cookies.get('admin_session')?.value;
    if (sessionCookie) {
      const payload = await decrypt(sessionCookie);
      if (payload && payload.role === 'admin') {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/dashboard/:path*', '/api/admin/:path*'],
};
