'use client';

import { ShoppingBag, CircleUserRound, Search } from 'lucide-react';
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
import { useCart } from '../../../context/CartContext';
import SearchContainer from './SearchContainer';

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
  toggleSearch: () => void;
  isSearchOpen: boolean;
}

export function DesktopNav({
  toggleDrawer,
  toggleSearch,
  isSearchOpen,
}: DesktopNavProps) {
  const [isOpen, setOpen] = useState(false);
  const pathname = usePathname();
  const { cart, products } = useCart();

  const toggleCartSideBar = () => {
    setOpen(!isOpen);
  };
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white  flex justify-between mx-4  px-6 md:px-12 lg:px-24 max-w-screen-2xl mx-auto py-3 md:py-0 ">
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
            sequence={['SoukNova.']}
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
                        fontSize: '16px',
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
        <div className="hidden md:flex group relative">
          <motion.button
            aria-label="Search"
            className="ml-4 transform transition-transform duration-200 hover:scale-110 cursor-pointer"
            variants={listContainerVariants}
            onClick={toggleSearch}
          >
            <Search className="w-6 h-6 text-gray-800" />
          </motion.button>
          {isSearchOpen && (
            <SearchContainer
              products={products}
              toggleSearch={toggleSearch}
              isDesktop={true}
            />
          )}
        </div>
        <div>
          <Link href="/account" className="flex justify-center">
            <motion.button
              aria-label="User profile"
              className="ml-4 transform transition-transform duration-200 hover:scale-110 cursor-pointer"
              variants={listContainerVariants}
            >
              <CircleUserRound className="md:w-6 md:h-6 w-5 h-5 text-gray-800" />
            </motion.button>
          </Link>
        </div>
        <div className="ml-4 flex justify-end">
          <motion.button
            aria-label="Shopping bag"
            className="transform transition-transform duration-200 hover:scale-110 cursor-pointer flex"
            variants={listContainerVariants}
            onClick={toggleCartSideBar}
          >
            <ShoppingBag className="md:w-6 md:h-6 w-5 h-5 text-gray-800 mr-1" />
            <span className="flex md:h-[21px] md:w-[21px] h-[18px] w-[18px] items-center justify-center rounded-[50%] bg-black font-inter md:text-xs text-[10px] font-bold text-white">
              {cart.length > 9 ? '9+' : cart.length}
            </span>
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
