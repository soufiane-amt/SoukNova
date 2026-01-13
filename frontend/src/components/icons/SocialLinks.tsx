import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import XIcon from '@mui/icons-material/X';
import Link from 'next/link';

export function SocialLinks() {
  const socialLinks = [
    { href: 'https://facebook.com/', icon: FacebookIcon, label: 'Facebook' },
    { href: 'https://instagram.com/', icon: InstagramIcon, label: 'Instagram' },
    { href: 'https://youtube.com/', icon: YouTubeIcon, label: 'YouTube' },
    { href: 'https://x.com/', icon: XIcon, label: 'X' },
  ];

  return (
    <div className="flex items-center gap-3">
      {socialLinks.map(({ href, icon: Icon, label }) => (
        <Link
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="w-9 h-9 rounded-full bg-[#343839] flex items-center justify-center hover:bg-orange-500 transition-colors duration-200"
        >
          <Icon sx={{ fontSize: 18, color: 'white' }} />
        </Link>
      ))}
    </div>
  );
}
