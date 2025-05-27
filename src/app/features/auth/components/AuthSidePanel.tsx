'use client'
const imageUrl = '/images/backgrounds/auth_back_image.png';

export default function AuthSidePanel() {
  return (
    <div className="w-1/2  h-screen relative">
      <h1 className="absolute top-4 left-1/2 font-bold text-xl">3legant.</h1>
      <img className="w-full h-full object-cover z-[-1]" src={imageUrl} alt="Side visual" />
    </div>
  );
}


{/* <div className="w-1/2 h-screen relative">
  <div className="absolute inset-0 bg-black bg-opacity-40 z-0" />
  <h1 className="absolute top-4 left-4 text-white text-2xl font-bold z-10">3legant</h1>
  <img src={imageUrl} alt="Side visual" className="w-full h-full object-cover z-[-1]" />
</div> */}
