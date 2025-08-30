'use client';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { inter } from '@/layout';
import WishItem from './WishItem';

function WishList() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  return (
    <div className="w-full md:ml-25 md:mt-0 mt-5" data-aos="fade-up">
      <div className="mb-5 mt-10" data-aos="fade-up" data-aos-delay="100">
        <p className={`${inter.className} font-semibold text-xl`}>
          Your Wishlist
        </p>
      </div>
      <div>
        <div className="text-sm text-[var(--color-primary)] border-b border-gray-300 pb-2" data-aos="fade-up" data-aos-delay="200">
          <p>Products</p>
        </div>
        <div data-aos="fade-right" data-aos-delay="300">
          <WishItem
            productName="uxcell Shredded"
            productImage="https://m.media-amazon.com/images/I/51i6LeHlc9L._SS522_.jpg"
            price={39.49}
          />
        </div>
        <div data-aos="fade-right" data-aos-delay="400">
          <WishItem
            productName="uxcell Shredded"
            productImage="https://m.media-amazon.com/images/I/51i6LeHlc9L._SS522_.jpg"
            price={39.49}
          />
        </div>
        <div data-aos="fade-right" data-aos-delay="500">
          <WishItem
            productName="uxcell Shredded"
            productImage="https://m.media-amazon.com/images/I/51i6LeHlc9L._SS522_.jpg"
            price={39.49}
          />
        </div>
      </div>
      {/* <div className="mt-30">
        <EmptySectionMessage message="No Products In Wishlist" />
      </div> */}
    </div>
  );
}

export default WishList;