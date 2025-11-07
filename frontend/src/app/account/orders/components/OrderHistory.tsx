'use client';
import { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { inter } from '@/layout';
import OrderInfo from './OrderInfo';

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/order', {
          method: 'GET',
        });

        if (!res.ok) {
          console.log('Failed to place order : ', res);
          throw new Error(`Failed to place order: ${res.status}`);
        }

        const orderHistory = await res.json();
        setOrders(orderHistory);
      } catch (e: any) {
        console.error(e.message);
      }
    };
    fetchOrders();
  }, []);
  return (
    <div className="w-full md:ml-10 md:mt-0 mt-5" data-aos="fade-left">
      <div className="mb-5" data-aos="fade-left" data-aos-delay="100">
        <p className={`${inter.className} font-semibold text-xl`}>
          Orders History
        </p>
      </div>
      <div className='overflow-y-auto'>
        {orders.map((order, idx) => (
          <div
            key={order.id}
            data-aos="fade-left"
            data-aos-delay={200 + idx * 100}
          >
            <OrderInfo
              id={order.id}
              date={order.date}
              status={'PROGRESS'}
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
