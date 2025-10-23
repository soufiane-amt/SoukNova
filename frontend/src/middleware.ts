import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  const publicPaths = ['/auth', '/_next', '/favicon.ico'];
  if (publicPaths.some((p) => url.pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const verifyUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-token`;

  try {
    const res = await fetch(verifyUrl, {
      method: 'GET',
      headers: {
        cookie: req.headers.get('cookie') || '', 
      },
      credentials: 'include',
    });

    if (res.ok) {
      return NextResponse.next();
    } else {
      url.pathname = '/auth/signin';
      return NextResponse.redirect(url);
    }
  } catch (error) {
    // Backend unreachable or error occurred
    url.pathname = '/auth/signin';
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ['/account/:path*', '/cart', '/checkout', '/orderComplete'],
};
