import AuthSidePanel from './features/auth/components/AuthSidePanel';
import SignUpForm from './features/auth/components/SignUpForm';

export default function Home() {
  return (
    <div className='flex justify-center md:flex-row'>
      <AuthSidePanel />
      <SignUpForm />
    </div>
  );
}
