'use client';

import { useState } from 'react';
import { DrawerContent } from './DrawerContent';
import { DesktopNav } from './DesktopNav';

export default function NavBar() {
  const [isOpen, setOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);

  const toggleSearch = () => {
    setSearchOpen(!isSearchOpen);
  };

  const toggleDrawer = (state: boolean) => () => {
    setOpen(state);
  };

  return (
    <>
      <DesktopNav
        toggleDrawer={toggleDrawer}
        toggleSearch={toggleSearch}
        isSearchOpen={isSearchOpen}
      />
      <DrawerContent
        isOpen={isOpen}
        toggleDrawer={toggleDrawer}
        toggleSearch={toggleSearch}
      />
    </>
  );
}
