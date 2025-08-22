'use client';

import { inter } from '@/layout';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import Image from 'next/image';
import { useState } from 'react';

const defaultUserImage = '/images/myAccount/default-user.png';

const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState('Account'); // default selected

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (item: string) => {
    setSelected(item);
    setIsOpen(false); // close dropdown on selection
  };

  const items = ['Account', 'Address', 'Orders', 'Wishlist', 'Log Out'];

  return (
    <div className="inline-block text-left rounded-md mx-5">
      <button
        onClick={toggleDropdown}
        className="md:hidden border border-2 inline-flex justify-center w-full px-4 py-2 text-lg font-bold text-gray-700 bg-white rounded-md hover:bg-gray-50"
      >
        {selected}
        <svg
          className={`ml-auto h-6 w-6 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          className="mt-2 w-56 rounded-md bg-white w-full p-1 md:hidden"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          <div className="py-1" role="none">
            {items.map((item) => (
              <a
                key={item}
                onClick={() => handleSelect(item)}
                className={`text-gray-700 block px-4 py-2 text-md mb-2 hover:bg-gray-100 ${
                  selected === item ? 'font-bold' : 'font-medium'
                } ${inter.className}`}
                role="menuitem"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      )}
      <div
        className="mt-2 w-56 rounded-md w-full hidden md:block"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
      >
        <div className="py-1" role="none">
          {items.map((item) => (
            <a
              key={item}
              onClick={() => handleSelect(item)}
              className={`text-gray-700 block py-2 text-md mb-2 hover:bg-gray-100 cursor-pointer ${
                selected === item ? 'font-bold border-b' : 'font-medium'
              } ${inter.className}`}
              role="menuitem"
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

interface ProfilePictureEditorProps {
  imageUrl?: string;
}

function ProfilePictureEditor({ imageUrl }: ProfilePictureEditorProps) {
  return (
    <div className="relative w-20 h-20 cursor-pointer mx-auto">
      <Image
        height={50}
        width={50}
        alt="Profile Picture"
        src={imageUrl || defaultUserImage}
        className="w-full h-full"
      />
      <button
        className="absolute bottom-0 right-0 bg-black rounded-full px-[4.5px] border-2 border-white hover:bg-gray-800 transition"
        aria-label="Edit profile picture"
      >
        <CameraAltOutlinedIcon className="text-white" sx={{ fontSize: 14 }} />
      </button>
    </div>
  );
}

function AccountNavigator() {
  return (
    <div className="flex flex-col justify-center md:justify-start  bg-[#F3F5F7] py-10 rounded-lg md:w-1/5 md:py-10 h-[468px] min-w-[262px] ">
      <div className="flex flex-col justify-center mb-5">
        <ProfilePictureEditor imageUrl={undefined} />
        <p className="text-center font-semibold text-lg my-3">Soufiane</p>
      </div>
      <Dropdown />
    </div>
  );
}

export default AccountNavigator;
