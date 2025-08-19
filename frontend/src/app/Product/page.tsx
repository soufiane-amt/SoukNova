'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

// Utility function to determine if a product is new based on its date
function isProductNew(productDateString: string) {
  const today = new Date();
  const productDate = new Date(productDateString);
  const differenceInTime = today.getTime() - productDate.getTime();
  const differenceInDays = differenceInTime / (1000 * 3600 * 24);
  const daysThreshold = 30;
  return differenceInDays <= daysThreshold;
}

// Your Supabase API credentials
const SUPABASE_URL = 'https://oowcjcmdcfitnnsqfohw.supabase.co/rest/v1';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vd2NqY21kY2ZpdG5uc3Fmb2h3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA4MTI3MTksImV4cCI6MjA0NjM4ODcxOX0.bx4a1dNx8g-BZX2KWceWBuRlPwAqgxhZ80i7L4K8M7Y';

export default function ProductPage() {
  const { id } = useParams();
  const [productData, setProductData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        const response = await fetch(`${SUPABASE_URL}/products?select=*&id=eq.${id}`, {
          headers: {
            'apikey': API_KEY,
            'Authorization': `Bearer ${API_KEY}`,
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch product data.');
        }

        const data = await response.json();
        console.log("data : ", data)
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