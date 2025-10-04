import { NextResponse } from 'next/server';

const API_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/products?select=*`;
const API_KEY = process.env.SUPABASE_KEY;

export const GET = async (req: Request) => {
  try {
    const response = await fetch(`${API_URL}`, {
      headers: {
        apikey: API_KEY!,
        Authorization: `Bearer ${API_KEY}`,
        Accept: 'application/json',
        'Accept-Profile': 'public',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error('API Route Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};
