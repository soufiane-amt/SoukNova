import AccountNavigator from './components/AccountNavigator';
import AccountDetailsForm from './components/AccountDetailsForm';
import { poppins } from '@/layout';

function MyAccountPage() {
  return (
    <main className="mx-[160px] max-lg:mx-20 max-md:mx-10 max-sm:mx-8 py-20 max-xl:mx-20">
      <div className="py-25 md:py-8">
        <h2
          className={`mx-auto text-center text-[52px] md:text-[45px] font-medium ${poppins.className}`}
        >
          My Account
        </h2>
      </div>
      <div className="md:flex">
        <AccountNavigator />
        <AccountDetailsForm />
      </div>
    </main>
  );
}

export default MyAccountPage;
