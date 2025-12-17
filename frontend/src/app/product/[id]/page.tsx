'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import 'aos/dist/aos.css';
import Loader from '../../../components/feedback/loader/Loader';
import Product from '../components/Product';
import { SiteFooter } from '../../../components/layout/SiteFooter';
import { ProductType } from '../../../types/product.dt';

export default function ProductPage() {
  const { id } = useParams();
  const [productData, setProductData] = useState<ProductType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/product/${id}`,
          {
            method: 'GET',
            credentials: 'include',
          },
        );
        if (!response.ok) {
          throw new Error('Failed to fetch product data.');
        }

        const data = await response.json();
        setProductData(data);
      } catch (err: any) {
        setError(err.message);
      } 
    };

    fetchProduct();
  }, [id]);

  if (!productData) {
    return <Loader />;
  }
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <main>
      <div className="md:mx-20 mx-10  mt-10 lg:mx-30 mb-10">
        <Product productData={productData} />
      </div>
      <SiteFooter />
    </main>
  );
}
