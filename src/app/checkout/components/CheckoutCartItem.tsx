'use client';
import { inter } from '@/layout';
import Image from 'next/image';
import { useState } from 'react';
import { getFirstTwoWords } from '../../../utils/helpers';
import { useCart } from '../../../context/CartContext';

interface CheckoutCartItemProps {
  productId: string;
  productImage: string;
  productName: string;
  price: number;
  quantity: number;
}
export function CheckoutCartItem({
  productId,
  productImage,
  productName,
  price,
  quantity,
}: CheckoutCartItemProps) {
  const { addToCart, removeFromCart, decreaseFromCart, setCart } = useCart();

  const processedName = getFirstTwoWords(productName);
  if (!quantity) return <></>;
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
              <p className="font-semibold">{processedName}</p>
            </div>
            <div>
              <p className="text-[var(--color-primary)] text-xs">
                color: green
              </p>
            </div>
            <div className="flex justify-around items-center font-bold rounded border h-7 w-20 border-gray-500">
              <button
                aria-label="Decrease quantity"
                className="cursor-pointer"
                onClick={() => decreaseFromCart(productId)}
              >
                -
              </button>
              <span className="text-xs">{quantity}</span>
              <button
                aria-label="Increase quantity"
                className="cursor-pointer"
                onClick={() => addToCart(productId)}
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-start font-medium">
          <p className="text-[12px] md:text-[14px]">
            ${(quantity * price).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default CheckoutCartItem;
