'use client';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { inter, poppins } from '@/layout';
import OrderedItem from './OrderedItem';

function Order() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  return (
    <div className="p-5 md:p-25 shadow-xl rounded-md border border-gray-100 max-w-[738px]" data-aos="fade-up">
      <div className={`${poppins.className} md:flex md:flex-col md:items-center`} data-aos="fade-up" data-aos-delay="100">
        <div className="mb-3">
          <p className="text-[28px] font-medium text-[var(--color-primary)]">
            Thank you! 🎉
          </p>
        </div>
        <div>
          <p className="text-[40px] font-medium leading-[44px] md:text-center">
            Your order has been received
          </p>
        </div>
      </div>
      <div className="flex justify-center mt-12 mb-8" data-aos="fade-up" data-aos-delay="200">
        <OrderedItem
          productName=""
          imageUrl="https://m.media-amazon.com/images/I/51i6LeHlc9L._SS522_.jpg"
          count={1}
        />
      </div>
      <div className={`text-sm ${inter.className} flex flex-col md:hidden`} data-aos="fade-up" data-aos-delay="300">
        <div className="border-b border-gray-100 font-semibold py-4 flex flex-col gap-2">
          <p className="text-[var(--color-primary)]">Order code</p>
          <p>#1342_1242</p>
        </div>
        <div className="border-b border-gray-100 font-semibold py-4 flex flex-col gap-2">
          <p className="text-[var(--color-primary)]">Date</p>
          <p>27 Aug 2025</p>
        </div>
        <div className="border-b border-gray-100 font-semibold py-4 flex flex-col gap-2">
          <p className="text-[var(--color-primary)]">Total</p>
          <p>$37.49</p>
        </div>
        <div className="border-b border-gray-100 font-semibold py-4 flex flex-col gap-2">
          <p className="text-[var(--color-primary)]">Payment method</p>
          <p>Card Credit</p>
        </div>
      </div>
      <div className='hidden md:flex md:justify-center md:font-semibold' data-aos="fade-up" data-aos-delay="400">
        <div className={`text-sm flex space-x-4 ${inter.className}`}>
          <div className="text-[var(--color-primary)] space-y-4">
            <p>Order code:</p>
            <p>Date:</p>
            <p>Total:</p>
            <p>Payment method:</p>
          </div>
          <div className='space-y-4 '>
            <p>#1342_1242</p>
            <p>27 Aug 2025</p>
            <p>$37.49</p>
            <p>Card Credit</p>
          </div>
        </div>
      </div>
      <div className="mt-5 px-5 md:mt-10" data-aos="fade-up" data-aos-delay="500">
        <button className="w-full bg-black text-white rounded-lg py-3 cursor-pointer font-semibold">
          Purchase history
        </button>
      </div>
    </div>
  );
}

export default Order;