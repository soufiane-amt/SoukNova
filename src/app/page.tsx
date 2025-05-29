import AuthSidePanel from './features/auth/components/AuthSidePanel';
import SignUpForm from './features/auth/components/SignUpForm';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <AuthSidePanel />
      <SignUpForm />
    </div>
  );
}

    // <div className="flex min-h-screen flex-col items-center justify-center md:flex-row ">
