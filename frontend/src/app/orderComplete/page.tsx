'use client';

import { Suspense } from 'react';
import OrderCompleteContent from './components/OrderCompleteContent';
import AuthGuard from '@/account/AuthGuard';

function OrderComplete() {
  return (
    <Suspense
      fallback={<p className="text-center my-12">Loading order details...</p>}
    >
      <AuthGuard>
        <OrderCompleteContent />
      </AuthGuard>
    </Suspense>
  );
}

export default OrderComplete;
