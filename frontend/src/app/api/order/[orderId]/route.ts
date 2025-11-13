import { NextResponse } from 'next/server';
import * as cookie from 'cookie';

export const GET = async (
  req: Request,
  { params }: { params: Promise<{ orderId: string }> },
) => {
  const { orderId } = await params;
  try {
    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
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
      `${process.env.NEXT_PUBLIC_API_SERVER}/order/${orderId}`,
      {
        method: 'GET',
        headers,
      },
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Failed to get the order' },
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
