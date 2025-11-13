import { NextResponse } from 'next/server';
import * as cookie from 'cookie';

export const POST = async (
  req: Request,
  { params }: { params: Promise<{ productId: string }> },
) => {
  const { productId } = await params;
  try {
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

    const body = await req.json();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_SERVER}/comment/${productId}`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
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
