'use client';

import SettingsNavigator from '../../components/layout/Settings/SettingsWrap';
import WishList from './components/WishList';
import { useLoader } from '../../components/ui/loader/useLoader';
import Loader from '../../components/ui/loader/Loader';

function WishPage() {
  const loading = useLoader(1500);

  if (loading) return <Loader />;

  return (
    <SettingsNavigator>
      <WishList />
    </SettingsNavigator>
  );
}

export default WishPage;
