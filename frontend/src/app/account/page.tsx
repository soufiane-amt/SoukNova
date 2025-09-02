'use client';

import AccountDetailsForm from './components/AccountDetailsForm';
import { useLoader } from '../../components/ui/loader/useLoader';
import Loader from '../../components/ui/loader/Loader';
import SettingsNavigator from '../../components/layout/Settings/SettingsWrap';

function MyAccountPage() {
  const loading = useLoader(1500);

  if (loading) return <Loader />;

  return (
    <SettingsNavigator>
      <AccountDetailsForm />
    </SettingsNavigator>
  );
}

export default MyAccountPage;
