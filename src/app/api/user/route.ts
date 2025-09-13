import { NextResponse } from 'next/server';
import cookie from 'cookie';

export async function PUT(req: Request) {
  const cookies = cookie.parse(req.headers.get('cookie') || '');
  const token = cookies.jwt;

  console.log('➡️ Token from cookie:', token);

  try {
    const body = await req.json();

    const res = await fetch('http://localhost:3001/user', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Failed to update profile' },
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
