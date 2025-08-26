import { inter } from '@/layout';
import CreditCardIcon from '@mui/icons-material/CreditCard';

function PaymentMethod() {
  return (
    <div className="p-5 border rounded">
      <div className="mb-5 mt-10">
        <p className={`${inter.className} font-semibold text-xl`}>
          Payment method
        </p>
      </div>

      <div className="border-b border-gray-500 pb-8 mb-4">
        <div className="w-full border mb-5 rounded-lg border-gray-500 flex items-center justify-between">
          <label className="flex items-center text-md md:text-[18px]">
            <input
              className="m-4 h-[18px] w-[18px] text-start"
              type="radio"
              name="shipping"
              value="free"
            />
            Pay by Card Credit
          </label>
          <label className="pr-3">
            <CreditCardIcon />
          </label>
        </div>
        <div className="w-full border rounded-lg border-gray-500 flex items-center justify-between">
          <label className="flex items-center text-md md:text-[18px]">
            <input
              className="m-4 h-[18px] w-[18px] text-start"
              type="radio"
              name="shipping"
              value="free"
            />
            Paypal
          </label>
        </div>
      </div>
      <div className="flex flex-col mb-8">
        <label className="font-bold text-[var(--color-primary)] text-xs mb-2">
          Card Number
        </label>
        <input
          placeholder="1234 1234 1234 1234"
          type="text"
          className="text-md border py-2 px-4 rounded-md border border-[#CBCBCB]"
        />
      </div>

      <div className="md:flex gap-6">
        <div className="flex-1 flex flex-col mb-8">
          <label className="font-bold text-[var(--color-primary)] text-xs mb-2">
            Expiration date
          </label>
          <input
            placeholder="MM/YY"
            type="text"
            className="text-md border py-2 px-4 rounded-md border border-[#CBCBCB]"
          />
        </div>
        <div className="flex-1 flex flex-col mb-8">
          <label className="font-bold text-[var(--color-primary)] text-xs mb-2">
            CVC
          </label>
          <input
            placeholder="CVC Code"
            type="text"
            className="text-md border py-2 px-4 rounded-md border border-[#CBCBCB]"
          />
        </div>
      </div>
    </div>
  );
}

export default PaymentMethod;
