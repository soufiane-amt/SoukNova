'use client';

import CategoryFilter from './components/CategoryFilter';
import { NewsLetterSub } from '@/home/components/NewsLetterSub';
import { SiteFooter } from '../../components/layout/SiteFooter';
import { useEffect, useState } from 'react';
import SectionShow from '../../components/ui/SectionShow';
import { fetchFromSupabase } from '../../lib/supbaseApi';
import { inter } from '@/layout';
import Loader from '../../components/ui/loader/Loader';

const imageUrl = '/images/shop/shopPage.png';

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState('All Rooms');
  const [priceRange, setPriceRange] = useState<[number, number] | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        let query = 'select=*';
        if (selectedCategory !== 'All Rooms') {
          query += `&categoriesText=ilike.%25${encodeURIComponent(
            selectedCategory,
          )}%25`;
        }
        if (priceRange !== null) {
          query += `&Price=gte.${priceRange[0]}`;
          query += `&Price=lte.${priceRange[1]}`;
        }
        if (selectedOrder !== null) {
          query += `&order=${selectedOrder}`;
        }
        const data = await fetchFromSupabase<any[]>('products', query);

        setProducts(data);
      } catch (e) {
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
        <CategoryFilter
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
