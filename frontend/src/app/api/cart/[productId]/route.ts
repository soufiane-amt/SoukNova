import { NextResponse } from 'next/server';
import * as cookie from 'cookie';

export const POST = async (
  req: Request,
  { params }: { params: Promise<{ productId: string }> },
) => {
  try {
    const { productId } = await params;

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
      `${process.env.API_SERVER}/cart/${productId}`,
      {
        method: 'POST',
        headers,
      },
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Failed to add to cart' },
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
  try {
    const { productId } = await params;
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
      `${process.env.API_SERVER}/cart/${productId}`,
      {
        method: 'DELETE',
        headers,
      },
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Failed to add to cart' },
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

export const PATCH = async (
  req: Request,
  { params }: { params: Promise<{ productId: string }> },
) => {
  try {
    const { productId } = await params;

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

    const res = await fetch(
      `${process.env.API_SERVER}/cart/${productId}`,
      {
        method: 'PATCH',
        headers,
      },
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Failed to update cart item' },
        { status: res.status },
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error('❌ Proxy error (PATCH):', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};

export const GET = async (
  req: Request,
  { params }: { params: Promise<{ productId: string }> },
) => {
  try {
    const { productId } = await params;
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
      `${process.env.API_SERVER}/cart/${productId}`,
      {
        method: 'GET',
        headers,
      },
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Failed to add to cart' },
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
