'use client';
import * as React from 'react';

import { useState } from 'react';
import { priceType } from '../../../types/types';
import SidebarFilter from './SidebarFilter';
import ProductGrid from './ProductGrid';
import ViewModeSelector from './ViewModeSelector';

interface ShopFilterProps {
  products: [];
  selectedCategory: string;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
  priceRange: priceType;
  setPriceRange: React.Dispatch<React.SetStateAction<priceType>>;
  setSelectedOrder: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function ShopFilter({
  products,
  setSelectedCategory,
  selectedCategory,
  setPriceRange,
  priceRange,
  setSelectedOrder,
}: ShopFilterProps) {
  const [selectedShape, setSelectedShape] = useState(0);

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
            <ProductGrid products={products} selectedShape={selectedShape} />
          </div>
        </section>
      </main>
    </div>
  );
}
