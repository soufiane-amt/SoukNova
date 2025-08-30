'use client';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { inter, poppins } from '@/layout';
import { Typography } from '@mui/material';
import { Inter } from 'next/font/google';

function AccountDetailsForm() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  return (
    <div
      className="my-5 md:w-3/5 md:w-4/5 w-full px-[72px] max-lg:px-[32px] max-md:px-0 max-md:pt-10"
      data-aos="zoom-in" // Main container zooms in
      data-aos-delay="50"
    >
      <div data-aos="fade-right" data-aos-delay="100">
        <div className="mb-5 mt-10">
          <p className={`${inter.className} font-semibold text-xl`}>
            Account Details
          </p>
        </div>
        <div className="flex flex-col mb-8" data-aos="fade-left" data-aos-delay="200">
          <label className="font-bold text-[var(--color-primary)] text-xs mb-2">
            FIRST NAME
          </label>
          <input
            placeholder="First name"
            className={`text-md border py-2 px-4 rounded-md border border-[#CBCBCB] ${poppins.className}`}
          />
        </div>
        <div className="flex flex-col mb-8" data-aos="fade-right" data-aos-delay="300">
          <label className="font-bold text-[var(--color-primary)] text-xs mb-2">
            SECOND NAME
          </label>
          <input
            placeholder="Last name"
            className="text-md border py-2 px-4 rounded-md border border-[#CBCBCB]"
          />
        </div>
        <div className="flex flex-col mb-8" data-aos="fade-left" data-aos-delay="400">
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

      <div data-aos="fade-right" data-aos-delay="500">
        <div className="mb-5 mt-10">
          <p className={`${inter.className} font-semibold text-xl`}>Password</p>
        </div>

        <div className="flex flex-col mb-8" data-aos="fade-left" data-aos-delay="600">
          <label className="font-bold text-[var(--color-primary)] text-xs mb-2">
            OLD PASSWORD
          </label>
          <input
            type="password"
            placeholder="Old password"
            className={`text-md border py-2 px-4 rounded-md border border-[#CBCBCB] ${poppins.className}`}
          />
        </div>
        <div className="flex flex-col mb-8" data-aos="fade-right" data-aos-delay="700">
          <label className="font-bold text-[var(--color-primary)] text-xs mb-2">
            NEW PASSWORD
          </label>
          <input
            type="password"
            placeholder="New Password"
            className="text-md border py-2 px-4 rounded-md border border-[#CBCBCB]"
          />
        </div>
        <div className="flex flex-col mb-8" data-aos="fade-left" data-aos-delay="800">
          <label className="font-bold text-[var(--color-primary)] text-xs mb-2">
            REPEAT NEW PASSWORD
          </label>
          <input
            placeholder="Repeat new Password"
            type="password"
            className={`text-md border py-2 px-4 rounded-md border border-[#CBCBCB] ${inter.className}`}
          />
        </div>
      </div>
      <div data-aos="zoom-in" data-aos-delay="900">
        <button
          className={`${poppins.className} bg-black text-white w-full py-2 rounded-md font-semibold`}
        >
          Save changes
        </button>
      </div>
    </div>
  );
}

export default AccountDetailsForm;