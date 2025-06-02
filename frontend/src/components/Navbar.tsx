'use client';
import { ShoppingBag, CircleUserRound, Search } from 'lucide-react';

import { Menu, X } from 'lucide-react'; // Menu = hamburger icon, X = close icon
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
      <nav className="flex justify-between mx-4 mt-2">
        <div className="flex items-center">
          <div className="md:hidden mr-2">
            <button
              className="h-full flex items-center"
              onClick={() => {
                setOpen(!isOpen);
              }}
            >
              {isOpen ? <X /> : <Menu className="w-4" />}
            </button>
          </div>
          <div>
            <h1 className="text-xl font-bold ">3legant.</h1>
          </div>
        </div>
        <div className="hidden md:inline">
          <List sx={{ display: 'flex' }}>
            {navItems.map((item) => (
              <ListItem key={item} disablePadding>
                <ListItem>
                  <ListItemText primary={item} />
                </ListItem>
              </ListItem>
            ))}
          </List>
        </div>
        <div className="flex items-center">
          <div className='ml-4 md:inline hidden'>
            <button>
              <Search className="w-6 h-6 text-gray-800" />
            </button>
          </div>
          <div className='ml-4 md:inline hidden'>
            <button>
              <CircleUserRound className="w-6 h-6 text-gray-800" />
            </button>
          </div>
          <div className='ml-4 '>
            <button>
              <ShoppingBag className="w-6 h-6 text-gray-800" />
            </button>
          </div>
        </div>
      </nav>
      <Drawer anchor="left" open={isOpen} onClose={toggleDrawer(false)}>
        <div className="mx-3 my-2">
          <div className="flex justify-between">
            <h1 className="text-md font-bold">3legant.</h1>
            <button onClick={toggleDrawer(false)}>
              <X />
            </button>
          </div>
          <div className="mt-5 mb-2">
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
          >
            <List disablePadding>
              {['Home', 'Shop', 'About', 'Contact'].map((text) => (
                <ListItem
                  className="border-b-1 border-gray-200"
                  sx={{ px: 0 }}
                  button
                  key={text}
                >
                  <ListItemText
                    primaryTypographyProps={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}
                    primary={text}
                  />
                </ListItem>
              ))}
            </List>
          </div>
          <div className="flex flex-col mt-50 ">
            <div>
              <List disablePadding>
                <ListItem
                  className="border-b border-gray-200"
                  sx={{ px: 0 }}
                  button
                  key={'bag'}
                >
                  <ListItemText
                    primaryTypographyProps={{
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: '#6C7275',
                    }}
                    primary={'Cart'}
                  />
                  <button>
                    <ShoppingBag className="w-6 h-6 text-gray-800" />
                  </button>
                </ListItem>
                <ListItem
                  className="border-b border-gray-200"
                  sx={{ px: 0 }}
                  button
                  key={'shop'}
                >
                  <ListItemText
                    primaryTypographyProps={{
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: '#6C7275',
                    }}
                    primary={'Wishlist'}
                  />
                  <button>
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
            </div>
            <div>
              <SocialIcons />
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
}
