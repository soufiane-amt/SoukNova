'use client';
import { useLoader } from '../../components/ui/loader/useLoader';
import AddressSection from './components/AddressSection';
import Loader from '../../components/ui/loader/Loader';
import SettingsNavigator from '../../components/layout/Settings/SettingsWrap';

function AddressPage() {
  const loading = useLoader(1500);

  if (loading) return <Loader />;

  return (
    <SettingsNavigator>
      <AddressSection />
    </SettingsNavigator>
  );
}

export default AddressPage;
