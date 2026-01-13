'use client';
import { poppins } from '@/layout';
import CustomButton from '../../../components/buttons/CustomButton';
import ProductCard from '../../../components/cards/ProductCard/ProductCard';
import ProductCarouselSkeleton from './ProductCarouselSkeleton';
import { useEffect, useState } from 'react';
import { ProductType } from '../../../types/product.dt';

export default function NewArrivalSection() {
  const [recentProducts, setRecentProducts] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecentProduct = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/product/recent`,
        );
        const data = await res.json();
        setRecentProducts(data);
      } catch (error) {
        console.error('Failed to fetch recent products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecentProduct();
  }, []);

  return (
    <section aria-labelledby="new-arrivals" className="my-16">
      {/* Header */}
      <div
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8"
        data-aos="fade-up"
      >
        <div>
          <span className="text-orange-500 text-sm font-medium uppercase tracking-wider mb-2 block">
            Fresh Arrivals
          </span>
          <h2
            className={`text-3xl md:text-4xl font-semibold text-[#141718] ${poppins.className}`}
          >
            New Arrivals
          </h2>
        </div>
        <CustomButton label="View All Products" href="/shop" />
      </div>

      {/* Products Carousel */}
      {isLoading ? (
        <ProductCarouselSkeleton />
      ) : recentProducts.length > 0 ? (
        <div className="flex overflow-x-auto overflow-y-hidden space-x-6 pt-2 pb-4 custom-scrollbar -mx-2 px-2">
          {recentProducts.map((item, index) => (
            <div
              data-aos="fade-up"
              data-aos-delay={index * 80}
              key={item.id}
              className="flex-shrink-0"
            >
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
        <div className="text-center py-12 text-color-primary">
          <p>No products available at the moment.</p>
        </div>
      )}
    </section>
  );
}
