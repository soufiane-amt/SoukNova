'use client';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { inter } from '@/layout';
import OrderInfo from './OrderInfo';
import EmptySectionMessage from '../../../components/ui/EmptySection';

function OrderHistory() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  return (
    <div className="w-full md:ml-10 md:mt-0 mt-5" data-aos="fade-left">
      <div className="mb-5" data-aos="fade-left" data-aos-delay="100">
        <p className={`${inter.className} font-semibold text-xl`}>
          Orders History
        </p>
      </div>
      <div>
        <div data-aos="fade-left" data-aos-delay="200">
          <OrderInfo
            id={3456}
            date="October 17, 2023"
            status="DELIVERD"
            price={1234.0}
          />
        </div>
        <div data-aos="fade-left" data-aos-delay="300">
          <OrderInfo
            id={3456}
            date="October 17, 2023"
            status="DELIVERD"
            price={1234.0}
          />
        </div>
        <div data-aos="fade-left" data-aos-delay="400">
          <OrderInfo
            id={3456}
            date="October 17, 2023"
            status="DELIVERD"
            price={1234.0}
          />
        </div>
        <div data-aos="fade-left" data-aos-delay="500">
          <OrderInfo
            id={3456}
            date="October 17, 2023"
            status="DELIVERD"
            price={1234.0}
          />
        </div>
      </div>
      {/* <div className="mt-30">
        <EmptySectionMessage message="No Products In Order History" />
      </div> */}
    </div>
  );
}

export default OrderHistory;