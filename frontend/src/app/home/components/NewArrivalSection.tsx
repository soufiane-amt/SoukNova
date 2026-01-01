'use client';
import { poppins } from '@/layout';
import CustomButton from '../../../components/buttons/CustomButton';
import ProductCard from '../../../components/cards/ProductCard/ProductCard';
import ProductCarouselSkeleton from './ProductCarouselSkeleton';
import { useEffect, useState } from 'react';
import { ProductType } from '../../../types/product.dt';

export default function NewArrivalSection() {
  const [recentProducts, setRecentProducts] = useState<ProductType[]>([]);
  useEffect(() => {
    const fetchRecentProduct = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/product/recent`,
      );
      const data = await res.json();
      setRecentProducts(data);
    };
    fetchRecentProduct();
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
      {recentProducts.length > 0 ? (
        <div className="flex overflow-x-auto overflow-y-hidden space-x-6 pt-5 pb-1 custom-scrollbar">
          {recentProducts.map((item, index) => (
            <div data-aos="fade-up" data-aos-delay={index * 100} key={index}>
                <ProductCard
                  productId={item.id}
                  productName={item.title}
                  currentPrice={item.price}
                  originalPrice={item.price}
                  discountPercentage={item.discount}
                  rating={item.rate ?? 5}
                  image={item.primary_image}
                  date={item.date ?? ''}
                />
            </div>
          ))}
        </div>
      ) : (
        <ProductCarouselSkeleton />
      )}
    </section>
  );
}
