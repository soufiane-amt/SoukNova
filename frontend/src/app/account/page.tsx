'use client';

import SettingsNavigator from '../../components/ui/Settings/SettingsWrap';
import { useAuthGuard } from '../../hooks/useAuthGuard';
import { useLoader } from '../../hooks/useLoader';
import AccountDetailsForm from './components/AccountDetailsForm';

function MyAccountPage() {
  const loading = useLoader(1500);
  useAuthGuard();
  
  if (loading) return <div></div>;

  return (
    <SettingsNavigator>
      <AccountDetailsForm />
    </SettingsNavigator>
  );
}

export default MyAccountPage;
