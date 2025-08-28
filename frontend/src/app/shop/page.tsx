'use client';

import CategoryFilter from './components/CategoryFilter';
import { NewsLetterSub } from '@/home/components/NewsLetterSub';
import { SiteFooter } from '../../components/layout/SiteFooter';
import { useEffect, useState } from 'react';
import CircularIndeterminate from '../../components/ui/CircularIndeterminate';
import SectionShow from '../../components/ui/SectionShow';
import { fetchFromSupabase } from '../../lib/supbaseApi';
import { inter } from '@/layout';
import Loader from '../../components/ui/loader/Loader';

const imageUrl = '/images/shop/shopPage.png';

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await fetchFromSupabase<any[]>('products', `select=*`);

        setProducts(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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
        <CategoryFilter products={products} />
      </div>

      <NewsLetterSub />
      <SiteFooter />
    </div>
  );
}
