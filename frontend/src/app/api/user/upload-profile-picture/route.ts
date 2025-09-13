import { NextResponse } from 'next/server';
import cookie from 'cookie';

export const POST = async (req: Request) => {
  try {
    // Get JWT from cookies
    const cookies = cookie.parse(req.headers.get('cookie') || '');
    const token = cookies.jwt;
    console.log('➡️ Token from cookie:', token);

    // Forward the request body as-is (multipart/form-data)
    const body = await req.arrayBuffer(); // Read raw data
    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
      'Content-Type': req.headers.get('Content-Type') || '',
    };

    const res = await fetch('http://localhost:3001/user/upload-profile-picture', {
      method: 'POST',
      headers,
      body,
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Failed to upload profile picture' },
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
