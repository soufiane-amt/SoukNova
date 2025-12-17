import { inter } from '@/layout';
import Image from 'next/image';
import { getFirstTwoWords } from '../../../../utils/helpers';
import React from 'react';

interface WishItemProps {
  productName: string;
  productImage: string;
  price: number;
  onDelete: () => void;
}

function WishItem({
  productName,
  productImage,
  price,
  onDelete,
}: WishItemProps) {
  const shortendProductName = getFirstTwoWords(productName);
  return (
    <div className="mt-5 border-b border-gray-300 py-5">
      <div className="md:flex md:justify-between md:items-center">
        <div className="flex ">
          <button
            onClick={onDelete}
            className="p-2 md:py-0 rounded-full cursor-pointer text-xl text-black-shade-4 px-4"
            aria-label={`Remove ${shortendProductName} from wishlist`}
          >
            &#x2715;
          </button>
          <div className="bg-[#f4f4f4] mr-3 h-[60px] min-w-[60px] relative">
            <Image
              src={productImage}
              alt="Wish product"
              fill
              className="object-cover"
            />
          </div>
          <div
            className={`text-sm flex flex-col md:flex-row justify-between  ${inter.className}`}
          >
            <div className="md:flex  md:flex-col md:space-y-5">
              <p className="font-semibold">{shortendProductName}</p>
              <p className="text-[var(--color-primary)] text-xs md:m-0">
                color: normal
              </p>
              <p className="md:hidden">${price}</p>
            </div>
          </div>
        </div>
        <div className="hidden md:block">
          <p>${price}</p>
        </div>
        <div className="mt-5 md:mt-0 text-xs">
          <button className="w-full bg-black text-white rounded-lg py-2 cursor-pointer font-semibold px-5">
            Add <span className="md:hidden lg:block">To Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}
export default React.memo(WishItem);
