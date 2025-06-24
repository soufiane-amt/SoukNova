import AuthSidePanel from '@/auth/components/AuthSidePanel';
import SignUpForm from '@/auth/components/SignUpForm';

export default function SignUp() {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <AuthSidePanel />
      <SignUpForm />
    </div>
  );
}
