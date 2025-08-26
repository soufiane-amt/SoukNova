import { inter } from '@/layout';

function CartSummary() {
  return (
    <div className={`border rounded-lg p-5 flex-1`}>
      <div className='mb-3'>
        <p className="font-semibold text-xl">Cart summary</p>
      </div>
      <div className="flex flex-col w-full font-medium">
        <div className="w-full border my-2 rounded-lg border-gray-500 flex items-center justify-between">
          <label className="flex items-center">
            <input
              className="m-4 h-[18px] w-[18px] text-start"
              type="radio"
              name="shipping"
              value="free"
            />
            Free shipping
          </label>
          <label className="pr-3">$0.00</label>
        </div>
        <div className="w-full border my-2 rounded-lg border-gray-500 flex items-center justify-between">
          <label className="flex items-center">
            <input
              className="m-4 h-[18px] w-[18px] text-start"
              type="radio"
              name="shipping"
              value="express"
            />
            Express shipping
          </label>
          <label className="pr-3">+$15.00</label>
        </div>
        <div className="w-full border my-2 rounded-lg border-gray-500 flex items-center justify-between">
          <label className="flex items-center">
            <input
              className="m-4 h-[18px] w-[18px] text-start"
              type="radio"
              name="shipping"
              value="pickup"
            />
            Pick Up
          </label>
          <label className="pr-3">%21.00</label>
        </div>
      </div>
      <div className="">
        <div className="text-md flex justify-between py-4 border-b border-gray-200">
          <label>Subtotal</label>
          <p className="font-semibold">$37.49</p>
        </div>
        <div className="text-lg font-bold flex justify-between py-4">
          <label>Total</label>
          <p>$37.49</p>
        </div>
      </div>
      <div className="mt-5 md:mt-0">
        <button className="w-full bg-black text-white rounded-lg py-2 cursor-pointer font-semibold md:px-5">
          Checkout
        </button>
      </div>
    </div>
  );
}

export default CartSummary;
