import { inter } from '@/layout';
import Image from 'next/image';
import { getFirstTwoWords } from '../../../../utils/helpers';
import React, { useState } from 'react';
import { CircularProgress } from '@mui/material';

interface WishItemProps {
  productName: string;
  productImage: string;
  price: number;
  onDelete: () => Promise<void> | void;
}

function WishItem({
  productName,
  productImage,
  price,
  onDelete,
}: WishItemProps) {
  const shortendProductName = getFirstTwoWords(productName);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteClick = async () => {
    if (deleting) return;
    try {
      setDeleting(true);
      await onDelete?.();
    } catch (e) {
      console.error('Failed to delete wishlist item', e);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="mt-5 border-b border-gray-300 py-5">
      <div className="md:flex md:justify-between md:items-center">
        <div className="flex ">
          <button
            onClick={handleDeleteClick}
            className="p-2 md:py-0 rounded-full cursor-pointer text-xl text-black-shade-4 px-4 disabled:opacity-50"
            aria-label={`Remove ${shortendProductName} from wishlist`}
            disabled={deleting}
          >
            {deleting ? <CircularProgress size={18} color="inherit" /> : '✕'}
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
