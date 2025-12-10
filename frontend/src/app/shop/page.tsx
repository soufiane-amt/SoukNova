'use client';

import { NewsLetterSub } from '../../components/layout/NewsLetterSub';
import { SiteFooter } from '../../components/layout/SiteFooter';
import { useEffect, useState } from 'react';
import SectionShow from '../../components/ui/SectionShow';
import { inter } from '@/layout';
import ShopFilter from './components/ShopFilter';
import Loader from '../../components/feedback/loader/Loader';

const imageUrl = '/images/shop/shopPage.png';

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState('All Rooms');
  const [priceRange, setPriceRange] = useState<[number, number] | undefined>(
    undefined,
  );
  const [selectedOrder, setSelectedOrder] = useState<string | null>(
    'rate_desc',
  );

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();

        if (selectedCategory && selectedCategory !== 'All Rooms') {
          params.append('category', selectedCategory);
        }

        if (priceRange) {
          params.append('minPrice', `${priceRange[0]}`);
          params.append('maxPrice', `${priceRange[1]}`);
        }

        if (selectedOrder) {
          params.append('order', selectedOrder);
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/product?${params.toString()}`,
          {
            method: 'GET',
            credentials: 'include',
          },
        );
        const data = await res.json();
        setProducts(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [priceRange, selectedCategory, selectedOrder]);

  if (loading) {
    return <Loader />;
  }
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div className={`mx-10 md:mx-20 ${inter.className}`}>
        <SectionShow
          imageUrl={imageUrl}
          head="Shop"
          desc="Let’s design the place you always imagined."
        />
        <ShopFilter
          products={products}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          setPriceRange={setPriceRange}
          priceRange={priceRange}
          setSelectedOrder={setSelectedOrder}
        />
      </div>

      <NewsLetterSub />
      <SiteFooter />
    </div>
  );
}
