'use client';
import { poppins } from '@/layout';
import CustomButton from '../../../components/buttons/CustomButton';
import Link from 'next/link';
import ProductCard from '../../../components/cards/ProductCard/ProductCard';
import { useEffect, useState } from 'react';

export default function NewArrivalSection() {
  const [recentProducts, setRecentProducts] = useState([])
  useEffect(()=>{
    const fetchRecentProduct = async()=>{
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/product/recent`);
      const data = await res.json()
      setRecentProducts(data)
    }
    fetchRecentProduct()
  }, [])
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
        {recentProducts.map((item, index) => (
          <div data-aos="fade-up" data-aos-delay={index * 100} key={index}>
            <Link href={`/product/${item.id}`}>
              <ProductCard
                productId={item.id}
                productName={item.title}
                currentPrice={item.price}
                originalPrice={item.price}
                discountPercentage={item.discount}
                rating={item.rate}
                image={item.primary_image}
                date={item.date}
              />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
