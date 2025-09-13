'use client';

import Loader from "../../components/feedback/loader/Loader";
import SettingsNavigator from "../../components/ui/Settings/SettingsWrap";
import { useLoader } from "../../hooks/useLoader";
import AddressSection from "./components/AddressSection";

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
