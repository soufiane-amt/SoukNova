import { NextResponse } from 'next/server';
import { getFirstTwoWords } from '../../../../utils/helpers';

const API_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/products?select=*`;
const API_KEY = process.env.SUPABASE_KEY;

export const GET = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  console.log('API_URL : ', API_URL);
  const { id } = await params;
  try {
    const response = await fetch(`${API_URL}&id=eq.${id}`, {
      headers: {
        apikey: API_KEY!,
        Authorization: `Bearer ${API_KEY}`,
        Accept: 'application/json',
        'Accept-Profile': 'public',
      },
    });

    const comments = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/comment/${id}`,
      {
        headers: {
          Accept: 'application/json',
          'Accept-Profile': 'public',
        },
      },
    );
    const realComments = await comments.json();

    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }
    const data = await response.json();

    const item = data[0];

    const fakeReviews: {
      id: string;
      name: string;
      avatar: string;
      rate: number;
      content: string;
    }[] = item.reviews.map((review: any) => ({
      id: review.id + review.name,
      name: review.name,
      avatar: review.avatar,
      rate: review.rate,
      content: review.comments,
    }));
    const reviews = [
      ...realComments.map((review: any) => ({
        ...review,
        avatar: `${process.env.NEXT_PUBLIC_API_URL}${review.avatar}`,
      })),
      ...fakeReviews,
    ];

    const realReviewsRate =
      realComments.reduce((a: number, b: any) => a + b.rate, 0) /
      realComments.length;
    const product = {
      id: item.id,
      title: getFirstTwoWords(item.title),
      price: item.Price,
      originalPrice: item.originalPrice,
      discount: item.discount,
      rate: ((item.Rate + realReviewsRate) / 2).toFixed(2),
      primary_image: item.primary_image,
      date: item.Date,
      reviews: reviews,
      images: item.images,
      package_dimensions: item.package_dimensions,
      categoriesText: JSON.parse(item.categoriesText.replace(/'/g, '"')).join(
        ', ',
      ),
      about_item: item.about_item,
      item_model_number: item.item_model_number,
    };

    return NextResponse.json(product);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
