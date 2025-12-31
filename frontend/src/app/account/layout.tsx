import SettingsNavigator from '../../components/ui/Settings/SettingsWrap';
import AuthGuard from './AuthGuard';

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-screen">
      <AuthGuard>
        <SettingsNavigator>{children}</SettingsNavigator>
      </AuthGuard>
    </section>
  );
}
