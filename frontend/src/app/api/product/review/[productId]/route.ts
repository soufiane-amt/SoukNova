import { NextResponse } from 'next/server';
import cookie from 'cookie';

export const POST = async (
  req: Request,
  context: { params: { productId: string } },
) => {
  try {
    const { productId } = await context.params;

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 },
      );
    }

    const cookies = cookie.parse(req.headers.get('cookie') || '');
    const token = cookies.jwt;

    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    const body = await req.json(); // parse incoming JSON

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/comment/${productId}`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
        duplex: 'half',
      },
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Failed to add comment' },
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
