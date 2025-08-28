'use client'

import AccountDetailsForm from './components/AccountDetailsForm';
import SettingsWrap from '../../components/layout/Settings/SettingsWrap';
import { useLoader } from '../../components/ui/loader/useLoader';
import Loader from '../../components/ui/loader/Loader';

function MyAccountPage() {
  const loading = useLoader(1500);

  if (loading) return <Loader />;

  return (
    <SettingsWrap>
      <AccountDetailsForm />
    </SettingsWrap>
  );
}

export default MyAccountPage;
