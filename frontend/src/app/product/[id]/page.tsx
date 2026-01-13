'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import 'aos/dist/aos.css';
import Product from '../components/Product';
import { SiteFooter } from '../../../components/layout/SiteFooter';
import { ProductType } from '../../../types/product.dt';
import { Skeleton } from '@mui/material';
import { poppins } from '@/layout';

function ProductPageSkeleton() {
  return (
    <div className="px-4 sm:px-6 md:px-12 lg:px-20 max-w-screen-2xl mx-auto py-8">
      {/* Breadcrumb skeleton */}
      <div className="flex items-center gap-2 mb-8">
        <Skeleton variant="text" width={50} height={20} />
        <Skeleton variant="text" width={20} height={20} />
        <Skeleton variant="text" width={50} height={20} />
        <Skeleton variant="text" width={20} height={20} />
        <Skeleton variant="text" width={100} height={20} />
      </div>

      <div className="lg:flex gap-12">
        {/* Image section */}
        <div className="lg:w-1/2 mb-10 lg:mb-0">
          <Skeleton
            variant="rectangular"
            animation="wave"
            sx={{ width: '100%', height: 500, borderRadius: '1rem' }}
          />
          <div className="flex justify-center gap-3 mt-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                width={70}
                height={70}
                sx={{ borderRadius: '0.5rem' }}
              />
            ))}
          </div>
        </div>

        {/* Details section */}
        <div className="lg:w-1/2">
          <Skeleton variant="text" width="30%" height={24} className="mb-2" />
          <Skeleton variant="text" width="80%" height={48} className="mb-2" />
          <Skeleton variant="text" width="100%" height={20} />
          <Skeleton variant="text" width="90%" height={20} />
          <Skeleton variant="text" width="70%" height={20} className="mb-6" />

          <div className="flex items-center gap-4 my-6">
            <Skeleton variant="text" width={100} height={40} />
            <Skeleton variant="text" width={80} height={30} />
          </div>

          <Skeleton
            variant="rectangular"
            width="100%"
            height={80}
            sx={{ borderRadius: '0.5rem', my: 3 }}
          />

          <div className="flex gap-4 mt-6">
            <Skeleton
              variant="rectangular"
              width={120}
              height={50}
              sx={{ borderRadius: '0.5rem' }}
            />
            <Skeleton
              variant="rectangular"
              sx={{ flex: 1, height: 50, borderRadius: '0.5rem' }}
            />
          </div>

          <Skeleton
            variant="rectangular"
            width="100%"
            height={56}
            sx={{ borderRadius: '0.5rem', mt: 3 }}
          />
        </div>
      </div>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2
          className={`text-2xl font-semibold text-[#141718] mb-2 ${poppins.className}`}
        >
          Something went wrong
        </h2>
        <p className="text-[#6C7275] mb-6">{message}</p>
        <a
          href="/shop"
          className="inline-flex items-center gap-2 bg-[#141718] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#343839] transition-colors"
        >
          Back to Shop
        </a>
      </div>
    </div>
  );
}

export default function ProductPage() {
  const { id } = useParams();
  const [productData, setProductData] = useState<ProductType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/product/${id}`,
          {
            method: 'GET',
            credentials: 'include',
          },
        );
        if (!response.ok) {
          throw new Error('Failed to fetch product data.');
        }

        const data = await response.json();
        setProductData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (isLoading) {
    return (
      <main>
        <ProductPageSkeleton />
        <SiteFooter />
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <ErrorState message={error} />
        <SiteFooter />
      </main>
    );
  }

  if (!productData) {
    return (
      <main>
        <ErrorState message="Product not found" />
        <SiteFooter />
      </main>
    );
  }

  return (
    <main className="bg-white">
      <div className="px-4 sm:px-6 md:px-12 lg:px-20 max-w-screen-2xl mx-auto py-8">
        <Product productData={productData} />
      </div>
      <SiteFooter />
    </main>
  );
}
