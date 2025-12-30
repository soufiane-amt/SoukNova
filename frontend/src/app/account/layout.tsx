import SettingsNavigator from '../../components/ui/Settings/SettingsWrap';
import { useAuthGuard } from '../../hooks/useAuthGuard';

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useAuthGuard();
  return (
    <section className="min-h-screen">
      <SettingsNavigator>{children}</SettingsNavigator>
    </section>
  );
}
