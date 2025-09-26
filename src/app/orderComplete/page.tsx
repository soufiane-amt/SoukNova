'use client';

import { useParams, useSearchParams } from 'next/navigation';
import CartNavigator from '../../components/ui/Cart/CartNavigator';
import { useLoader } from '../../hooks/useLoader';
import Order from './components/Order';
import Loader from '../../components/feedback/loader/Loader';
import { useCart } from '../../context/CartContext';

function OrderComplete() {
  const loading = useLoader(1500);
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { cart } = useCart();

  if (loading) return <Loader />;

  return (
    <main>
      <div className="mx-8 md:mx-16 lg:mx-32 my-12">
        <div className="flex md:justify-center mb-4">
          <p className="font-medium text-6xl">Complete!</p>
        </div>

        <CartNavigator />
        <div className="mx-8 md:mx-20">
          <div className="md:flex md:justify-center">
            <Order orderId={orderId} cartItems={cart} />
          </div>
        </div>
      </div>
    </main>
  );
}

export default OrderComplete;
