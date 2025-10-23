'use client';

import Loader from '../../../components/feedback/loader/Loader';
import SettingsNavigator from '../../../components/ui/Settings/SettingsWrap';
import { useLoader } from '../../../hooks/useLoader';
import OrderHistory from './components/OrderHistory';

function OrderPage() {
  const loading = useLoader(1500);

  if (loading) return <Loader />;

  return (
    <SettingsNavigator>
      <OrderHistory />
    </SettingsNavigator>
  );
}

export default OrderPage;
