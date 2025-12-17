'use client';

import { NewsLetterSub } from '../../components/layout/NewsLetterSub';
import { SiteFooter } from '../../components/layout/SiteFooter';
import { useEffect, useState } from 'react';
import SectionShow from '../../components/ui/SectionShow';
import { inter } from '@/layout';
import ShopFilter from './components/ShopFilter';
import Loader from '../../components/feedback/loader/Loader';
import { usePagination } from '../../hooks/usePagination';
import { ProductType } from '../../types/product.dt';

const imageUrl = '/images/shop/shopPage.png';
const PAGE_SIZE = 12;

export default function ShopPage() {
  const [itemsData, setItemsData] = useState<{
    products: ProductType[];
    totalPages: number;
  }>();
  const [error, setError] = useState(null);

  const { page, handlePageChange } = usePagination();

  const [selectedCategory, setSelectedCategory] = useState('All Rooms');
  const [priceRange, setPriceRange] = useState<[number, number] | undefined>(
    undefined,
  );
  const [selectedOrder, setSelectedOrder] = useState<string | null>(
    'rate_desc',
  );

  useEffect(() => {
    const fetchProducts = async () => {
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
        params.append('page', String(page));
        params.append('pageSize', String(PAGE_SIZE));

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/product?${params.toString()}`,
          {
            method: 'GET',
            credentials: 'include',
          },
        );
        const data = await res.json();
        setItemsData(data);
      } catch (e: any) {
        setError(e.message);
      }
    };

    fetchProducts();
  }, [priceRange, selectedCategory, selectedOrder, page]);

  if (!itemsData) {
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
          itemsData={itemsData}
          page={page}
          handlePageChange={handlePageChange}
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
