'use client';
import { ShoppingBag, CircleUserRound, Search } from 'lucide-react';

import { Menu } from 'lucide-react';
import { List, ListItem, ListItemText } from '@mui/material';
import { useState } from 'react';
import { NAV_ITEMS } from '../../../constants/navItems';
import { poppins } from '@/layout';
import { TypeAnimation } from 'react-type-animation';
import { motion } from 'framer-motion';

export const listItemVariants = {
  hidden: { opacity: 0, x: -100 }, // Start off-screen to the left and invisible
  visible: {
    opacity: 1,
    x: 0, // Animate to their final position (x=0)
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

// Define the animation variants for the parent container
export const listContainerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // This creates the staggered effect
    },
  },
};

interface DesktopNavProps {
  toggleDrawer: (state: boolean) => () => void;
}

export function DesktopNav({ toggleDrawer }: DesktopNavProps) {
  const [selected, setSelected] = useState<number>(0);

  const handleClick = (index: number) => {
    setSelected(index);
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
            className="font-bold text-xl"
            wrapper="h1"
          />
        </div>
      </div>
      <div className="hidden md:inline">
        <List
          sx={{ display: 'flex' }}
          component={motion.ul} // Use motion.ul to apply framer-motion properties
          variants={listContainerVariants}
          initial="hidden"
          animate="visible"
        >
          {NAV_ITEMS.map((item, index) => (
            <ListItem
              component={motion.li} // Use motion.li for the list items
              key={item}
              className={`group relative cursor-pointer overflow-hidden ${poppins.className}`}
              onClick={() => handleClick(index)}
              variants={listItemVariants} // Apply the animation to each item
            >
              <ListItemText
                primary={item}
                className={`relative z-10 ${poppins.className}`}
                primaryTypographyProps={{
                  sx: {
                    color:
                      index === selected ? 'black' : 'var(--color-primary)',
                    fontSize: '14px',
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 500,
                  },
                }}
              />
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-800 transition-all duration-300 group-hover:w-full"></span>
            </ListItem>
          ))}
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
            variants={listContainerVariants} // Apply the item animation
          >
            <Search className="w-6 h-6 text-gray-800" />
          </motion.button>
          <motion.button
            aria-label="User profile"
            className="ml-4 transform transition-transform duration-200 hover:scale-110"
            variants={listContainerVariants} // Apply the item animation
          >
            <CircleUserRound className="w-6 h-6 text-gray-800" />
          </motion.button>
        </div>
        <div className="ml-4 flex justify-end">
          <motion.button
            aria-label="Shopping bag"
            className="transform transition-transform duration-200 hover:scale-110"
            variants={listContainerVariants} // Apply the item animation
          >
            <ShoppingBag className="w-6 h-6 text-gray-800" />
          </motion.button>
        </div>
      </motion.div>
    </nav>
  );
}
