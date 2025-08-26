'use client';
import { useState } from 'react';

interface CartNavigatorElementProps {
  stepOrder: number;
  selected: number;
  stepDescription: string;
  handleSelect: (arg0: number) => void;
}

function CartNavigatorElement({
  stepOrder,
  selected,
  stepDescription,
  handleSelect,
}: CartNavigatorElementProps) {
  const isSelected = stepOrder === selected;
  return (
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
  );
}

function CartNavigator() {
  const [selected, setSelected] = useState(1);
  const handleSelect = (selected: number) => {
    setSelected(selected);
  };
  return (
    <div className="flex justify-between overflow-x-hidden pb-12">
      <CartNavigatorElement
        stepOrder={1}
        selected={selected}
        stepDescription="Shopping cart"
        handleSelect={handleSelect}
      />
      <CartNavigatorElement
        stepOrder={2}
        selected={selected}
        stepDescription="Checkout details"
        handleSelect={handleSelect}
      />
      <CartNavigatorElement
        stepOrder={3}
        selected={selected}
        stepDescription="Order complete"
        handleSelect={handleSelect}
      />
    </div>
  );
}

export default CartNavigator;
