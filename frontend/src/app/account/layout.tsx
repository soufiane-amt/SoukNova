// app/account/layout.tsx
import SettingsNavigator from '../../components/ui/Settings/SettingsWrap';

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-screen">
      <SettingsNavigator>{children}</SettingsNavigator>
    </section>
  );
}
