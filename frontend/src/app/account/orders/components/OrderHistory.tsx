'use client';
import { useEffect, useState } from 'react';
import 'aos/dist/aos.css';
import { inter } from '@/layout';
import OrderInfo from './OrderInfo';
import CustomPagination from '../../../../components/ui/CustomPagination';
import EmptySectionMessage from '../../../../components/feedback/EmptySection';
import { usePagination } from '../../../../hooks/usePagination';

const PAGE_SIZE = 5;

function OrderHistory() {
  const [itemsData, setItemsData] = useState<any>();
  const { page, handlePageChange } = usePagination();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/order?page=${page}&pageSize=${PAGE_SIZE}`,
          {
            method: 'GET',
            credentials: 'include',
          },
        );

        if (!res.ok) {
          throw new Error(`Failed to place order: ${res.status}`);
        }

        const data = await res.json();
        setItemsData(data);
      } catch (e: any) {
        console.error(e.message);
      }
    };
    fetchOrders();
  }, [page]);
  return (
    <div className="w-full md:ml-10 md:mt-0 mt-5" data-aos="fade-left">
      <div className="mb-5" data-aos="fade-left" data-aos-delay="100">
        <p className={`${inter.className} font-semibold text-xl`}>
          Orders History
        </p>
      </div>
      <div className="overflow-y-auto custom-scrollbar">
        {itemsData?.orders?.length > 0 ? (
          <>
            {itemsData.orders.map((order: any, idx: number) => (
              <div
                key={order.id}
                data-aos="fade-left"
                data-aos-delay={200 + idx * 100}
              >
                <OrderInfo
                  id={order.id}
                  date={order.date}
                  status="PROGRESS"
                  price={order.price}
                />
              </div>
            ))}

            <CustomPagination
              pagesCount={itemsData.totalPages}
              page={page}
              handlePageChange={handlePageChange}
            />
          </>
        ) : (
          <div className="mt-30">
            <EmptySectionMessage message="Order history is empty" />
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderHistory;
