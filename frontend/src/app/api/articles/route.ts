import { NextRequest, NextResponse } from 'next/server';

const API_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/new%20articles?select=*`;
const API_KEY = process.env.SUPABASE_KEY;

export async function GET(req: NextRequest) {
  try {
    const response = await fetch(API_URL, {
      headers: {
        apikey: API_KEY!,
        Authorization: `Bearer ${API_KEY}`,
        Accept: 'application/json',
        'Accept-Profile': 'public',
      },
    });

    if (!response.ok) {
      const text = await response.text(); // get actual error response
      console.error('Supabase fetch failed:', response.status, text);
      return NextResponse.json({ error: text || 'Failed to fetch articles' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
