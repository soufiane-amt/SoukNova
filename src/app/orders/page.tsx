'use client'

import { useLoader } from '../../components/ui/loader/useLoader';
import OrderHistory from './components/OrderHistory';
import SettingsWrap from '../../components/layout/Settings/SettingsWrap';
import Loader from '../../components/ui/loader/Loader';

function OrderPage() {
  const loading = useLoader(1500);

  if (loading) return <Loader />;

  return (
    <SettingsWrap>
      <OrderHistory />
    </SettingsWrap>
  );
}

export default OrderPage;
