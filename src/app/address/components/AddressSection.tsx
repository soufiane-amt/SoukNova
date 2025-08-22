import { inter } from '@/layout';
import AddressField from './AddressField';

function AddressSection() {
  return (
    <div className="w-full ml-10">
      <div className="mb-5 mt-10">
        <p className={`${inter.className} font-semibold text-xl`}>Address</p>
      </div>
      <div className='w-full space-y-3 md:flex md:space-x-5'>
        <AddressField
          fieldName="Billing Address"
          fullName="Sofia Havertz"
          phoneNumber="(+1) 234 567 890"
          address="345 Long Island, NewYork, United States"
        />
        <AddressField
          fieldName="Billing Address"
          fullName="Sofia Havertz"
          phoneNumber="(+1) 234 567 890"
          address="345 Long Island, NewYork, United States"
        />
      </div>
    </div>
  );
}

export default AddressSection;
