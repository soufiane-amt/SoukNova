'use client';

import { inter } from '@/layout';
import ContactInfo from './components/ContactInfo';
import PaymentMethod from './components/PaymentMethod';
import ShippingAddress from './components/ShippingAddress';
import OrderSummary from './components/OrderSummaryCheckout';
import CartNavigator from '../../components/layout/Cart/CartNavigator';
import { SiteFooter } from '../../components/layout/SiteFooter';
import Loader from '../../components/ui/loader/Loader';
import { useLoader } from '../../components/ui/loader/useLoader';

function CheckoutPage() {
  const loading = useLoader(1500);

  if (loading) return <Loader />;

  return (
    <main className={`${inter.className} `}>
      <div className="mx-8 md:mx-16 lg:mx-32 my-12 flex flex-col gap-y-8">
        <div className="flex md:justify-center mb-2">
          <p className="font-medium text-6xl">Checkout</p>
        </div>
        <CartNavigator />
        <div className="flex flex-col gap-15 md:flex-row md:justify-between">
          <div className="flex-2 flex flex-col gap-y-8">
            <ContactInfo />
            <ShippingAddress />
            <PaymentMethod />
            <div className="md:hidden">
              <OrderSummary />
            </div>
            <div className="mt-5 md:mt-0" data-aos="fade-up">
              <button className="w-full bg-black text-white rounded-lg py-2 cursor-pointer md:px-5 font-semibold">
                Place Order
              </button>
            </div>
          </div>
          <div className=" flex-1 hidden md:block">
            <OrderSummary />
          </div>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}

export default CheckoutPage;
