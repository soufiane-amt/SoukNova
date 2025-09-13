import { NextResponse } from 'next/server';
import cookie from 'cookie';

export async function GET(req: Request) {
  try {
    const cookies = cookie.parse(req.headers.get('cookie') || '');
    const token = cookies.jwt;

    // if (!token) {
    //   return NextResponse.json(
    //     { error: 'Not authenticated' },
    //     { status: 401 }
    //   );
    // }

    const res = await fetch('http://localhost:3001/user/profile', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch profile' },
        { status: res.status }
      );
    }
    console.log("====> ", res)

    const data = await res.json();
    console.log("====> ", data)
    // 3️⃣ Return the backend response to the client
    return NextResponse.json(data);
  } catch (err: any) {
    console.error('❌ Error fetching profile:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
