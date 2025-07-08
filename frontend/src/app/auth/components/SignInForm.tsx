'use client';
import { useForm } from 'react-hook-form';
import { SignInSchema, SignInInput } from '../schemas/signInSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useState } from 'react';

const inputClass =
  'w-full pb-2 border-b border-b-[#E8ECEF] focus:outline-none text-sm text-color-primary md:text-base';

export default function SignInForm() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInInput>({
    resolver: zodResolver(SignInSchema),
  });

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
      <form onSubmit={handleSubmit(handleSubmit)}>
        <div className="mb-4 md:mb-8">
          <input
            className={inputClass}
            {...register('identifier')}
            type="identifier"
            placeholder="Username or email address"
          />
          <p className="text-red-500 text-xs">{errors.identifier?.message}</p>
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
      </form>
    </motion.div>
  );
}
