'use client';

import Image from 'next/image';
import { TypeAnimation } from 'react-type-animation';
import { motion } from 'framer-motion';

const imageUrl = '/images/backgrounds/auth_back_image.png';

export default function AuthSidePanel() {
  return (
    <div className="w-screen md:w-[50%] md:h-screen bg-neutral-bg z-[0] relative">
      <TypeAnimation
        sequence={['3legant.', 1000]}
        speed={50}
        className=" top-4 left-[40%] font-bold text-xl absolute"
        wrapper="h1"
        repeat={Infinity}
      />

      <motion.div
        className="w-full flex justify-center items-center"
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        <Image
          className="w-[200px] md:w-[60%] object-cover z-[-1]"
          src={imageUrl}
          alt="Side visual"
          width={600}
          height={400}
          priority
        />
      </motion.div>
    </div>
  );
}
