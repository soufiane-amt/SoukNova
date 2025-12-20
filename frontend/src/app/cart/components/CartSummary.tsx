'use client';
import { useState } from 'react';
import 'aos/dist/aos.css';
import Link from 'next/link';
import { ShippingOption } from '../../../types/types';

interface CartSummaryProps {
  subtotal: number;
  total: number;
}
function CartSummary({ subtotal, total }: CartSummaryProps) {
  const [shipping, setShipping] = useState<ShippingOption>('free');

  const shippingCost =
    shipping === 'express' ? 15 : shipping === 'pickup' ? 21 : 0;
  return (
    <div className={`border rounded-lg p-5 flex-1`} data-aos="fade-up">
      <div className="mb-3" data-aos="fade-up" data-aos-delay="100">
        <p className="font-semibold text-xl">Cart summary</p>
      </div>
      <div
        className="flex flex-col w-full font-medium"
        data-aos="fade-up"
        data-aos-delay="200"
      >
        {[
          { label: 'Free shipping', value: 'free', price: 0 },
          { label: 'Express shipping', value: 'express', price: 15 },
          { label: 'Pick Up', value: 'pickup', price: 21 },
        ].map((option, index) => (
          <div
            key={option.value}
            className="w-full border my-2 rounded-lg border-gray-500 flex items-center justify-between"
            data-aos="fade-up"
            data-aos-delay={300 + index * 100}
          >
            <label className="flex items-center">
              <input
                className="m-4 h-[18px] w-[18px] text-start"
                type="radio"
                name="shipping"
                value={option.value}
                checked={shipping === option.value}
                onChange={() => setShipping(option.value as ShippingOption)}
              />
              {option.label}
            </label>
            <label className="pr-3">
              {option.price === 0 ? '$0.00' : `+$${option.price.toFixed(2)}`}
            </label>
          </div>
        ))}
      </div>
      <div className="" data-aos="fade-up" data-aos-delay="600">
        <div className="text-md flex justify-between py-4 border-b border-gray-200">
          <label>Subtotal</label>
          <p className="font-semibold">{subtotal?.toFixed(2) ?? 0}</p>
        </div>
        <div className="text-lg font-bold flex justify-between py-4">
          <label>Total</label>
          <p>{(total + shippingCost).toFixed(2)}</p>
        </div>
      </div>
      <div className="mt-5 md:mt-0" data-aos="fade-up" data-aos-delay="700">
        <Link href={`/checkout?shipping=${shipping}`}>
          <button className="w-full bg-black text-white rounded-lg py-2 cursor-pointer font-semibold md:px-5">
            Checkout
          </button>
        </Link>
      </div>
    </div>
  );
}

export default CartSummary;
