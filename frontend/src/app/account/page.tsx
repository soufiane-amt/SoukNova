'use client';

import { useAuthGuard } from '../../hooks/useAuthGuard';
import { useLoader } from '../../hooks/useLoader';
import AccountDetailsForm from './components/AccountDetailsForm';

function MyAccountPage() {
  const loading = useLoader(1500);
  useAuthGuard();
  
  if (loading) return <div></div>;

  return <AccountDetailsForm />;
}

export default MyAccountPage;
