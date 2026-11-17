import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow root Coming Soon page
  if (pathname === '/') {
    return NextResponse.next();
  }

  // 2. Allow API routes (like /api/subscribe)
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // 3. Allow Admin panel (for Shreyas and studio staff)
  if (pathname.startsWith('/admin') || pathname.startsWith('/login')) {
    return NextResponse.next();
  }

  // 4. Allow Next.js static assets, media, and images
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/assets') ||
    pathname.startsWith('/icon') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.jpeg') ||
    pathname.endsWith('.svg') ||
    pathname.endsWith('.ico')
  ) {
    return NextResponse.next();
  }

  // 5. Redirect ALL other public pages (about, gallery, services, booking, etc.) to Coming Soon
  return NextResponse.redirect(new URL('/', request.url));
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
