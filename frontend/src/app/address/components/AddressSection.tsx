import { inter } from '@/layout';
import AddressField from './AddressField';

function AddressSection() {
  return (
    <div className="w-full md:ml-25">
      <div className="mb-5 mt-10">
        <p className={`${inter.className} font-semibold text-xl`}>Address</p>
      </div>
      <div className='grid grid-cols-1 gap-5 md:grid-cols-2 w-full'>
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
