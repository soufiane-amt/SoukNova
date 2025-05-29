import AuthSidePanel from './features/auth/components/AuthSidePanel';
import SignInForm from './features/auth/components/SignInForm';
import SignUpForm from './features/auth/components/SignUpForm';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <AuthSidePanel />
      <SignInForm />
    </div>
  );
}

