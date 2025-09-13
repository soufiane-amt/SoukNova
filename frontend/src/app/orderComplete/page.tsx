'use client';

import Loader from '../../components/feedback/loader/Loader';
import CartNavigator from '../../components/ui/Cart/CartNavigator';
import { useLoader } from '../../hooks/useLoader';
import Order from './components/Order';

function OrderComplete() {
  const loading = useLoader(1500);

  if (loading) return <Loader/>;

  return (
    <main>
      <div className="mx-8 md:mx-16 lg:mx-32 my-12">
        <div className="flex md:justify-center mb-4">
          <p className="font-medium text-6xl">Complete!</p>
        </div>

        <CartNavigator />
        <div className="mx-8 md:mx-20">
          <div className="md:flex md:justify-center">
            <Order />
          </div>
        </div>
      </div>
    </main>
  );
}

export default OrderComplete;
