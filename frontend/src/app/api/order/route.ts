import { NextResponse } from 'next/server';
import * as cookie from 'cookie';

export const GET = async (req: Request) => {
  try {
    const cookies = cookie.parse(req.headers.get('cookie') || '');
    const token = cookies.jwt;

    const res = await fetch(`${process.env.API_SERVER}/order`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch order' },
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

export async function POST(req: Request) {
  const cookies = cookie.parse(req.headers.get('cookie') || '');
  const token = cookies.jwt;

  try {
    const body = await req.json();

    const res = await fetch(`${process.env.API_SERVER}/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Failed to place order' },
        { status: res.status },
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error('❌ Proxy error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
