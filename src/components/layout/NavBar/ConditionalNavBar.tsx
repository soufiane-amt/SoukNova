'use client';

import { usePathname } from 'next/navigation';
import NavBar from './Navbar';

export default function ConditionalNavBar() {
  const pathname = usePathname();

  if (pathname.includes('/auth')) return null;

  return <NavBar />;
}
