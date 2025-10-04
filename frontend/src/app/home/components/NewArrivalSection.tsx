'use client';
import { poppins } from '@/layout';
import CustomButton from '../../../components/buttons/CustomButton';
import { useEffect, useState } from 'react';
import { fetchFromSupabase } from '../../../lib/supbaseApi';
import Link from 'next/link';
import { ProductCard } from '../../../components/cards/ProductCard/ProductCard';
import Loader from '../../../components/feedback/loader/Loader';

export default function NewArrivalSection() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/product', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();

        setProducts(data.slice(0, 7));
      } catch (e) {
        console.error(e.message);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section aria-labelledby="new-arrivals" className="my-12">
      <div className="flex justify-between" data-aos="fade-up">
        <div className="w-20">
          <h1 className={`text-3xl font-medium ${poppins.className}`}>
            New Arrivals
          </h1>
        </div>
        <div className="flex justify-end mt-8">
          <CustomButton label="More products" href="/shop" />
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
