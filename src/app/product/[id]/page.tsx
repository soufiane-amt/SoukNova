'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Product from '../components/Product';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Loader from '../../../components/ui/loader/Loader';

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
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product data.');
        }

        const data = await response.json();
        if (data.length > 0) {
          setProductData(data[0]);
        } else {
          setProductData(null);
        }
      } catch (err) {
        setError('Product not found or failed to load.');
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
    <div className="mx-10 lg:mx-30">
      <Product productData={productData} />
    </div>
  );
}
