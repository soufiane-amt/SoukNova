'use client';
const imageUrl = '/images/backgrounds/auth_back_image.png';

export default function AuthSidePanel() {
  return (
    <div className="w-full md:w-[50%] h-[40vh] md:h-screen relative bg-[#F3F5F7]  flex justify-center">
      <h1 className="absolute top-4 left-1/2 font-bold text-xl">3legant.</h1>
      <div className="w-full h-full [@media(min-width:980px)]:w-[80%] [@media(min-width:980px)]:h-[80%]">
        <img
          className=" "
          src={imageUrl}
          alt="Side visual"
        />
      </div>
    </div>
  );
}