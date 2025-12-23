'use client';

import Image from 'next/image';
import { TypeAnimation } from 'react-type-animation';
import { motion } from 'framer-motion';
import { AUTH_BACKGROUND_IMAGE } from '../../../constants/assets';

export default function AuthSidePanel() {
  return (
    <section className="w-screen md:w-[50%] md:h-screen bg-neutral-bg z-[0] relative">
      <TypeAnimation
        sequence={['SoukNova.', 1000, 'Design.', 1000, 'Inspire.', 1000]}
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
          src={AUTH_BACKGROUND_IMAGE}
          alt="Side visual"
          width={600}
          height={400}
          priority
        />
      </motion.div>
    </section>
  );
}
