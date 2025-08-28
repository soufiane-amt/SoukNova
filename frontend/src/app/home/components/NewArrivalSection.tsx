'use client';
import { poppins } from '@/layout';
import CustomButton from '../../../components/ui/CustomButton';
import { ProductCard } from '../../../components/ui/ProductCard';
import { useEffect, useState } from 'react';
import { fetchFromSupabase } from '../../../lib/supbaseApi';
import CircularIndeterminate from '../../../components/ui/CircularIndeterminate';
import Link from 'next/link';

export default function NewArrivalSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await fetchFromSupabase<any[]>('products', `select=*`);
        console.log('data ==> ', data);
        setProducts(data.slice(0,7));
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <CircularIndeterminate />
      </div>
    );
  }
  if (error) return <div>Error: {error}</div>;

  return (
    <section aria-labelledby="new-arrivals" className="my-12">
      <div className="flex justify-between" data-aos="fade-up">
        <div className="w-20">
          <h1 className={`text-3xl font-medium ${poppins.className}`}>
            New Arrivals
          </h1>
        </div>
        <div className="flex justify-end mt-8">
          <CustomButton label="More products" />
        </div>
      </div>
      <div className="flex overflow-x-auto overflow-y-hidden space-x-6 py-10 custom-scrollbar">
        {products.map((item, index) => (
          <div data-aos="fade-up" data-aos-delay={index * 100} key={index}>
            <Link href={`/product/${item.id}`}>
              <ProductCard
                productName={item.title}
                currentPrice={item.Price}
                originalPrice={item.originalPrice}
                discountPercentage={item.discount}
                rating={item.Rate}
                image={item.primary_image}
                date={Date().toString()}
              />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
