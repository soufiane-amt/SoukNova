'use client';

import CartNavigator from '../../components/ui/Cart/CartNavigator';
import Order from './components/Order';
import { useLoader } from '../../components/ui/loader/useLoader';
import Loader from '../../components/ui/loader/Loader';

function OrderComplete() {
  const loading = useLoader(1500);

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
            <Order />
          </div>
        </div>
      </div>
    </main>
  );
}

export default OrderComplete;
