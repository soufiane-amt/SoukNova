'use client';

import Loader from '../../../components/feedback/loader/Loader';
import { useLoader } from '../../../hooks/useLoader';
import WishList from './components/WishList';

function WishPage() {
  const loading = useLoader(1500);

  if (loading) return <Loader />;

  return <WishList />;
}

export default WishPage;
