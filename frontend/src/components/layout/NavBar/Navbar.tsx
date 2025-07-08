'use client';

import { useState } from 'react';
import { DrawerContent } from './DrawerContent';
import { DesktopNav } from './DesktopNav';

const navItems = ['Home', 'Shop', 'About', 'Contact'];

export default function NavBar() {
  const [isOpen, setOpen] = useState(false);

  const toggleDrawer = (state: boolean) => () => {
    setOpen(state);
  };

  return (
    <>
      <DesktopNav navItems={navItems} toggleDrawer={toggleDrawer} />
      <DrawerContent
        isOpen={isOpen}
        navItems={navItems}
        toggleDrawer={toggleDrawer}
      />
    </>
  );
}
