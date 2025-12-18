'use client';
import * as React from 'react';

import { useState, useEffect } from 'react';
import { priceType } from '../../../types/types';
import SidebarFilter from './SidebarFilter';
import ProductGrid from './ProductGrid';
import ViewModeSelector from './ViewModeSelector';
import { ProductType } from '../../../types/product.dt';

interface ShopFilterProps {
  itemsData: {
    products: ProductType[];
    totalPages: number;
  };
  selectedCategory: string;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
  priceRange: priceType;
  setPriceRange: React.Dispatch<React.SetStateAction<priceType>>;
  setSelectedOrder: React.Dispatch<React.SetStateAction<string | null>>;
  page: number;
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
            <ProductGrid
              itemsData={itemsData}
              selectedShape={selectedShape}
              page={page}
              handlePageChange={handlePageChange}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
