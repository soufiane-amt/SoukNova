import NavBar from '@/components/Navbar';
import { ProductCard } from '@/components/Product/ProductCard';
import RatingStars from '@/components/RatingStars';
import CustomCarousel from '@/home/components/CustomCarousel';
import { PromoSection } from '@/home/components/PromoSection';
import React from 'react';

const imageUrl = '/images/content/product1.png';

export default function main() {
  return (
    <>
      {/* <PromoSection /> */}
      <ProductCard productName='Loveseat Sofa' currentPrice={199.00} originalPrice={499.00} rating={5} image={imageUrl}/>
    </>
  );
}
