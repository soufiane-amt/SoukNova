'use client';
import { ShoppingBag, CircleUserRound, Search } from 'lucide-react';

import { Menu } from 'lucide-react';
import { List, ListItem, ListItemText } from '@mui/material';
import { useState } from 'react';

interface DesktopNavProps {
  navItems: string[];
  toggleDrawer: (state: boolean) => () => void;
}

export function DesktopNav({ navItems, toggleDrawer }: DesktopNavProps) {
  const [selected, setSelected] = useState<number>(0);

  const handleClick = (index: number) => {
    setSelected(index);
  };

  return (
    <nav className="flex justify-between mx-4 mt-2 px-6 md:px-12 lg:px-24 max-w-screen-2xl mx-auto">
      <div className="flex items-center">
        <div className="md:hidden mr-2">
          <button
            className="h-full flex items-center"
            onClick={toggleDrawer(true)}
          >
            <Menu className="w-6 h-6 transform transition-transform duration-300" />
          </button>
        </div>
        <div>
          <h1 className="text-2xl font-bold">3legant.</h1>
        </div>
      </div>
      <div className="hidden md:inline">
        <List sx={{ display: 'flex' }}>
          {navItems.map((item, index) => (
            <ListItem
              key={index}
              className="group relative cursor-pointer overflow-hidden"
              onClick={() => handleClick(index)}
            >
              <ListItemText
                primary={item}
                className="relative z-10"
                primaryTypographyProps={{
                  sx: {
                    color: index === selected ? '#6C7275' : 'black',
                    fontSize: '18px',
                  },
                }}
              />
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-800 transition-all duration-300 group-hover:w-full"></span>
            </ListItem>
          ))}
        </List>
      </div>
      <div className="flex items-center">
        <div className="ml-4 md:inline hidden">
          <button className="transform transition-transform duration-200 hover:scale-110">
            <Search className="w-6 h-6 text-gray-800" />
          </button>
        </div>
        <div className="ml-4 md:inline hidden">
          <button className="transform transition-transform duration-200 hover:scale-110">
            <CircleUserRound className="w-6 h-6 text-gray-800" />
          </button>
        </div>
        <div className="ml-4 ">
          <button className="transform transition-transform duration-200 hover:scale-110">
            <ShoppingBag className="w-6 h-6 text-gray-800" />
          </button>
        </div>
      </div>
    </nav>
  );
}
