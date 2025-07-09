import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import { Facebook, Instagram, Youtube } from 'lucide-react';
import { NAV_ITEMS } from '../../constants/navItems';

const socialLinks = [
  { icon: <Instagram />, url: 'https://instagram.com/', label: 'Instagram' },
  { icon: <Facebook />, url: 'https://facebook.com/', label: 'Facebook' },
  { icon: <Youtube />, url: 'https://youtube.com/', label: 'YouTube' },
];

function SocialIcons() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      {socialLinks.map(({ icon, url, label }) => (
        <IconButton
          key={label}
          component="a"
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          sx={{ color: 'inherit' }}
        >
          {icon}
        </IconButton>
      ))}
    </Box>
  );
}

export function SiteFooter() {
  return (
    <footer
      className="bg-[#232627] text-white p-15 w-full"
      data-aos="fade-up"
      data-aos-delay="200"
    >
      <div className="flex flex-col md:flex-row items-center justify-center md:justify-between">
        <div className="flex  flex-col md:flex-row items-center justify-center">
          <div className=" flex flex-col items-center md:flex-row">
            <h1 className="text-xl font-medium text-[24px] leading-[24px] font-poppins">
              3legant.
            </h1>
            <div className=" h-4 md:h-7 w-7 md:pr-10 md:border-r md:border-b-0 border-b border-[#E8ECEF]"></div>
          </div>
          <div className="text-[#E8ECEF] text-[14px] py-5 md:pl-10">
            <a href="#">Gift & Decoration Store</a>
          </div>
        </div>
        <nav className="md:inline text-[#E8ECEF] ">
          <List
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
            }}
          >
            {NAV_ITEMS.map((item) => (
              <ListItem
                key={item}
                disablePadding
                sx={{
                  width: 'auto',
                  justifyContent: 'center',
                  paddingInline: { sm: 2 },
                }}
              >
                <Link
                  href={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                  passHref
                >
                  <ListItemText
                    primary={item}
                    primaryTypographyProps={{
                      fontSize: '14px',
                      textAlign: 'center',
                      paddingBlock: '7px',
                      component: 'span',
                      color: 'inherit',
                    }}
                    sx={{
                      cursor: 'pointer',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  />
                </Link>
              </ListItem>
            ))}
          </List>
        </nav>
      </div>

      <div className="pt-5 md:pt-0 md:flex md:flex-row-reverse md:justify-between md:items-center w-full border-t-[0.5px] border-t-border-dark-gray">
        <SocialIcons />
        <div className="md:flex md:flex-row-reverse md:items-center md:grid-cols-4 md:gap-5">
          <Stack
            direction="row"
            spacing={5}
            justifyContent="center"
            fontSize={12}
            paddingBlock={3}
          >
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Use</Link>
          </Stack>
          <Typography
            variant="body2"
            sx={{ fontSize: '12px', color: '#E8ECEF', textAlign: 'center' }}
          >
            Copyright © {new Date().getFullYear()} Your Name. All rights
            reserved.
          </Typography>
        </div>
      </div>
    </footer>
  );
}
