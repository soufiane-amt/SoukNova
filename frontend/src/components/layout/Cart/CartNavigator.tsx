'use client';
import Link from 'next/link';
import { useState } from 'react';

interface CartNavigatorElementProps {
  stepOrder: number;
  selected: number;
  stepDescription: string;
  href: string;
  handleSelect: (arg0: number) => void;
}

function CartNavigatorElement({
  stepOrder,
  selected,
  stepDescription,
  href,
  handleSelect,
}: CartNavigatorElementProps) {
  const isSelected = stepOrder === selected;
  return (
    <Link href={href}>
      <div
        onClick={() => handleSelect(stepOrder)}
        className={`flex-1 flex items-center py-6 cursor-pointer mr-5  ${
          isSelected ? 'border-b-2 ' : 'hidden md:flex'
        }`}
      >
        <div className="mr-3">
          <p
            className={`flex h-[42px] w-[42px] items-center justify-center rounded-[40px] text-white ${
              isSelected ? 'bg-black' : 'bg-[#b1b5c3]'
            }`}
          >
            {stepOrder}
          </p>
        </div>
        <div
          className={`text-md font-semibold  ${
            isSelected ? 'text-black' : 'text-[#b1b5c3]'
          }`}
        >
          <p>{stepDescription}</p>
        </div>
      </div>
    </Link>
  );
}

function CartNavigator() {
  const [selected, setSelected] = useState(1);
  const handleSelect = (selected: number) => {
    setSelected(selected);
  };
  return (
    <div className="flex justify-between overflow-x-hidden pb-12 md:mx-50">
      <CartNavigatorElement
        stepOrder={1}
        selected={selected}
        stepDescription="Shopping cart"
        handleSelect={handleSelect}
        href='/cart'
      />
      <CartNavigatorElement
        stepOrder={2}
        selected={selected}
        stepDescription="Checkout details"
        handleSelect={handleSelect}
        href='/checkout'
      />
      <CartNavigatorElement
        stepOrder={3}
        selected={selected}
        stepDescription="Order complete"
        handleSelect={handleSelect}
        href='orderComplete'
      />
    </div>
  );
}

export default CartNavigator;
