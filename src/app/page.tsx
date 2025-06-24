import NavBar from '@/components/Navbar';
import { ProductCard } from '@/components/Product/ProductCard';
import RatingStars from '@/components/RatingStars';
import CustomCarousel from '@/home/components/CustomCarousel';
import NewProduct from '@/home/components/NewProduct';
import { PromoSection } from '@/home/components/PromoSection';
import React from 'react';

const imageUrl = '/images/content/product1.png';

export default function main() {
  return (
    <>
      {/* <PromoSection /> */}
      <div>
        <NewProduct/>
      </div>
      <div className="flex overflow-x-auto space-x-5 custom-scrollbar pb-12">
        <ProductCard
          productName="Loveseat Sofa"
          currentPrice={199.0}
          originalPrice={499.0}
          rating={5}
          image={imageUrl}
          isNew={true}
          discountPercentage={50}
        />
        <ProductCard
          productName="Loveseat Sofa"
          currentPrice={199.0}
          originalPrice={499.0}
          rating={5}
          image={imageUrl}
          isNew={true}
          discountPercentage={50}
        />
        <ProductCard
          productName="Loveseat Sofa"
          currentPrice={199.0}
          originalPrice={499.0}
          rating={5}
          image={imageUrl}
          isNew={true}
          discountPercentage={50}
        />
        <ProductCard
          productName="Loveseat Sofa"
          currentPrice={199.0}
          originalPrice={499.0}
          rating={5}
          image={imageUrl}
          isNew={true}
          discountPercentage={50}
        />
        <ProductCard
          productName="Loveseat Sofa"
          currentPrice={199.0}
          originalPrice={499.0}
          rating={5}
          image={imageUrl}
          isNew={true}
          discountPercentage={50}
        />
        <ProductCard
          productName="Loveseat Sofa"
          currentPrice={199.0}
          originalPrice={499.0}
          rating={5}
          image={imageUrl}
          isNew={true}
          discountPercentage={50}
        />
        <ProductCard
          productName="Loveseat Sofa"
          currentPrice={199.0}
          originalPrice={499.0}
          rating={5}
          image={imageUrl}
          isNew={true}
          discountPercentage={50}
        />
        <ProductCard
          productName="Loveseat Sofa"
          currentPrice={199.0}
          originalPrice={499.0}
          rating={5}
          image={imageUrl}
          isNew={true}
          discountPercentage={50}
        />
        <ProductCard
          productName="Loveseat Sofa"
          currentPrice={199.0}
          originalPrice={499.0}
          rating={5}
          image={imageUrl}
          isNew={true}
          discountPercentage={50}
        />
        <ProductCard
          productName="Loveseat Sofa"
          currentPrice={199.0}
          originalPrice={499.0}
          rating={5}
          image={imageUrl}
          isNew={true}
          discountPercentage={50}
        />
        <ProductCard
          productName="Loveseat Sofa"
          currentPrice={199.0}
          originalPrice={499.0}
          rating={5}
          image={imageUrl}
          isNew={true}
          discountPercentage={50}
        />
        <ProductCard
          productName="Loveseat Sofa"
          currentPrice={199.0}
          originalPrice={499.0}
          rating={5}
          image={imageUrl}
          isNew={true}
          discountPercentage={50}
        />
        <ProductCard
          productName="Loveseat Sofa"
          currentPrice={199.0}
          originalPrice={499.0}
          rating={5}
          image={imageUrl}
          isNew={true}
          discountPercentage={50}
        />
        <ProductCard
          productName="Loveseat Sofa"
          currentPrice={199.0}
          originalPrice={499.0}
          rating={5}
          image={imageUrl}
          isNew={true}
          discountPercentage={50}
        />
        <ProductCard
          productName="Loveseat Sofa"
          currentPrice={199.0}
          originalPrice={499.0}
          rating={5}
          image={imageUrl}
          isNew={true}
          discountPercentage={50}
        />
        <ProductCard
          productName="Loveseat Sofa"
          currentPrice={199.0}
          originalPrice={499.0}
          rating={5}
          image={imageUrl}
          isNew={true}
          discountPercentage={50}
        />
        <ProductCard
          productName="Loveseat Sofa"
          currentPrice={199.0}
          originalPrice={499.0}
          rating={5}
          image={imageUrl}
          isNew={true}
          discountPercentage={50}
        />
        <ProductCard
          productName="Loveseat Sofa"
          currentPrice={199.0}
          originalPrice={499.0}
          rating={5}
          image={imageUrl}
          isNew={true}
          discountPercentage={50}
        />
      </div>
    </>
  );
}
