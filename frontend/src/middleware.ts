import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as cookie from 'cookie';

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  const publicPaths = ['/auth', '/_next', '/favicon.ico'];
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
      return NextResponse.next();
    } else {
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
  // matcher: ['/account/:path*', '/cart', '/checkout', '/orderComplete'],
};


