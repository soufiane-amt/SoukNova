'use client';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { SignUpSchema, SignUpInput } from '../schemas/signUpSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import api from '../../../utils/axios';
import { useRouter } from 'next/navigation';
import { useCart } from '../../../context/CartContext';
import { CircularProgress } from '@mui/material';

const inputClass =
  'w-full pb-2 border-b border-b-[#E8ECEF] focus:outline-none text-sm text-color-primary md:text-base';

export default function SignUpForm() {
  const router = useRouter();
  const { showToast } = useCart();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpInput>({
    resolver: zodResolver(SignUpSchema),
  });
  const [serverMessage, setServerMessage] = useState('');

  const onSubmit = async (data: SignUpInput) => {
    setLoading(true);
    try {
      await api.post('/auth/signup', data);
      setServerMessage('');
      router.push('/home');
      showToast('You are signed up!');
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Signup failed';
      setServerMessage(msg);
    }
    finally{
        setLoading(false);
    }
  };

  return (
    <motion.div
      className=" m-auto w-full max-w-sm font-sans md:mx-10 px-5"
      initial={{ y: -200, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: 'easeOut' }}
    >
      <div className=" md:my-8 my-4">
        <div className="md:my-6">
          <h1 className="text-[#141718] text-2xl md:text-4xl font-bold ">
            {loading ? <CircularProgress size={20} color="inherit"/> : 'Sign Up'}
          </h1>
        </div>
        <div>
          <label className="text-color-primary text-sm md:text-base ">
            Already have an account?&nbsp;
            <a className="font-bold text-black text-orange-500 hover:border-b" href="/auth/signin">
              Sign in
            </a>
          </label>
        </div>
      </div>
      <form className="" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4 md:mb-8">
          <input
            className={inputClass}
            {...register('firstName')}
            placeholder="First Name"
          />
          <p className="text-red-500 text-xs">{errors.firstName?.message}</p>
        </div>

        <div className="mb-4 md:mb-8">
          <input
            className={inputClass}
            {...register('lastName')}
            placeholder="Last Name"
          />
          <p className="text-red-500 text-xs">{errors.lastName?.message}</p>
        </div>

        <div className="mb-4 md:mb-8">
          <input
            className={inputClass}
            {...register('email')}
            type="email"
            placeholder="Email address"
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

        <div className="flex items-center my-4 md:my-8">
          <input
            type="checkbox"
            className="w-4 h-4 mr-3"
            {...register('acceptTerms')}
          />
          <label className="text-color-primary text-xs md:text-sm">
            I agree with&nbsp;
            <a className="font-bold text-black hover:underline cursor-pointer">
              Privacy Policy
            </a>
            &nbsp;and&nbsp;
            <a className="font-bold text-black hover:underline cursor-pointer">
              Terms of Use
            </a>
          </label>
        </div>
        <div className="flex justify-center">
          <button
            className="w-[90%] md:w-full py-3 bg-[#141718] text-white rounded-md hover:bg-[#47555a] cursor-pointer transition-colors duration-300"
            type="submit"
          >
            Sign Up
          </button>
        </div>
        <div className="flex justify-center">
          <p className="text-red-500 text-xs md:text-sm">{serverMessage}</p>
        </div>
      </form>
    </motion.div>
  );
}
