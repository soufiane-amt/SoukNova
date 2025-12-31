'use client';

import Loader from '../../components/feedback/loader/Loader';
import { useLoader } from '../../hooks/useLoader';
import AccountDetailsForm from './components/AccountDetailsForm';

function MyAccountPage() {
  const loading = useLoader(1500);

  if (loading) return <Loader />;

  return <AccountDetailsForm />;
}

export default MyAccountPage;
