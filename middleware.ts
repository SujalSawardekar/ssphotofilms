import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || request.nextUrl.hostname;

  // 1. Keep full website unlocked on localhost & Vercel (.vercel.app) domains
  if (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname.endsWith('.vercel.app') ||
    process.env.NODE_ENV === 'development'
  ) {
    return NextResponse.next();
  }

  // 2. Allow preview bypass on live domain if secret ?preview=true parameter or cookie is present
  const isPreviewParam = request.nextUrl.searchParams.get('preview') === 'true';
  const hasPreviewCookie = request.cookies.get('ss_preview')?.value === 'true';

  if (isPreviewParam || hasPreviewCookie) {
    const res = NextResponse.next();
    if (isPreviewParam) {
      res.cookies.set('ss_preview', 'true', { path: '/', maxAge: 60 * 60 * 24 * 7 });
    }
    return res;
  }

  const { pathname } = request.nextUrl;

  // 1. Allow Next.js static assets & public images
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

  // 2. Allow API routes & Admin panel
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/login')
  ) {
    return NextResponse.next();
  }

  // 3. Allow direct access to /coming-soon
  if (pathname === '/coming-soon') {
    return NextResponse.next();
  }

  // 4. In production: rewrite root / to /coming-soon (so URL stays clean / while showing Coming Soon)
  if (pathname === '/') {
    return NextResponse.rewrite(new URL('/coming-soon', request.url));
  }

  // 5. Redirect all other public pages to /
  return NextResponse.redirect(new URL('/', request.url));
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
