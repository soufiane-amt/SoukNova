'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '../../../context/CartContext';
import CartNavigator from '../../../components/ui/Cart/CartNavigator';
import Order from './Order';

function OrderCompleteContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { cart } = useCart();
  const router = useRouter();

  if (!cart.length) {
    router.push('/cart');
    return null;
  }
  if (!orderId) return <p className="text-center my-12">Invalid order ID</p>;

  return (
    <main>
      <div className="mx-8 md:mx-16 lg:mx-32 my-12">
        <div className="flex md:justify-center mb-4">
          <p className="font-medium lg:text-6xl md:text-5xl text-4xl my-2">
            Complete!
          </p>
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

export default OrderCompleteContent;
