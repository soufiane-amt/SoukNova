'use client';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { inter } from '@/layout';
import AddressField from './AddressField';

function AddressSection() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  return (
    <div className="w-full md:ml-25" data-aos="fade-up">
      <div className="mb-5 mt-10" data-aos="fade-up" data-aos-delay="100">
        <p className={`${inter.className} font-semibold text-xl`}>Address</p>
      </div>
      <div className='grid grid-cols-1 gap-5 md:grid-cols-2 w-full'>
        <div data-aos="fade-up" data-aos-delay="200">
          <AddressField
            fieldName="Billing Address"
            fullName="Sofia Havertz"
            phoneNumber="(+1) 234 567 890"
            address="345 Long Island, NewYork, United States"
          />
        </div>
        <div data-aos="fade-up" data-aos-delay="300">
          <AddressField
            fieldName="Billing Address"
            fullName="Sofia Havertz"
            phoneNumber="(+1) 234 567 890"
            address="345 Long Island, NewYork, United States"
          />
        </div>
        <div data-aos="fade-up" data-aos-delay="400">
          <AddressField
            fieldName="Billing Address"
            fullName="Sofia Havertz"
            phoneNumber="(+1) 234 567 890"
            address="345 Long Island, NewYork, United States"
          />
        </div>
      </div>
    </div>
  );
}

export default AddressSection;