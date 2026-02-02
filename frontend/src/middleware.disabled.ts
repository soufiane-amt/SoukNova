import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as cookie from 'cookie';

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  const publicPaths = ['/auth', '/admin/login', '/_next', '/favicon.ico'];
  if (publicPaths.some((p) => url.pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const verifyUrl = `${process.env.NEXT_PUBLIC_API_SERVER}/auth/verify-token`;
  const cookies = cookie.parse(req.headers.get('cookie') || '');
  const token = cookies.jwt;

  const headers: Record<string, string> = {};
  if (token) headers.cookie = `jwt=${token}`;

  try {
    const res = await fetch(verifyUrl, {
      method: 'GET',
      headers,
    });
    if (res.ok) {
      console.log('Token is valid, proceeding to requested page.');
      return NextResponse.next();
    }
    else if (url.pathname.startsWith("/admin"))
    {
      console.log('Token is invalid or missing, redirecting to admin login page.');
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
     else {
      url.pathname = '/auth/signin';
      return NextResponse.redirect(url);
    }
  } catch (error) {
    console.error(error);
    url.pathname = '/auth/signin';
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ['/admin/:path*', '/account/:path*', '/cart', '/checkout', '/orderComplete'],
};


