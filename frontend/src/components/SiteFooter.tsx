import {
  Box,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { Facebook, Instagram, Youtube } from 'lucide-react';
// import InstagramIcon from '@mui/icons-material/Instagram';
// import FacebookIcon from '@mui/icons-material/Facebook';
// import YouTubeIcon from '@mui/icons-material/YouTube';

const socialLinks = [
  { icon: <Instagram />, url: 'https://instagram.com/', label: 'Instagram' },
  { icon: <Facebook />, url: 'https://facebook.com/', label: 'Facebook' },
  { icon: <Youtube />, url: 'https://youtube.com/', label: 'YouTube' },
];

const navItems = ['Home', 'Shop', 'Product', 'blog', 'Contact Us'];

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
    <footer className="bg-[#232627] text-white py-13 px-10">
      <div className="flex flex-col items-center justify-center ">
        <div>
          <h1 className="text-xl font-bold ">3legant.</h1>
        </div>
        <div className="text-[#E8ECEF] text-[14px] py-5">
          <a href="#">Gift & Decoration Store</a>
        </div>
        <div className="md:inline text-[#E8ECEF] ">
          <List
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {navItems.map((item) => (
              <ListItem key={item}>
                <ListItemText
                  primary={item}
                  primaryTypographyProps={{
                    fontSize: '14px',
                    textAlign: 'center',
                    paddingBlock: '7px',
                  }}
                />
              </ListItem>
            ))}
          </List>
        </div>
      </div>

      <div
        className='pt-5'
        style={{
          borderTop: '0.5px solid #ddd',
          width: '100%',
          margin: '10px 0',
        }}
      >
        <SocialIcons />
        <Stack
          direction="row"
          spacing={5}
          justifyContent="center"
          mb={1}
          fontSize={12}
          paddingBlock={3}
        >
          <Link href="/privacy" underline="hover" color="inherit">
            Privacy Policy
          </Link>
          <Link href="/terms" underline="hover" color="inherit">
            Terms of Use
          </Link>
        </Stack>
        <Typography
          variant="body2"
          sx={{ fontSize: '12px', color: '#E8ECEF', textAlign: 'center' }}
        >
          Copyright © {new Date().getFullYear()} Your Name. All rights reserved.
        </Typography>
      </div>
    </footer>
  );
}
