'use client';
import React, { useState } from 'react';
import AddProduct from './components/AddProduct';
import EditProduct from './components/EditProduct';
import ProductsView from './components/ProductsView';

const RenderTab = (tab: string, handleActiveTabChange: (tab: 'products' | 'add product' | 'edit product') => void) => {
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  switch (tab) {
    case 'products':
      return <ProductsView handleActiveTabChange={handleActiveTabChange} setSelectedProductId={setSelectedProductId} />;
    case 'add product':
      return <AddProduct />;
    case 'edit product':
      return <EditProduct selectedProductId={selectedProductId} />;
    default:
      return <ProductsView handleActiveTabChange={handleActiveTabChange} setSelectedProductId={setSelectedProductId} />;
  }
};

export default function ProductsPage() {
  const [activeTab, setActiveTab] = useState<
    'products' | 'add product' | 'edit product'
  >('products');

  const handleActiveTabChange = (
    tab: 'products' | 'add product' | 'edit product',
  ) => {
    setActiveTab(tab);
  };
  return RenderTab(activeTab, handleActiveTabChange);
}
