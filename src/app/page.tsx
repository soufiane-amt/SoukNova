import AuthSidePanel from './features/auth/components/AuthSidePanel';
import SignUpForm from './features/auth/components/SignUpForm';

export default function Home() {
  return (
    <div className='flex flex-col md:flex-row justify-center'>
      <AuthSidePanel />
      <SignUpForm />
    </div>
  );
}
