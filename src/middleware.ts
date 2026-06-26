import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/0V3R/dashboard')) {
    const token = req.cookies.get('ov_admin')?.value;
    if (!token || !(await verifyToken(token))) {
      return NextResponse.redirect(new URL('/0V3R', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/0V3R/dashboard/:path*'],
};
