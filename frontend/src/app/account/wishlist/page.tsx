'use client';

import Loader from '../../../components/feedback/loader/Loader';
import SettingsNavigator from '../../../components/ui/Settings/SettingsWrap';
import { useLoader } from '../../../hooks/useLoader';
import WishList from './components/WishList';

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
