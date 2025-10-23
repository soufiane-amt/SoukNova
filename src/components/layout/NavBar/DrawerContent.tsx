import {
  TextField,
  Drawer,
  InputAdornment,
  List,
  ListItemText,
  ListItemButton,
  ListItem,
} from '@mui/material';
import FavoriteBorderSharpIcon from '@mui/icons-material/FavoriteBorderSharp';
import { SearchIcon, ShoppingBag, X } from 'lucide-react';
import { SocialIcons } from '../../icons/SocialIcons';
import { NAV_ITEMS } from '../../../constants/navItems';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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

export function DrawerContent({ toggleDrawer, isOpen }: DrawerContentProps) {
  const pathname = usePathname();

  return (
    <Drawer anchor="left" open={isOpen} onClose={toggleDrawer(false)}>
      <div className="mx-3 my-2 flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-md font-bold">SoukNova.</h1>
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
          <List>
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
                            pathname === path
                              ? 'black'
                              : 'var(--color-primary)',
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
          <div className="mt-auto pb-4">
            <List disablePadding>
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
