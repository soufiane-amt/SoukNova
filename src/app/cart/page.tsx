import { inter } from '@/layout';
import CartNavigator from '../../components/layout/Cart/CartNavigator';
import { SiteFooter } from '../../components/layout/SiteFooter';
import CartItemsTable from './components/CartItemsTable';
import CartSummary from './components/CartSummary';
import CouponInput from './components/CouponInput';

function CartPage() {
  return (
    <main className={`${inter.className} `}>
      <div className="mx-8 md:mx-16 lg:mx-32 my-12">
        <div className="flex md:justify-center mb-2">
          <p className="font-medium text-6xl">Cart</p>
        </div>

        <CartNavigator />

        <div className="w-full xl:flex xl:justify-between xl:gap-16">
          <CartItemsTable />
          <div className="xl:hidden">
            <CouponInput />
          </div>
          <CartSummary />
        </div>
        <div className="hidden xl:flex w-full">
          <CouponInput />
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}

export default CartPage;
