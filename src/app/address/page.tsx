import AccountNavigator from '@/myAccount/components/AccountNavigator';
import AddressSection from './components/AddressSection';
import { poppins } from '@/layout';

function AddressPage() {
  return (
    <main className="mx-[160px] max-lg:mx-20 max-md:mx-10 max-sm:mx-8 py-20 max-xl:mx-20">
      <div className="py-25 md:py-8">
        <h2
          className={` text-center text-[52px] md:text-[45px] font-medium ${poppins.className}`}
        >
          My Account
        </h2>
      </div>
      <div className="md:flex ">
        <AccountNavigator />
        <AddressSection />
      </div>
    </main>
  );
}

export default AddressPage;
