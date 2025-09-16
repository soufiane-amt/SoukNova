// app/api/wishlist/[productId]/route.ts
import { NextResponse } from 'next/server';
import cookie from 'cookie';

export const POST = async (req: Request, context: { params: { productId: string } }) => {
  try {
    const { productId } = await context.params;

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const cookies = cookie.parse(req.headers.get('cookie') || '');
    const token = cookies.jwt;

    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
      'Content-Type': req.headers.get('Content-Type') || 'application/json',
    };

    const res = await fetch(`http://localhost:3001/wishlist/${productId}`, {
      method: 'POST',
      headers,
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to add to wishlist' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error('❌ Proxy error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};


export const DELETE = async (req: Request, { params }: { params: { productId: string } }) => {
  const { productId } = params;
  if (!productId) return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });

  try {
    const cookies = cookie.parse(req.headers.get('cookie') || '');
    const token = cookies.jwt;

    const res = await fetch(`http://localhost:3001/wishlist/${productId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error('Failed to remove from wishlist');

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};
