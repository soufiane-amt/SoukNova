import { NextResponse } from 'next/server';
import { getFirstTwoWords } from '../../../../utils/helpers';

const API_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/products?select=*`;
const API_KEY = process.env.SUPABASE_KEY;

export const GET = async (
  req: Request,
  context: { params: { productId: string } },
) => {
  try {
    const { id } = await context.params;
    const response = await fetch(`${API_URL}&id=eq.${id}`, {
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

    const products = data.map((item: any) => ({
      id: item.id,
      title: getFirstTwoWords(item.title),
      price: item.Price,
      originalPrice: item.originalPrice,
      discount: item.discount,
      rate: item.Rate,
      primary_image: item.primary_image,
      date: item.Date,
      reviews: item.reviews,
      images: item.images,
      package_dimensions: item.package_dimensions,
      categoriesText: JSON.parse(item.categoriesText.replace(/'/g, '"')).join(
        ', ',
      ),
      about_item: item.about_item,
    }));

    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
