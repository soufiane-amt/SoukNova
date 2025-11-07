'use client';
import { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { inter, poppins } from '@/layout';
import OrderedItem from './OrderedItem';
import { CartItemType, useCart } from '../../../context/CartContext';
import Link from 'next/link';

interface OrderProps {
  orderId: string | null;
  cartItems: CartItemType[];
}
function Order({ orderId, cartItems }: OrderProps) {
  const { resetCart } = useCart();
  const [cart] = useState(cartItems);
  const [orderInfo, setOrderInfo] = useState<any>();
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  useEffect(() => {
    const deleteCarts = async () => {
      const res = await fetch(`/api/cart/reset`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        console.log('Failed to delete carts : ', res);
        throw new Error(`Failed to delete carts: ${res.status}`);
      }
    };
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/order/${orderId}`, {
          method: 'GET',
        });

        if (!res.ok) {
          console.log('Failed to fetch order : ', res);
          throw new Error(`Failed to fetch order: ${res.status}`);
        }

        const data = await res.json();
        setOrderInfo({
          id: data.id,
          totalPrice: data.price,
          date: data.addedAt,
        });
        resetCart();
        deleteCarts();
      } catch (e: any) {
        console.error(e.message);
      }
    };
    fetchOrder();
  }, [orderId, resetCart]);

  return (
    <div
      className="p-5 md:p-25 shadow-xl rounded-md border border-gray-100 max-w-[738px]"
      data-aos="fade-up"
    >
      <div
        className={`${poppins.className} md:flex md:flex-col md:items-center`}
        data-aos="fade-up"
        data-aos-delay="100"
      >
        <div className="mb-3">
          <p className="md:text-[28px] text-md font-medium text-[var(--color-primary)]">
            Thank you! 🎉
          </p>
        </div>
        <div>
          <p className="md:text-[40px] text-lg font-medium md:leading-[44px] leading-[24px] md:text-center">
            Your order has been received
          </p>
        </div>
      </div>
      <div
        className={`flex gap-x-5 mt-12 mb-8 overflow-x-auto py-2 ${
          cart.length < 4 ? 'justify-center' : ''
        }`}
        data-aos="fade-up"
        data-aos-delay="200"
      >
        {cart.map((item) => (
          <OrderedItem
            key={item.productId}
            productName={item.productName}
            imageUrl={item.image}
            count={item.quantity}
          />
        ))}
      </div>
      <div
        className={`text-sm ${inter.className} flex flex-col md:hidden`}
        data-aos="fade-up"
        data-aos-delay="300"
      >
        <div className="border-b border-gray-100 font-semibold py-4 flex flex-col gap-2">
          <p className="text-[var(--color-primary)]">Order code</p>
          <p>{orderId}</p>
        </div>
        <div className="border-b border-gray-100 font-semibold py-4 flex flex-col gap-2">
          <p className="text-[var(--color-primary)]">Date</p>
          <p>{orderInfo?.date}</p>
        </div>
        <div className="border-b border-gray-100 font-semibold py-4 flex flex-col gap-2">
          <p className="text-[var(--color-primary)]">Total</p>
          <p>{orderInfo?.totalPrice}</p>
        </div>
      </div>
      <div
        className="hidden md:flex md:justify-center md:font-semibold"
        data-aos="fade-up"
        data-aos-delay="400"
      >
        <div className={`text-sm flex space-x-4 ${inter.className}`}>
          <div className="text-[var(--color-primary)] space-y-4">
            <p>Order code:</p>
            <p>Date:</p>
            <p>Total:</p>
          </div>
          <div className="space-y-4 ">
            <p>{orderId}</p>
            <p>{orderInfo?.date}</p>
            <p>{orderInfo?.totalPrice} $</p>
          </div>
        </div>
      </div>
      <div
        className="mt-5 px-5 md:mt-10"
        data-aos="fade-up"
        data-aos-delay="500"
      >
        <Link href={'/account/orders'}>
          <button className="w-full bg-black text-white rounded-lg py-3 cursor-pointer font-semibold">
            Purchase history
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Order;
