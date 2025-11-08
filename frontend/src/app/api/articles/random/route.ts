import { NextResponse } from 'next/server';

const API_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/new%20articles?select=*`;
const API_KEY = process.env.SUPABASE_KEY;

function getRandomIndices(length: number, count: number) {
  const indices = new Set<number>();
  while (indices.size < Math.min(count, length)) {
    indices.add(Math.floor(Math.random() * length));
  }
  return Array.from(indices);
}

export async function GET() {
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
      const text = await response.text();
      console.error('Supabase fetch failed:', response.status, text);
      return NextResponse.json(
        { error: text || 'Failed to fetch articles' },
        { status: response.status },
      );
    }

    const data = await response.json();

    const articles = (Array.isArray(data) ? data : []).map((item: any) => ({
      id: item.id,
      title: item.title,
      image: item.images?.[0] ?? null,
      date: item.date ?? null,
    }));

    const randomIndices = getRandomIndices(articles.length, 3);
    const randomArticles = randomIndices.map(i => articles[i]);

    return NextResponse.json(randomArticles);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
