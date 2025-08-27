import { inter, poppins } from '@/layout';
import Image from 'next/image';

interface OrderedItemProps {
  productName: string;
  imageUrl: string;
  count: number;
}
function OrderedItem({ productName, imageUrl, count }: OrderedItemProps) {
  return (
    <div className="relative w-[85px]">
      <div className="h-[90px] w-[85px] bg-[#f4f4f4]">
        <Image
          style={{ mixBlendMode: 'multiply' }}
          height={100}
          width={100}
          src={imageUrl}
          alt={productName}
          className="w-full h-full"
        />
      </div>
      <span className="absolute top-[-10] right-[-10] bg-black rounded-full w-8 h-8 text-white flex justify-center items-center text-sm">
        {count}
      </span>
    </div>
  );
}

function Order() {
  return (
    <div className="p-5 md:p-25 shadow-xl rounded-md border border-gray-100 max-w-[738px]">
      <div className={`${poppins.className} md:flex md:flex-col md:items-center`}>
        <div className="mb-3">
          <p className="text-[28px] font-medium  text-[var(--color-primary)]">
            Thank you! 🎉
          </p>
        </div>
        <div>
          <p className="text-[40px] font-medium leading-[44px] md:text-center">
            Your order has been received
          </p>
        </div>
      </div>
      <div className="flex justify-center mt-12 mb-8">
        <OrderedItem
          productName=""
          imageUrl="https://m.media-amazon.com/images/I/51i6LeHlc9L._SS522_.jpg"
          count={1}
        />
      </div>
      <div className={`text-sm ${inter.className} flex flex-col md:hidden`}>
        <div className="border-b border-gray-100 font-semibold py-4 flex flex-col gap-2">
          <p className="text-[var(--color-primary)]">Order code</p>
          <p>#1342_1242</p>
        </div>
        <div className="border-b border-gray-100 font-semibold py-4 flex flex-col gap-2">
          <p className="text-[var(--color-primary)]">Date</p>
          <p>27 Aug 2025</p>
        </div>
        <div className="border-b border-gray-100 font-semibold py-4 flex flex-col gap-2">
          <p className="text-[var(--color-primary)]">Total</p>
          <p>$37.49</p>
        </div>
        <div className="border-b border-gray-100 font-semibold py-4 flex flex-col gap-2">
          <p className="text-[var(--color-primary)]">Payment method</p>
          <p>Card Credit</p>
        </div>
      </div>
      <div className='hidden md:flex md:justify-center md:font-semibold'>
        <div className={`text-sm flex space-x-4 ${inter.className}`}>
          <div className="text-[var(--color-primary)] space-y-4">
            <p>Order code:</p>
            <p>Date:</p>
            <p>Total:</p>
            <p>Payment method:</p>
          </div>
          <div className='space-y-4 '>
            <p>#1342_1242</p>
            <p>27 Aug 2025</p>
            <p>$37.49</p>
            <p>Card Credit</p>
          </div>
        </div>
      </div>
      <div className="mt-5 px-5 md:mt-10">
        <button className="w-full bg-black text-white rounded-lg py-3 cursor-pointer font-semibold">
          Purchase history
        </button>
      </div>
    </div>
  );
}

export default Order;
