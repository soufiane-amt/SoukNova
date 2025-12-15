'use client';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { inter } from '@/layout';
import CheckoutCartItem from './CheckoutCartItem';
import { useCart } from '../../../context/CartContext';
import { useSearchParams } from 'next/navigation';

function OrderSummaryCheckout() {
  const { cart, subtotal, total } = useCart();
  const searchParams = useSearchParams();
  const shipping = searchParams.get('shipping') || 'free';

  const shippingCost =
    shipping === 'express' ? 15 : shipping === 'pickup' ? 21 : 0;

  return (
    <div className="p-5 border rounded" data-aos="fade-up">
      <div className="mb-5" data-aos="fade-up" data-aos-delay="100">
        <p className={`${inter.className} text-[28px] `}>Order summary</p>
      </div>
      <div
        className="mb-5 h-100 overflow-y-auto pr-2 custom-scrollbar"
        data-aos="fade-up"
        data-aos-delay="200"
      >
        {cart.map((item) => (
          <CheckoutCartItem
            key={item.productId}
            productId={item.productId}
            productName={item.productName}
            productImage={item.image}
            price={item.price}
            quantity={item.quantity}
          />
        ))}
      </div>
      <div
        className="flex justify-between gap-4"
        data-aos="fade-up"
        data-aos-delay="300"
      >
        <input
          className="border w-full rounded-lg border-gray-500 px-5"
          type="text"
          placeholder="JenkateMW"
        />
        <button className="w-full bg-black text-white rounded-lg cursor-pointer md:px-5 max-w-25 py-3 font-medium">
          Apply
        </button>
      </div>
      <div className="" data-aos="fade-up" data-aos-delay="400">
        <div className="text-md flex justify-between py-4 border-b border-gray-200">
          <label>Subtotal</label>
          <p className="font-semibold">{subtotal.toFixed(2)} $</p>
        </div>
        <div className="text-md flex justify-between py-4">
          <label>Total</label>
          <p className="font-semibold">{(total + shippingCost).toFixed(2)} $</p>
        </div>
      </div>
    </div>
  );
}

export default OrderSummaryCheckout;
