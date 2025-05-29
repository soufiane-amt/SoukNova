'use client';
const imageUrl = '/images/backgrounds/auth_back_image.png';

export default function AuthSidePanel() {
  return (
    <div className="w-[100vw] md:w-[50%] md:h-[100vh] bg-[#F3F5F7] z-[-1] relative">
      <h1 className=" top-4 left-1/2 font-bold text-xl absolute">3legant.</h1>
      <div className="w-full flex justify-center items-center">
        <img className="w-[200px] md:w-[600px] object-cover z-[-1] "
          src={imageUrl}
          alt="Side visual"
        />
      </div>
    </div>
  );
}

// bg-[#F3F5F7]