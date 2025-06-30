'use client';
import { ShoppingBag, CircleUserRound, Search } from 'lucide-react';

import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import {
  TextField,
  Drawer,
  List,
  ListItem,
  ListItemText,
  InputAdornment,
} from '@mui/material';
import FavoriteBorderSharpIcon from '@mui/icons-material/FavoriteBorderSharp';

import SearchIcon from '@mui/icons-material/Search';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';

const navItems = ['Home', 'Shop', 'About', 'Contact'];

function SocialIcons() {
  return (
    <div className="flex space-x-6 justify-center">
      <FacebookIcon />
      <YouTubeIcon />
      <InstagramIcon />
    </div>
  );
}

export default function NavBar() {
  const [isOpen, setOpen] = useState(false);

  const toggleDrawer = (state: boolean) => () => {
    setOpen(state);
  };

  return (
    <>
      <nav className="flex justify-between mx-4 mt-2 px-6 md:px-12 lg:px-24 max-w-screen-2xl mx-auto">
        <div className="flex items-center">
          <div className="md:hidden mr-2">
            <button
              className="h-full flex items-center"
              onClick={() => {
                setOpen(!isOpen);
              }}
            >
              {isOpen ? <X className="w-6 h-6 transform transition-transform duration-300 rotate-90" /> : <Menu className="w-6 h-6 transform transition-transform duration-300" />}
            </button>
          </div>
          <div>
            <h1 className="text-xl font-bold ">3legant.</h1>
          </div>
        </div>
        <div className="hidden md:inline">
          <List sx={{ display: 'flex' }}>
            {navItems.map((item) => (
              <ListItem key={item} className="group relative cursor-pointer overflow-hidden">
                <ListItemText primary={item} className="relative z-10" />
                {/* Animated underline */}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-800 transition-all duration-300 group-hover:w-full"></span>
              </ListItem>
            ))}
          </List>
        </div>
        <div className="flex items-center">
          <div className='ml-4 md:inline hidden'>
            <button className="transform transition-transform duration-200 hover:scale-110">
              <Search className="w-6 h-6 text-gray-800" />
            </button>
          </div>
          <div className='ml-4 md:inline hidden'>
            <button className="transform transition-transform duration-200 hover:scale-110">
              <CircleUserRound className="w-6 h-6 text-gray-800" />
            </button>
          </div>
          <div className='ml-4 '>
            <button className="transform transition-transform duration-200 hover:scale-110">
              <ShoppingBag className="w-6 h-6 text-gray-800" />
            </button>
          </div>
        </div>
      </nav>
      <Drawer anchor="left" open={isOpen} onClose={toggleDrawer(false)}
        // MUI Drawer naturally handles slide animation based on 'open' state
        // You can customize it further with TransitionComponent prop if needed
      >
        <div className="mx-3 my-2 flex flex-col h-full">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-md font-bold">3legant.</h1>
            <button onClick={toggleDrawer(false)}>
              <X className="w-6 h-6 transform transition-transform duration-300 rotate-0 hover:rotate-90" />
            </button>
          </div>
          <div className="mb-4">
            <TextField
              className="w-full"
              label="Search"
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <div
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
            style={{ width: 320 }}
            className="flex-grow flex flex-col justify-between" // This helps push social icons to bottom
          >
            <List disablePadding>
              {['Home', 'Shop', 'About', 'Contact'].map((text, index) => (
                <ListItem
                  className="border-b border-gray-200 transition-all duration-300 hover:bg-gray-100"
                  sx={{ px: 0 }}
                  button
                  key={text}
                  // Optional: Add a slight delay for each item for a "staggered" effect
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <ListItemText
                    primaryTypographyProps={{
                      fontSize: '0.9rem', // Increased font size for better readability in drawer
                      fontWeight: 600,
                    }}
                    primary={text}
                  />
                </ListItem>
              ))}
            </List>
            <div className="mt-auto pb-4"> {/* Use mt-auto to push to the bottom */}
              <List disablePadding>
                <ListItem
                  className="border-b border-gray-200 transition-all duration-300 hover:bg-gray-100"
                  sx={{ px: 0 }}
                  button
                  key={'cart'}
                >
                  <ListItemText
                    primaryTypographyProps={{
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      color: '#6C7275',
                    }}
                    primary={'Cart'}
                  />
                  <button className="transform transition-transform duration-200 hover:scale-110">
                    <ShoppingBag className="w-6 h-6 text-gray-800" />
                  </button>
                </ListItem>
                <ListItem
                  className="border-b border-gray-200 transition-all duration-300 hover:bg-gray-100"
                  sx={{ px: 0 }}
                  button
                  key={'wishlist'}
                >
                  <ListItemText
                    primaryTypographyProps={{
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      color: '#6C7275',
                    }}
                    primary={'Wishlist'}
                  />
                  <button className="transform transition-transform duration-200 hover:scale-110">
                    <FavoriteBorderSharpIcon className="w-6 h-6 text-gray-800" />
                  </button>
                </ListItem>
              </List>
              <div className="flex justify-center my-4">
                <button
                  className="w-[90%] py-2 bg-[#141718] text-white rounded-md hover:bg-[#47555a] cursor-pointer transition-colors duration-300"
                  type="submit"
                >
                  Sign In
                </button>
              </div>
              <div>
                <SocialIcons />
              </div>
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
}