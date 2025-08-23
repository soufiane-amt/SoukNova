import { inter } from '@/layout';
import Image from 'next/image';
import { AiOutlineClose } from 'react-icons/ai';

interface WishItemProps {
  productName: string;
  productImage: string;
  price: number;
}

function WishItem({ productName, productImage, price }: WishItemProps) {
  return (
    <div className="mt-5 border-b border-gray-300 py-5">
      <div className="md:flex md:justify-between md:items-center">
        <div className="flex ">
          <button className="p-2 md:py-0 rounded-full hover:bg-gray-200 text-xl text-black-shade-4 px-4">
            <span>&#x2715;</span>
          </button>
          <div className="bg-[#f4f4f4] mr-3 h-[60px] min-w-[60px]">
            <Image
              src={productImage}
              width={50}
              height={50}
              alt="Wish product"
              style={{ mixBlendMode: 'multiply' }}
              className="w-full h-full"
            />
          </div>
          <div
            className={`text-sm flex flex-col md:flex-row justify-between ${inter.className}`}
          >
            <div className='md:flex  md:flex-col md:space-y-5'>
              <p className="font-semibold">{productName}</p>
              <p className="text-[var(--color-primary)] text-xs md:m-0">
                color: green
              </p>
              <p className='md:hidden' >${price}</p>
            </div>
          </div>
        </div>
        <div className='hidden md:block'>
          <p>${price}</p>
        </div>
        <div className="mt-5 md:mt-0">
          <button className="w-full bg-black text-white rounded-lg py-2 cursor-pointer font-semibold md:px-5">
            Add To Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default WishItem;
