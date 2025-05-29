'use client';

import Image from 'next/image';

const imageUrl = '/images/backgrounds/auth_back_image.png';

export default function AuthSidePanel() {
  return (
    <div className="w-screen md:w-[50%] md:h-screen bg-[#F3F5F7] z-[0] relative">
      <h1 className=" top-4 left-[40%] font-bold text-xl absolute">3legant.</h1>
      <div className="w-full flex justify-center items-center">
        <Image
          className="w-[200px] md:w-[600px] object-cover"
          src={imageUrl}
          alt="Side visual"
          width={600}
          height={400}
          priority
        />
      </div>
    </div>
  );
}
