'use client';

import { inter } from '@/layout';
import ContactInfo from './components/ContactInfo';
import PaymentMethod from './components/PaymentMethod';
import ShippingAddress from './components/ShippingAddress';
import OrderSummary from './components/OrderSummaryCheckout';
import CartNavigator from '../../components/ui/Cart/CartNavigator';
import { SiteFooter } from '../../components/layout/SiteFooter';
import { useLoader } from '../../hooks/useLoader';
import Loader from '../../components/feedback/loader/Loader';
import { useCart } from '../../context/CartContext';
import { useRouter } from 'next/navigation';
import { useAuthGuard } from '../../hooks/useAuthGuard';

function CheckoutPage() {
  const { total } = useCart();
  const loading = useLoader(1500);
  const router = useRouter();
  useAuthGuard();

  const placeOrder = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/order`, {
        method: 'POST',
        body: JSON.stringify({
          orderTotal: total,
        }),
        headers:{
          'content-type': 'application/json'
        },
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error(`Failed to place order: ${res.status}`);
      }

      const data = await res.json();
      router.push(`/orderComplete?orderId=${data.id}`);
    } catch (e: any) {
      console.error(e.message);
    }
  };

  if (loading) return <Loader />;

  return (
    <main className={`${inter.className} `}>
      <div className="mx-8 md:mx-16 lg:mx-32 my-12 flex flex-col gap-y-8">
        <div className="flex md:justify-center mb-2">
          <p className="font-medium lg:text-6xl md:text-5xl text-4xl my-2">
            Checkout
          </p>
        </div>
        <CartNavigator />
        <form className="flex flex-col gap-15 md:flex-row md:justify-between">
          <div className="flex-2 flex flex-col gap-y-8">
            <ContactInfo />
            <ShippingAddress />
            <PaymentMethod />
            <div className="md:hidden">
              <OrderSummary />
            </div>
            <div className="mt-5 md:mt-0">
              <button
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  placeOrder();
                }}
                className="w-full bg-black text-white rounded-lg py-2 cursor-pointer md:px-5 font-semibold"
              >
                Place Order
              </button>
            </div>
          </div>
          <div className=" flex-1 hidden md:block">
            <OrderSummary />
          </div>
        </form>
      </div>
      <SiteFooter />
    </main>
  );
}

export default CheckoutPage;
