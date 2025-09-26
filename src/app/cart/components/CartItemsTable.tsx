'use client';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { CartItemType } from '../../../context/CartContext';
import CartItem from './CartItem';

interface CartItemsTableProps {
  cart: CartItemType[];
}
function CartItemsTable({ cart }: CartItemsTableProps) {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  return (
    <div className="flex-1 mb-10 xl:max-w-[500px]" data-aos="fade-up">
      <div
        className="w-full flex justify-between font-semibold py-5 border-b"
        data-aos="fade-up"
        data-aos-delay="100"
      >
        <div className="flex-4 xl:mr-10">
          <p>Product</p>
        </div>
        <div className="flex-7 hidden xl:flex xl:justify-between">
          <p className="max-sm:hidden">Quantity</p>
          <p className="max-sm:hidden">Price</p>
          <p className="max-sm:hidden">Subtotal</p>
        </div>
      </div>
      <div data-aos="fade-up" data-aos-delay="200">
        {cart.map((item) => (
          <CartItem
            key={item.productId}
            productId={item.productId}
            productName={item.productName}
            productImage={item.image}
            price={item.price}
          />
        ))}
      </div>
    </div>
  );
}

export default CartItemsTable;
