import AccountNavigator from '@/account/components/AccountNavigator';
import { poppins } from '@/layout';
import { SiteFooter } from '../SiteFooter';

function SettingsNavigator({ children }) {
  return (
    <main className="flex flex-col min-h-screen">
      <div className="mx-[160px] max-xl:mx-20 max-lg:mx-20 max-md:mx-10 max-sm:mx-8 py-20 flex-1">
        <div className="py-25 md:py-8 md:mb-8">
          <h2
            className={`mx-auto text-center text-[52px] md:text-[50px] font-medium ${poppins.className}`}
          >
            My Account
          </h2>
        </div>
        <div className="md:flex">
          <AccountNavigator />
          {children}
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}

export default SettingsNavigator;
