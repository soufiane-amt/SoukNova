'use client';
import { useEffect } from 'react';
import CartItem from './CartItem';
import AOS from 'aos';
import 'aos/dist/aos.css';


function CartItemsTable() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  return (
    <div className='flex-1 mb-10 xl:max-w-[500px]' data-aos="fade-up">
      <div 
        className="w-full flex justify-between font-semibold py-5 border-b"
        data-aos="fade-up"
        data-aos-delay="100"
      >
        <div className='flex-4 xl:mr-10'>
          <p>Product</p>
        </div>
        <div className='flex-7 hidden xl:flex xl:justify-between'>
          <p className="max-sm:hidden">Quantity</p>
          <p className="max-sm:hidden">Price</p>
          <p className="max-sm:hidden">Subtotal</p>
        </div>
      </div>
      <div 
        data-aos="fade-up"
        data-aos-delay="200"
      >
        <CartItem
          productName="uxcell Shredded"
          productImage="https://m.media-amazon.com/images/I/51i6LeHlc9L._SS522_.jpg"
          price={39.49}
        />
      </div>
    </div>
  );
}

export default CartItemsTable;