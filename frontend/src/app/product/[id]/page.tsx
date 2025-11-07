'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Loader from '../../../components/feedback/loader/Loader';
import Product from '../components/Product';
import { NewsLetterSub } from '../../../components/layout/NewsLetterSub';
import { SiteFooter } from '../../../components/layout/SiteFooter';

export default function ProductPage() {
  const { id } = useParams();
  const [productData, setProductData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });

    if (!id) return;

    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/product/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product data.');
        }

        const data = await response.json();
        setProductData(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <Loader />;
  }
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <main>
      <div className="md:mx-20 mx-10  mt-10 lg:mx-30 mb-10">
        <Product productData={productData} />
      </div>
      <NewsLetterSub />
      <SiteFooter />
    </main>
  );
}
