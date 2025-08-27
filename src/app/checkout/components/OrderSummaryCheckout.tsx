import { inter } from '@/layout';
import CheckoutCartItem from './CheckoutCartItem';

function OrderSummaryCheckout() {
  return (
    <div className="p-5 border rounded">
      <div className="mb-5 ">
        <p className={`${inter.className} text-[28px]`}>
          Order summary
        </p>
      </div>
      <div className='mb-5 h-100'>
        <CheckoutCartItem
          productName="uxcell Shredded"
          productImage="https://m.media-amazon.com/images/I/51i6LeHlc9L._SS522_.jpg"
          price={39.49}
        />
      </div>
      <div className='flex justify-between gap-4'>
        <input className='border w-full rounded-lg border-gray-500 px-5' type="text" placeholder="JenkateMW" />
        <button className="w-full bg-black text-white rounded-lg py-2 cursor-pointer md:px-5 max-w-25 py-3 font-medium">
          Apply
        </button>
      </div>
      <div className="">
        <div className="text-md flex justify-between py-4 border-b border-gray-200">
          <label>Subtotal</label>
          <p className='font-semibold'>$37.49</p>
        </div>
        <div className="text-md flex justify-between py-4">
          <label>Total</label>
          <p className='font-semibold'>$37.49</p>
        </div>
      </div>
    </div>
  );
}

export default OrderSummaryCheckout;
