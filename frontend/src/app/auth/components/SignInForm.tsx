'use client';
import { useForm } from 'react-hook-form';
import { SignInSchema, SignInInput } from '../schemas/signInSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useState } from 'react';
import api from '../../../utils/axios';
import { useRouter } from 'next/navigation';
import { useCart } from '../../../context/CartContext';

const inputClass =
  'w-full pb-2 border-b border-b-[#E8ECEF] focus:outline-none text-sm text-color-primary md:text-base';

export default function SignInForm() {
  const [serverMessage, setServerMessage] = useState('');
  const router = useRouter();
  const { showToast } = useCart();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInInput>({
    resolver: zodResolver(SignInSchema),
  });

  const onSubmit = async (data: SignInInput) => {
    try {
      await api.post('/auth/signin', data);
      setServerMessage('');
      router.push('/home');
      showToast("You are signed in!")
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Signin failed';
      setServerMessage(msg);
    }
  };

  return (
    <motion.div
      className="md:m-auto my-6 w-full max-w-sm font-sans md:mx-10 px-5"
      initial={{ y: -200, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: 'easeOut' }}
    >
      <div className=" md:my-8 my-4">
        <div className="md:my-6">
          <h1 className="text-[#141718] text-2xl md:text-4xl font-bold ">
            Sign In
          </h1>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4 md:mb-8">
          <input
            className={inputClass}
            {...register('email')}
            type="email"
            placeholder="Username or email address"
          />
          <p className="text-red-500 text-xs">{errors.email?.message}</p>
        </div>

        <div className="mb-4 md:mb-8">
          <input
            className={inputClass}
            {...register('password')}
            type="password"
            placeholder="Password"
          />
          <p className="text-red-500 text-xs">{errors.password?.message}</p>
        </div>

        <div className="flex justify-center">
          <button
            className="w-[90%] md:w-full py-3 bg-[#141718] text-white rounded-md hover:bg-[#47555a] cursor-pointer transition-colors duration-300"
            type="submit"
          >
            Sign In
          </button>
        </div>
        <div className="flex justify-center">
          <p className="text-red-500 text-xs md:text-sm">{serverMessage}</p>
        </div>
      </form>
    </motion.div>
  );
}
