import { NextResponse } from 'next/server';
import * as cookie from 'cookie';

export const GET = async (req: Request) => {
  try {
    const cookies = cookie.parse(req.headers.get('cookie') || '');
    const token = cookies.jwt;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch cart' },
        { status: res.status },
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error('❌ Proxy error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};

export const DELETE = async (req: Request) => {
  try {
    const cookies = cookie.parse(req.headers.get('cookie') || '');
    const token = cookies.jwt;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/reset`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Failed to delete carts' },
        { status: res.status },
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error('❌ Proxy error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};
