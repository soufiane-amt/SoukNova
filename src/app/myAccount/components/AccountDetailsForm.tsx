import { inter, poppins } from '@/layout';
import { Typography } from '@mui/material';

function AccountDetailsForm() {
  return (
    <div className="my-5 md:w-3/5 md:w-4/5 w-full px-[72px] max-lg:px-[32px] max-md:px-0 max-md:pt-10" data-aos="fade-right" data-aos-delay="200">
      <div>
        <div className="mb-5 mt-10">
          <p className={`${inter.className} font-semibold text-xl`}>
            Account Details
          </p>
        </div>
        <div className="flex flex-col mb-8">
          <label className="font-bold text-[var(--color-primary)] text-xs mb-2">
            FIRST NAME
          </label>
          <input
            placeholder="First name"
            className={`text-md border py-2 px-4 rounded-md border border-[#CBCBCB] ${poppins.className}`}
          />
        </div>
        <div className="flex flex-col mb-8">
          <label className="font-bold text-[var(--color-primary)] text-xs mb-2">
            SECOND NAME
          </label>
          <input
            placeholder="Last name"
            className="text-md border py-2 px-4 rounded-md border border-[#CBCBCB]"
          />
        </div>
        <div className="flex flex-col mb-8">
          <label className="font-bold text-[var(--color-primary)] text-xs mb-2">
            EMAIL
          </label>
          <input
            placeholder="Email"
            type="email"
            className="text-md border py-2 px-4 rounded-md border border-[#CBCBCB]"
          />
        </div>
      </div>

      <div>
        <div className="mb-5 mt-10">
          <p className={`${inter.className} font-semibold text-xl`}>
            Password
          </p>
        </div>

        <div className="flex flex-col mb-8">
          <label className="font-bold text-[var(--color-primary)] text-xs mb-2">
            OLD PASSWORD
          </label>
          <input
            placeholder="Old password"
            className={`text-md border py-2 px-4 rounded-md border border-[#CBCBCB] ${poppins.className}`}
          />
        </div>
        <div className="flex flex-col mb-8">
          <label className="font-bold text-[var(--color-primary)] text-xs mb-2">
            NEW PASSWORD
          </label>
          <input
            placeholder="New Password"
            className="text-md border py-2 px-4 rounded-md border border-[#CBCBCB]"
          />
        </div>
        <div className="flex flex-col mb-8">
          <label className="font-bold text-[var(--color-primary)] text-xs mb-2">
            REPEAT NEW PASSWORD
          </label>
          <input
            placeholder="Repeat new Password"
            type="email"
            className="text-md border py-2 px-4 rounded-md border border-[#CBCBCB]"
          />
        </div>
      </div>
      <div>
        <button
          className={`${poppins.className} bg-black text-white w-full py-2 rounded-md font-semibold`}
        >
          Save changes
        </button>
      </div>
    </div>
  );
}

export default AccountDetailsForm;
