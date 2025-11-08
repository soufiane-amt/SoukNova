'use client';
import { usePathname } from 'next/navigation';

interface CartNavigatorElementProps {
  stepOrder: number;
  currentPath: string;
  stepDescription: string;
  href: string;
}

function CartNavigatorElement({
  stepOrder,
  currentPath,
  stepDescription,
  href,
}: CartNavigatorElementProps) {
  const isSelected = href === currentPath;
  return (
    <div
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
  const pathname = usePathname().slice(1);
  return (
    <div className="flex justify-between overflow-x-hidden pb-12 md:mx-50">
      <CartNavigatorElement
        stepOrder={1}
        currentPath={pathname}
        stepDescription="Shopping cart"
        href="cart"
      />
      <CartNavigatorElement
        stepOrder={2}
        currentPath={pathname}
        stepDescription="Checkout details"
        href="checkout"
      />
      <CartNavigatorElement
        stepOrder={3}
        currentPath={pathname}
        stepDescription="Order complete"
        href="orderComplete"
      />
    </div>
  );
}

export default CartNavigator;
