'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { fetchFromSupabase } from '../../lib/supbaseApi';

function isProductNew(productDateString: string) {
  const today = new Date();
  const productDate = new Date(productDateString);
  const differenceInTime = today.getTime() - productDate.getTime();
  const differenceInDays = differenceInTime / (1000 * 3600 * 24);
  const daysThreshold = 30;
  return differenceInDays <= daysThreshold;
}

export default function ProductPage() {
  const { id } = useParams();
  const [productData, setProductData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        const data = await fetchFromSupabase<any[]>("products", `select=*&id=eq.${id}`);
        if (data.length > 0) {
          setProductData(data[0]);
        } else {
          setProductData(null);
        }
      } catch (err) {
        setError("Product not found or failed to load.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <div>Loading product...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!productData) {
    return <div>Product not found.</div>;
  }

  // Map the fetched data to the props your Product component expects
  const isNew = isProductNew(productData.Date);

  return (
    <div>
      <h1>hi</h1>
    </div>
  );
}