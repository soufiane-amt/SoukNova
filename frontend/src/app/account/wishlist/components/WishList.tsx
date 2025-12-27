'use client';
import { useEffect, useState } from 'react';
import 'aos/dist/aos.css';
import { inter } from '@/layout';
import WishItem from './WishItem';
import EmptySectionMessage from '../../../../components/feedback/EmptySection';
import CustomPagination from '../../../../components/ui/CustomPagination';
import { usePagination } from '../../../../hooks/usePagination';

const PAGE_SIZE = 5;

function WishList() {
  const [itemsData, setItemsData] = useState<any>();
  const [loading, setLoading] = useState(true);
  const { page, handlePageChange } = usePagination();

  useEffect(() => {
    const fetchWishlist = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/wishlist?page=${page}&pageSize=${PAGE_SIZE}`,
          {
            method: 'GET',
            credentials: 'include',
          },
        );
        const data = await res.json();
        setItemsData(data);
      } catch (err) {
        console.error(err);
        setItemsData({ items: [], totalPages: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, [page]);

  const handleDeleteItem = async (productId: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/wishlist/${productId}`,
        {
          method: 'DELETE',
          credentials: 'include',
        },
      );
      if (!res.ok) throw new Error('Failed to delete');

      setItemsData((prev: any) => {
        if (!prev) return prev;
        return {
          ...prev,
          items: (prev.items || []).filter(
            (item: any) => item.productId !== productId,
          ),
        };
      });
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

      {loading ? (
        <div className="py-8 flex items-center justify-center">Loading...</div>
      ) : itemsData?.items?.length > 0 ? (
        <div>
          <div
            className="text-sm text-[var(--color-primary)] border-b border-gray-300 pb-2"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <p>Products</p>
          </div>
          <div data-aos="fade-right" data-aos-delay="300">
            {itemsData.items.map((item: any) => (
              <WishItem
                key={item.productId}
                productName={item.productName}
                productImage={item.image}
                price={item.price}
                onDelete={() => handleDeleteItem(item.productId)}
              />
            ))}
          </div>
          <CustomPagination
            pagesCount={itemsData.totalPages}
            page={page}
            handlePageChange={handlePageChange}
          />
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
