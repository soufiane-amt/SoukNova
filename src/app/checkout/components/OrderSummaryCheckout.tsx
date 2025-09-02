'use client';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { inter } from '@/layout';
import CheckoutCartItem from './CheckoutCartItem';

function OrderSummaryCheckout() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  return (
    <div className="p-5 border rounded" data-aos="fade-up">
      <div className="mb-5" data-aos="fade-up" data-aos-delay="100">
        <p className={`${inter.className} text-[28px]`}>
          Order summary
        </p>
      </div>
      <div className='mb-5 h-100' data-aos="fade-up" data-aos-delay="200">
        <CheckoutCartItem
          productName="uxcell Shredded"
          productImage="https://m.media-amazon.com/images/I/51i6LeHlc9L._SS522_.jpg"
          price={39.49}
        />
      </div>
      <div className='flex justify-between gap-4' data-aos="fade-up" data-aos-delay="300">
        <input className='border w-full rounded-lg border-gray-500 px-5' type="text" placeholder="JenkateMW" />
        <button className="w-full bg-black text-white rounded-lg cursor-pointer md:px-5 max-w-25 py-3 font-medium">
          Apply
        </button>
      </div>
      <div className="" data-aos="fade-up" data-aos-delay="400">
        <div className="text-md flex justify-between py-4 border-b border-gray-200">
          <label>Subtotal</label>
          <p className='font-semibold'>$37.49</p>
        </div>
        <div className="text-md flex justify-between py-4">
          <label>Total</label>
          <p className='font-semibold'>$37.49</p>
        </div>
      </div>
    </div>
  );
}

export default OrderSummaryCheckout;