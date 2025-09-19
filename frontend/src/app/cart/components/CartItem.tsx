'use client';
import { inter } from '@/layout';
import Image from 'next/image';
import { useState } from 'react';
import { useCart } from '../../../context/CartContext';

interface CartItemProps {
  productId: string;
  productImage: string;
  productName: string;
  price: number;
}
export function CartItem({
  productId,
  productImage,
  productName,
  price,
}: CartItemProps) {
  const { cart, addToCart, removeFromCart, decreaseFromCart, setCart } =
    useCart();

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
      <div className="w-full flex justify-between md:items-center">
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
            <div className="hidden md:block">
              <button className="flex space-x-2 rounded-full hover:bg-gray-200 text-xl text-gray-500 px-4 text-end font-bold">
                <p className="text-sm">&#x2715;</p>
                <p className="text-sm">Remove</p>
              </button>
            </div>
            <div className="flex justify-around items-center font-bold rounded border h-7 w-20 border border-gray-500 md:hidden">
              <button
                className="cursor-pointer"
                onClick={() => decreaseFromCart(productId)}
              >
                -
              </button>
              <span className="text-xs">
                {cart.find((item) => item.productId === productId)?.quantity ||
                  0}
              </span>
              <button
                className="cursor-pointer"
                onClick={() => addToCart(productId)}
              >
                +
              </button>
            </div>
          </div>
        </div>
        <div className="hidden md:flex flex justify-around items-center font-bold rounded border h-8 w-20 border border-gray-500">
          <button
            aria-label="Decrease quantity"
            className="cursor-pointer"
            onClick={() => decreaseFromCart(productId)}
          >
            -
          </button>
          <span className="text-xs">
            {cart.find((item) => item.productId === productId)?.quantity || 0}
          </span>
          <button
            aria-label="Increase quantity"
            className="cursor-pointer"
            onClick={() => addToCart(productId)}
          >
            +
          </button>
        </div>

        <div className="flex flex-col justify-start">
          <p className=" text-[15px] md:text-[18px]">${price}</p>
          <button className="block md:hidden rounded-full hover:bg-gray-200 text-xl text-gray-500 px-4 text-end font-bold">
            <span>&#x2715;</span>
          </button>
          <div></div>
        </div>
        <div className="hidden md:block">
          <p className=" font-semibold text-[15px] md:text-[18px]">${price}</p>
        </div>
      </div>
    </div>
  );
}

export default CartItem;
