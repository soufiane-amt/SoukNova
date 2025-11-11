'use client';

import { inter } from '@/layout';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import api from '../../../utils/axios';

const defaultUserImage = '/images/myAccount/default-user.png';

const Dropdown = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const items = ['Account', 'Orders', 'Wishlist'];

  const current =
    items.find((item) => pathname === `/${item.toLowerCase()}`) || 'Account';

  const handleSignOut = async () => {
    await api.post('/auth/signout');
    router.push('/auth/signin');
  };
  return (
    <div className="inline-block text-left rounded-md mx-5">
      {/* Mobile dropdown button */}
      <button
        onClick={toggleDropdown}
        className="md:hidden border border-2 inline-flex justify-center w-full px-4 py-2 text-lg font-bold text-gray-700 bg-white rounded-md hover:bg-gray-50"
      >
        {current}
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

      {/* Mobile dropdown menu */}
      {isOpen && (
        <div
          className="mt-2 rounded-md bg-white w-full p-1 md:hidden"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          <div className="py-1" role="none">
            {items.map((item) => (
              <Link
                key={item}
                href={`/account/${item.toLowerCase()}`}
                className={`text-gray-700 block px-4 py-2 text-md mb-2 hover:bg-gray-100 ${
                  current === item ? 'font-bold' : 'font-medium'
                } ${inter.className}`}
              >
                {item}
              </Link>
            ))}
            <div>
              <button
                className={`text-gray-700 block px-4 py-2 text-md mb-2 hover:bg-gray-100 ${inter.className}`}
                role="menuitem"
                onClick={handleSignOut}
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop menu */}
      <div
        className="mt-2 rounded-md w-full hidden md:block"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
      >
        <div className="py-1" role="none">
          {items.map((item) => (
            <Link
              key={item}
              href={`/account/${item.toLowerCase()}`}
              className={`text-gray-700 block py-2 text-md mb-2 hover:bg-gray-100 cursor-pointer ${
                current === item ? 'font-bold border-b' : 'font-medium'
              } ${inter.className}`}
              role="menuitem"
            >
              {item}
            </Link>
          ))}
          <div>
            <button
              className={`text-gray-700 block py-2 text-md mb-2 hover:bg-gray-100 cursor-pointer ${inter.className}`}
              role="menuitem"
              onClick={handleSignOut}
            >
              Log out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

type ProfilePictureEditorProps = {
  imageUrl?: string;
  onImageSelect?: (file: File) => void; // callback for parent to handle file
};

function ProfilePictureEditor({
  imageUrl,
  onImageSelect,
}: ProfilePictureEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImageSelect) {
      onImageSelect(file); // send the file to parent component
    }
  };

  return (
    <div
      className="relative w-20 h-20 cursor-pointer mx-auto"
      onClick={handleClick}
    >
      <Image
        height={80}
        width={80}
        alt="Profile Picture"
        src={imageUrl || defaultUserImage}
        className="w-full h-full rounded-full object-cover"
      />
      <button
        type="button"
        className="absolute bottom-0 right-0 bg-black rounded-full px-[4.5px] border-2 border-white hover:bg-gray-800 transition"
        aria-label="Edit profile picture"
        onClick={handleClick}
      >
        <CameraAltOutlinedIcon className="text-white" sx={{ fontSize: 14 }} />
      </button>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}

function AccountNavigator() {
  const [profileImage, setProfileImage] = useState<string | undefined>(
    undefined,
  );

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/user/profile');
        if (!res.ok) throw new Error('Failed to fetch profile');

        const data = await res.json();

        const imageUrl = data.imageUrl
          ? `${process.env.NEXT_PUBLIC_API_URL}${data.imageUrl}`
          : defaultUserImage;
        setProfileImage(imageUrl);
      } catch (err) {
        console.error(err);
      }
    }

    fetchProfile();
  }, []);

  const handleImageSelect = async (file: File) => {
    const objectUrl = URL.createObjectURL(file);
    setProfileImage(objectUrl);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/user/upload-profile-picture', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to upload');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col justify-center md:justify-start  bg-[#F3F5F7] py-10 rounded-lg md:w-1/5 md:py-10 h-[468px] min-w-[262px] ">
      <div className="flex flex-col justify-center mb-5">
        <ProfilePictureEditor
          imageUrl={profileImage}
          onImageSelect={handleImageSelect}
        />
        <p className="text-center font-semibold text-lg my-3">Soufiane</p>
      </div>
      <Dropdown />
    </div>
  );
}

export default AccountNavigator;
