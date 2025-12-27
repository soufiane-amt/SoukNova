'use client';

import { useLoader } from '../../hooks/useLoader';
import Loader from '../../components/feedback/loader/Loader';
import { Suspense } from 'react';
import OrderCompleteContent from './components/OrderCompleteContent';
import { useAuthGuard } from '../../hooks/useAuthGuard';

function OrderComplete() {
  const loading = useLoader(1500);
  useAuthGuard();

  if (loading) return <Loader />;

  return (
    <Suspense
      fallback={<p className="text-center my-12">Loading order details...</p>}
    >
      <OrderCompleteContent />
    </Suspense>
  );
}

export default OrderComplete;
