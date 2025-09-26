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
          className={`fixed top-0 right-0 h-screen md:w-[413px] w-[90%] bg-white shadow-lg z-50 p-4 ${poppins.className}`}
        >
          <div className="mb-5 ">
            <p className={`${poppins.className} text-[28px] font-medium`}>
              Cart
            </p>
          </div>
          <div className="flex flex-col justify-between h-[calc(100%-55px)]">
            <div className="mb-5 mb-auto">
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
            <div className="">
              <div className="text-md flex justify-between py-4 border-b border-gray-200">
                <label>Subtotal</label>
                <p className="font-medium">{subtotal.toFixed(2)}</p>
              </div>
              <div className="text-xl flex justify-between py-4 font-medium">
                <label>Total</label>
                <p className="font-semibold">{total.toFixed(2)}</p>
              </div>
              <div className="flex flex-col items-center my-5">
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
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

export default SideCart;
