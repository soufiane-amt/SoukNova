'use client';
import { inter } from '@/layout';
import Image from 'next/image';
import { useState } from 'react';

interface CheckoutCartItemProps {
  productImage: string;
  productName: string;
  price: number;
}
export function CheckoutCartItem({ productImage, productName, price }: CheckoutCartItemProps) {
  const [quantity, setQuantity] = useState(0);

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };
  const decreaseQuantity = () => {
    if (quantity > 0) setQuantity((prev) => prev - 1);
  };

  return (
    <div className="w-full flex py-3 border-b border-gray-200">
      <div className="bg-[#f4f4f4] mr-4 h-[80px] min-w-[80px]">
        <Image
          src={productImage}
          width={50}
          height={50}
          alt="Wish product"
          style={{ mixBlendMode: 'multiply' }}
          className="w-full h-full"
        />
      </div>
      <div className="w-full flex justify-between">
        <div
          className={`h-full text-sm flex flex-col justify-between md:flex-row  ${inter.className}`}
        >
          <div className="flex flex-col justify-around h-full">
            <div>
              <p className="font-semibold">{productName}</p>
            </div>
            <div>
              <p className="text-[var(--color-primary)] text-xs md:m-0">
                color: green
              </p>
            </div>
            <div className="flex justify-around items-center font-bold rounded border h-7 w-20 border border-gray-500">
              <button className="cursor-pointer" onClick={decreaseQuantity}>
                -
              </button>
              <span className="text-xs">{quantity}</span>
              <button className="cursor-pointer" onClick={increaseQuantity}>
                +
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-start font-medium">
          <p className=" text-[12px] md:text-[14px] ">${price}</p>
        </div>
      </div>
    </div>
  );
}

export default CheckoutCartItem;
