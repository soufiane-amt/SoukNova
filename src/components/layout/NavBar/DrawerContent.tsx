import {
  TextField,
  Drawer,
  InputAdornment,
  List,
  ListItemText,
  ListItemButton,
} from '@mui/material';
import FavoriteBorderSharpIcon from '@mui/icons-material/FavoriteBorderSharp';
import { SearchIcon, ShoppingBag, X } from 'lucide-react';
import { SocialIcons } from './SocialIcons';
import { NAV_ITEMS } from '../../../constants/navItems';

interface DrawerItemProps {
  label: string;
  icon: React.ReactNode;
}

function DrawerItem({ label, icon }: DrawerItemProps) {
  return (
    <ListItemButton
      className="border-b border-gray-200 transition-all duration-300 hover:bg-gray-100"
      sx={{ px: 0 }}
    >
      <ListItemText
        primaryTypographyProps={{
          fontSize: '0.9rem',
          fontWeight: 600,
          color: 'var(--color-primary)',
        }}
        primary={label}
      />
      <button className="transform transition-transform duration-200 hover:scale-110">
        {icon}
      </button>
    </ListItemButton>
  );
}

interface DrawerContentProps {
  toggleDrawer: (state: boolean) => () => void;
  isOpen: boolean;
}

export function DrawerContent({
  toggleDrawer,
  isOpen,
}: DrawerContentProps) {
  return (
    <Drawer anchor="left" open={isOpen} onClose={toggleDrawer(false)}>
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
          className="flex-grow flex flex-col justify-between"
        >
          <List disablePadding>
            {NAV_ITEMS.map((text, index) => (
              <ListItemButton
                className="border-b border-gray-200 transition-all duration-300 hover:bg-gray-100"
                sx={{ px: 0 }}
                key={text}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <ListItemText
                  primaryTypographyProps={{
                    fontSize: '0.9rem',
                    fontWeight: 600,
                  }}
                  primary={text}
                />
              </ListItemButton>
            ))}
          </List>
          <div className="mt-auto pb-4">
            <List disablePadding>
              <DrawerItem
                label="Cart"
                icon={<ShoppingBag className="w-6 h-6 text-gray-800" />}
              />
              <DrawerItem
                label="Wishlist"
                icon={
                  <FavoriteBorderSharpIcon className="w-6 h-6 text-gray-800" />
                }
              />
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
  );
}
