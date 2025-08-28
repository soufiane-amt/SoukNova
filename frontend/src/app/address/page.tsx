'use client'
import { useLoader } from '../../components/ui/loader/useLoader';
import AddressSection from './components/AddressSection';
import SettingsWrap from '../../components/layout/Settings/SettingsWrap';
import Loader from '../../components/ui/loader/Loader';

function AddressPage() {
  const loading = useLoader(1500);

  if (loading) return <Loader />;

  return (
    <SettingsWrap>
      <AddressSection />
    </SettingsWrap>
  );
}

export default AddressPage;
