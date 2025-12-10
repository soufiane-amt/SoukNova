'use client';
import { poppins } from '@/layout';
import CustomButton from '../../../components/buttons/CustomButton';
import Link from 'next/link';
import { ProductCard } from '../../../components/cards/ProductCard/ProductCard';
import { useCart } from '../../../context/CartContext';

export default function NewArrivalSection() {
  const { products } = useCart();

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
                productId={item.id}
                productName={item.title}
                currentPrice={item.price}
                originalPrice={item.originalPrice}
                discountPercentage={item.discount}
                rating={item.rate}
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
