import { AnimatePresence, motion } from 'framer-motion';
import EmptySectionMessage from '../../feedback/EmptySection';
import { poppins } from '@/layout';
import CheckoutCartItem from '@/checkout/components/CheckoutCartItem';
import { useCart } from '../../../context/CartContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CircularProgress } from '@mui/material';

interface SideCartProps {
  isOpen: boolean;
  toggleCartSideBar: () => void;
}
function SideCart({ isOpen, toggleCartSideBar  }: SideCartProps) {
  const { cart, subtotal, total } = useCart();
  const route = useRouter();
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [loadingCart, setLoadingCart] = useState(false);
  const navigateCart = async () => {
    if (cart.length === 0) return;
    try {
      setLoadingCart(true);
      toggleCartSideBar();
      await route.push('/cart');
    } catch (e) {
      console.error('Navigation to cart failed', e);
    } finally {
      setLoadingCart(false);
    }
  };

  const navigateCheckout = async () => {
    if (cart.length === 0) return;
    try {
      setLoadingCheckout(true);
      toggleCartSideBar();
      await route.push('/checkout?shipping=free');
    } catch (e) {
      console.error('Navigation to checkout failed', e);
    } finally {
      setLoadingCheckout(false);
    }
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          aria-label="Shopping cart"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={`fixed top-0 right-0 h-screen md:w-[413px] w-[90%] bg-white shadow-lg z-50 p-4 flex flex-col ${poppins.className}`}
        >
          <div className="mb-5">
            <p className="text-[28px] font-medium">Cart</p>
          </div>

          <div className="flex-1 overflow-y-auto pr-2">
            {cart.length > 0 ? (
              cart.map((item) => (
                <CheckoutCartItem
                  key={item.productId}
                  productId={item.productId}
                  productName={item.productName}
                  productImage={item.image}
                  price={item.price}
                  quantity={item.quantity}
                />
              ))
            ) : (
              <div className="py-15 px-5">
                <EmptySectionMessage message="No Products In Cart" />
              </div>
            )}
          </div>

          {/* Footer (always visible at bottom) */}
          <div className="pt-4 border-t border-gray-200">
            <div className="text-md flex justify-between py-2">
              <label>Subtotal</label>
              <p className="font-medium">{subtotal.toFixed(2)}</p>
            </div>
            <div className="text-xl flex justify-between py-2 font-medium">
              <label>Total</label>
              <p className="font-semibold">{total.toFixed(2)}</p>
            </div>
            <div className="flex flex-col items-center mt-4">
              <button
                className="w-full bg-black text-white rounded-lg py-3 cursor-pointer font-medium"
                onClick={navigateCheckout}
                disabled={loadingCheckout}
                aria-disabled={loadingCheckout}
              >
                {loadingCheckout ? (
                  <CircularProgress size={18} sx={{ color: 'white' }} />
                ) : (
                  'Checkout'
                )}
              </button>
              <button
                className="cursor-pointer text-sm font-semibold border-b w-20 mt-4"
                onClick={navigateCart}
                disabled={loadingCart}
                aria-disabled={loadingCart}
              >
                {loadingCart ? (
                  <CircularProgress size={14} sx={{ color: 'currentColor' }} />
                ) : (
                  'View Cart'
                )}
              </button>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

export default SideCart;
