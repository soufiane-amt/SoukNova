'use client';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { inter, poppins } from '@/layout';

function ContactInfo() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  return (
    <div className='p-5 border rounded' data-aos="fade-up">
      <div className="mb-5 mt-10" data-aos="fade-up" data-aos-delay="100">
        <p className={`${inter.className} font-semibold text-xl`}>
          Contact information
        </p>
      </div>
      <div className='md:flex gap-6'>
        <div className="flex-1 flex flex-col mb-8" data-aos="fade-up" data-aos-delay="200">
          <label className="font-bold text-[var(--color-primary)] text-xs mb-2">
            FIRST NAME
          </label>
          <input
            placeholder="First name"
            className={`text-md border py-2 px-4 rounded-md border border-[#CBCBCB] ${poppins.className}`}
          />
        </div>
        <div className="flex-1 flex flex-col mb-8" data-aos="fade-up" data-aos-delay="300">
          <label className="font-bold text-[var(--color-primary)] text-xs mb-2">
            SECOND NAME
          </label>
          <input
            placeholder="Last name"
            className="text-md border py-2 px-4 rounded-md border border-[#CBCBCB]"
          />
        </div>
      </div>
      <div className="flex flex-col mb-8" data-aos="fade-up" data-aos-delay="400">
        <label className="font-bold text-[var(--color-primary)] text-xs mb-2">
          PHONE NUMBER
        </label>
        <input
          placeholder="Phone number"
          type="text"
          className="text-md border py-2 px-4 rounded-md border border-[#CBCBCB]"
        />
      </div>
      <div className="flex flex-col mb-8" data-aos="fade-up" data-aos-delay="500">
        <label className="font-bold text-[var(--color-primary)] text-xs mb-2">
          EMAIL
        </label>
        <input
          placeholder="Email"
          type="email"
          className="text-md border py-2 px-4 rounded-md border border-[#CBCBCB]"
        />
      </div>
    </div>
  );
}

export default ContactInfo;