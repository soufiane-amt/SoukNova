'use client';
import * as React from 'react';

import { useState, useEffect } from 'react';
import { priceType } from '../../../types/types';
import SidebarFilter from './SidebarFilter';
import ProductGrid from './ProductGrid';
import ViewModeSelector from './ViewModeSelector';
import { ProductType } from '../../../types/product.dt';
import { Grid, Skeleton } from '@mui/material';

interface ProductGridSkeletonProps {
  selectedShape: number;
  pageSize: number;
}
function ProductGridSkeleton({
  selectedShape,
  pageSize,
}: ProductGridSkeletonProps) {
  return (
    <div className={selectedShape === 0 ? 'lg:col-span-3' : 'lg:col-span-4'}>
      <Grid
        container
        spacing={2}
        sx={{ width: '100%' }}
        justifyContent={{ xs: 'center', md: 'space-between' }}
      >
        {Array.from({ length: pageSize }).map((_, idx) => (
          <div
            key={`p-skel-${idx}`}
            className="w-[300px] flex-shrink-0 cursor-pointer mb-5"
          >
            <div className="relative w-[300px] h-[349px] flex items-center justify-center overflow-hidden">
              <Skeleton
                variant="rectangular"
                animation="wave"
                className="w-full h-full"
                style={{ height: 349 }}
              />
            </div>
            <div className="mt-3">
              <Skeleton
                variant="text"
                animation="wave"
                width="60%"
                height={20}
              />
              <div className="flex gap-4 mt-2">
                <Skeleton
                  variant="text"
                  animation="wave"
                  width="40%"
                  height={20}
                />
              </div>
            </div>
          </div>
        ))}
      </Grid>
    </div>
  );
}

interface ShopFilterProps {
  itemsData: {
    products: ProductType[];
    totalPages: number;
  } | null;
  selectedCategory: string;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
  priceRange: priceType;
  setPriceRange: React.Dispatch<React.SetStateAction<priceType>>;
  setSelectedOrder: React.Dispatch<React.SetStateAction<string | null>>;
  page: number;
  pageSize: number;
  handlePageChange: (e: React.ChangeEvent<unknown>, v: number) => void;
}

export default function ShopFilter({
  itemsData,
  setSelectedCategory,
  selectedCategory,
  setPriceRange,
  priceRange,
  setSelectedOrder,
  page,
  pageSize,
  handlePageChange,
}: ShopFilterProps) {
  const [selectedShape, setSelectedShape] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1000) {
        setSelectedShape(1);
      } else {
        setSelectedShape(0);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div>
      <main className="mx-auto p-4 sm:px-6 lg:px-8">
        <ViewModeSelector
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          setSelectedOrder={setSelectedOrder}
          selectedShape={selectedShape}
          setSelectedShape={setSelectedShape}
        />
        <section aria-labelledby="products-heading" className="pt-6 pb-24">
          <h2 id="products-heading" className="sr-only">
            Products
          </h2>
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
            {selectedShape === 0 && (
              <SidebarFilter
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                setPriceRange={setPriceRange}
                priceRange={priceRange}
              />
            )}
            {itemsData && (itemsData?.products?.length ?? 0) > 0 ? (
              <ProductGrid
                itemsData={itemsData}
                selectedShape={selectedShape}
                page={page}
                handlePageChange={handlePageChange}
              />
            ) : (
              <ProductGridSkeleton
                selectedShape={selectedShape}
                pageSize={pageSize}
              />
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
