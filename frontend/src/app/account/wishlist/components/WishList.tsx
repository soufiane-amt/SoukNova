'use client';
import { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { inter } from '@/layout';
import WishItem from './WishItem';
import EmptySectionMessage from '../../../../components/feedback/EmptySection';

interface WishItemType {
  productId: string;
  productName: string;
  image: string;
  price: number;
}
function WishList() {
  const [wishlist, setWishlist] = useState<WishItemType[]>([]);
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  useEffect(() => {
    const fetchWishlist = async () => {
      const res = await fetch('/api/wishlist', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      setWishlist(data);
    };
    fetchWishlist();
  }, []);

  const handleDeleteItem = async (productId: string) => {
    try {
      const res = await fetch(`/api/wishlist/${productId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete');
      setWishlist(wishlist.filter((item) => item.productId !== productId));
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="w-full md:ml-25 md:mt-0 mt-5" data-aos="fade-up">
      <div className="mb-5 mt-10" data-aos="fade-up" data-aos-delay="100">
        <p className={`${inter.className} font-semibold text-xl`}>
          Your Wishlist
        </p>
      </div>
      {wishlist.length > 0 ? (
        <div>
          <div
            className="text-sm text-[var(--color-primary)] border-b border-gray-300 pb-2"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <p>Products</p>
          </div>
          <div data-aos="fade-right" data-aos-delay="300">
            {wishlist.map((item) => (
              <WishItem
                key={item.productId}
                productName={item.productName}
                productImage={item.image}
                price={item.price}
                onDelete={() => handleDeleteItem(item.productId)}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-30">
          <EmptySectionMessage message="No Products In Wishlist" />
        </div>
      )}
    </div>
  );
}

export default WishList;
