'use client';

import Loader from '../../../components/feedback/loader/Loader';
import { useLoader } from '../../../hooks/useLoader';
import OrderHistory from './components/OrderHistory';

function OrderPage() {
  const loading = useLoader(1500);

  if (loading) return <Loader />;

  return <OrderHistory />;
}

export default OrderPage;
