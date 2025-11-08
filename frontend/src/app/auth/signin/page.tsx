import AuthSidePanel from '@/auth/components/AuthSidePanel';
import SignInForm from '@/auth/components/SignInForm';

export default function SignUp() {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <AuthSidePanel />
      <SignInForm />
    </div>
  );
}