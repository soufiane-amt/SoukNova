import { AnimatePresence, motion } from 'framer-motion';
import EmptySectionMessage from '../../feedback/EmptySection';
import { poppins } from '@/layout';
import CheckoutCartItem from '@/checkout/components/CheckoutCartItem';
import { useCart } from '../../../context/CartContext';
import { useRouter } from 'next/navigation';

interface SideCartProps {
  isOpen: boolean;
}
function SideCart({ isOpen }: SideCartProps) {
  const { cart, subtotal, total } = useCart();
  const route = useRouter();
  const navigateCart = () => {
    if (cart.length > 0) route.push('/cart');
  };
  const navigateCheckout = () => {
    if (cart.length > 0) route.push('/checkout?shipping=free');
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
              >
                Checkout
              </button>
              <button
                className="cursor-pointer text-sm font-semibold border-b w-20 mt-4"
                onClick={navigateCart}
              >
                View Cart
              </button>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

export default SideCart;
