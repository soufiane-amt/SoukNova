import React from 'react';
import CategoryFilter from './components/CategoryFilter';
import ShopShow from './components/ShopShow';

export default function ShopPage() {
  return (
    <div className="mx-20">
      <ShopShow/>
      <CategoryFilter />
    </div>
  );
}
