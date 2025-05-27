'use client';
import { useForm } from 'react-hook-form';
import { SignUpSchema, SignUpInput } from '../schemas/signUpSchema';
import { zodResolver } from '@hookform/resolvers/zod';

export default function SignUpForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpInput>({
    resolver: zodResolver(SignUpSchema),
  });

  const onSubmit = (data: SignUpInput) => {
    console.log('Form Data:', data);
  };

  return (
    <div className=" mx-auto w-full max-w-sm font-sans ">
      <div className="my-8">
        <div className="my-6">
          <h1 className="text-[#141718] text-4xl font-bold ">Sign up</h1>
        </div>
        <div>
          <label className="text-[#6C7275] text-base ">
            Already have an account?&nbsp;
            <a className="font-bold text-black">Sign in</a>
          </label>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-8">
          <input
            className="w-full pb-4 border-b border-b-[#E8ECEF] focus:outline-none text-sm text-[#6C7275] text-base"
            {...register('firstName')}
            placeholder="First Name"
          />
          <p className="text-red-500 text-xs">{errors.firstName?.message}</p>
        </div>

        <div className="mb-8">
          <input
            className="w-full pb-4 border-b border-b-[#E8ECEF] focus:outline-none text-sm text-[#6C7275] text-base"
            {...register('lastName')}
            placeholder="Last Name"
          />
          <p className="text-red-500 text-xs">{errors.lastName?.message}</p>
        </div>

        <div className="mb-8">
          <input
            className="w-full pb-4 border-b border-b-[#E8ECEF] focus:outline-none text-sm text-[#6C7275] text-base"
            {...register('email')}
            type="email"
            placeholder="Email address"
          />
          <p className="text-red-500 text-xs">{errors.email?.message}</p>
        </div>

        <div className="mb-8">
          <input
            className="w-full pb-4 border-b border-b-[#E8ECEF] focus:outline-none text-sm text-[#6C7275] text-base"
            {...register('password')}
            type="password"
            placeholder="Password"
          />
          <p className="text-red-500 text-xs">{errors.password?.message}</p>
        </div>

        <div className="flex items-center my-8">
          <input type="checkbox" className="w-4 h-4 mr-3" />
          <label className="text-[#6C7275] text-base">
            I agree with&nbsp;
            <a className="font-bold text-black">Privacy Policy</a>
            &nbsp;and&nbsp;
            <a className="font-bold text-black">Terms of Use</a>
          </label>
        </div>
        <button
          className="w-full py-3 bg-[#141718] text-white rounded-md hover:bg-[#47555a] cursor-pointer transition-colors duration-300"
          type="submit"
        >
          Sign Up
        </button>
      </form>
      {/* #47555a */}
    </div>
  );
}
