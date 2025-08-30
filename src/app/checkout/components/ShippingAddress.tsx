'use client';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { inter, poppins } from '@/layout';

function ShippingAddress() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  return (
    <div className="p-5 border rounded" data-aos="fade-up">
      <div className="mb-5 mt-10" data-aos="fade-up" data-aos-delay="100">
        <p className={`${inter.className} font-semibold text-xl`}>
          Shipping Address
        </p>
      </div>
      <div className="flex-1 flex flex-col mb-8" data-aos="fade-up" data-aos-delay="200">
        <label className="font-bold text-[var(--color-primary)] text-xs mb-2">
          Street Address *
        </label>
        <input
          placeholder="Street Address"
          className={`text-md border py-2 px-4 rounded-md border border-[#CBCBCB] ${poppins.className}`}
        />
      </div>
      <div className="flex-1 flex flex-col mb-8" data-aos="fade-up" data-aos-delay="300">
        <label className="font-bold text-[var(--color-primary)] text-xs mb-2">
          Country
        </label>
        <input
          placeholder="Country"
          className="text-md border py-2 px-4 rounded-md border border-[#CBCBCB]"
        />
      </div>
      <div className="flex flex-col mb-8" data-aos="fade-up" data-aos-delay="400">
        <label className="font-bold text-[var(--color-primary)] text-xs mb-2">
          Town / City
        </label>
        <input
          placeholder="Town / City"
          type="text"
          className="text-md border py-2 px-4 rounded-md border border-[#CBCBCB]"
        />
      </div>
      <div className="md:flex gap-6">
        <div className="flex-1 flex flex-col mb-8" data-aos="fade-up" data-aos-delay="500">
          <label className="font-bold text-[var(--color-primary)] text-xs mb-2">
            State
          </label>
          <input
            placeholder="State"
            type="text"
            className="text-md border py-2 px-4 rounded-md border border-[#CBCBCB]"
          />
        </div>
        <div className="flex-1 flex flex-col mb-8" data-aos="fade-up" data-aos-delay="600">
          <label className="font-bold text-[var(--color-primary)] text-xs mb-2">
            Zip Code
          </label>
          <input
            placeholder="Zip Code"
            type="text"
            className="text-md border py-2 px-4 rounded-md border border-[#CBCBCB]"
          />
        </div>
      </div>
    </div>
  );
}

export default ShippingAddress;