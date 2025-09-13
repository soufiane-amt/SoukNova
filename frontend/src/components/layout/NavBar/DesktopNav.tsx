'use client';

import { ShoppingBag, CircleUserRound, Search} from 'lucide-react';

import { Menu } from 'lucide-react';
import { List, ListItem, ListItemText } from '@mui/material';
import { useState } from 'react';
import { NAV_ITEMS } from '../../../constants/navItems';
import { poppins } from '@/layout';
import { TypeAnimation } from 'react-type-animation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SideCart from './SideCart';

export const listItemVariants = {
  hidden: { opacity: 0, x: -100 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

export const listContainerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

interface DesktopNavProps {
  toggleDrawer: (state: boolean) => () => void;
}

export function DesktopNav({ toggleDrawer }: DesktopNavProps) {
  const [isOpen, setOpen] = useState(false);
  const pathname = usePathname();

  const toggleCartSideBar = () => {
    setOpen(!isOpen);
  };

  return (
    <nav className="flex justify-between mx-4 mt-2 px-6 md:px-12 lg:px-24 max-w-screen-2xl mx-auto">
      <div className="flex items-center">
        <div className="md:hidden mr-2">
          <button
            aria-label="Open navigation drawer"
            className="h-full flex items-center"
            onClick={toggleDrawer(true)}
          >
            <Menu className="w-6 h-6 transform transition-transform duration-300" />
          </button>
        </div>
        <div>
          <TypeAnimation
            sequence={['3legant.']}
            speed={50}
            className={`font-medium text-xl ${poppins.className}`}
            wrapper="h1"
          />
        </div>
      </div>
      <div className="hidden md:inline">
        <List sx={{ display: 'flex' }}>
          {NAV_ITEMS.map((item) => {
            const path = `/${item.toLowerCase()}`;
            return (
              <Link href={path} key={item}>
                <ListItem className="group relative cursor-pointer overflow-hidden">
                  <ListItemText
                    primary={item}
                    primaryTypographyProps={{
                      sx: {
                        color:
                          pathname === path ? 'black' : 'var(--color-primary)',
                        fontSize: '14px',
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 500,
                      },
                    }}
                  />
                </ListItem>
              </Link>
            );
          })}
        </List>
      </div>
      <motion.div
        className="flex items-center"
        variants={listItemVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="hidden md:flex">
          <motion.button
            aria-label="Search"
            className="ml-4 transform transition-transform duration-200 hover:scale-110"
            variants={listContainerVariants}
          >
            <Search className="w-6 h-6 text-gray-800" />
          </motion.button>
          <Link href="/account" className="flex justify-center">
            <motion.button
              aria-label="User profile"
              className="ml-4 transform transition-transform duration-200 hover:scale-110"
              variants={listContainerVariants}
            >
              <CircleUserRound className="w-6 h-6 text-gray-800" />
            </motion.button>
          </Link>
        </div>
        <div className="ml-4 flex justify-end">
          <motion.button
            aria-label="Shopping bag"
            className="transform transition-transform duration-200 hover:scale-110"
            variants={listContainerVariants}
            onClick={toggleCartSideBar}
          >
            <ShoppingBag className="w-6 h-6 text-gray-800" />
          </motion.button>
        </div>
      </motion.div>
      <SideCart isOpen={isOpen} />
      {isOpen && (
        <div
          className="fixed inset-0 bg-[#00000052] z-10"
          onClick={toggleCartSideBar}
        ></div>
      )}
    </nav>
  );
}
