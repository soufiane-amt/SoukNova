'use client';

import { Suspense } from 'react';
import OrderCompleteContent from './components/OrderCompleteContent';

function OrderComplete() {
  return (
    <Suspense
      fallback={<p className="text-center my-12">Loading order details...</p>}
    >
      <OrderCompleteContent />
    </Suspense>
  );
}

export default OrderComplete;
