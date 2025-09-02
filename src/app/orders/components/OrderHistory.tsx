'use client';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { inter } from '@/layout';
import OrderInfo, { OrderInfoProps } from './OrderInfo';

const orders: OrderInfoProps[] = [
  { id: 3456, date: 'October 17, 2023', status: 'DELIVERED', price: 1234.0 },
  { id: 3457, date: 'November 3, 2023', status: 'PROGRESS', price: 890.5 },
  { id: 3458, date: 'December 5, 2023', status: 'DELIVERED', price: 456.75 },
];

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
        {orders.map((order, idx) => (
          <div
            key={order.id}
            data-aos="fade-left"
            data-aos-delay={200 + idx * 100}
          >
            <OrderInfo
              id={order.id}
              date={order.date}
              status={order.status}
              price={order.price}
            />
          </div>
        ))}
      </div>
      {/* <div className="mt-30">
        <EmptySectionMessage message="No Products In Order History" />
      </div> */}
    </div>
  );
}

export default OrderHistory;
