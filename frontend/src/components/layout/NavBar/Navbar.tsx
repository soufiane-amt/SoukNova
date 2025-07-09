'use client';

import { useState } from 'react';
import { DrawerContent } from './DrawerContent';
import { DesktopNav } from './DesktopNav';


export default function NavBar() {
  const [isOpen, setOpen] = useState(false);

  const toggleDrawer = (state: boolean) => () => {
    setOpen(state);
  };

  return (
    <>
      <DesktopNav  toggleDrawer={toggleDrawer} />
      <DrawerContent
        isOpen={isOpen}
        toggleDrawer={toggleDrawer}
      />
    </>
  );
}
