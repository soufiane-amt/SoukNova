import CartItemsTable from './components/CartItemsTable';
import CartSummary from './components/CartSummary';
import CouponInput from './components/CouponInput';

function CartPage() {
  return (
    <div className='mx-8'>
      {/* <CartItemsTable />
      <CouponInput/> */}
      <CartSummary/>
    </div>
  );
}

export default CartPage;
