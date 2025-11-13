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
      'Content-Type': req.headers.get('Content-Type') || 'application/json',
    };

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_SERVER}/wishlist/${productId}`,
      {
        method: 'POST',
        headers,
      },
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Failed to add to wishlist' },
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

export const DELETE = async (
  req: Request,
  { params }: { params: Promise<{ productId: string }> },
) => {
  const { productId } = await params;
  if (!productId)
    return NextResponse.json(
      { error: 'Product ID is required' },
      { status: 400 },
    );

  try {
    const cookies = cookie.parse(req.headers.get('cookie') || '');
    const token = cookies.jwt;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_SERVER}/wishlist/${productId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!res.ok) throw new Error('Failed to remove from wishlist');

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};
