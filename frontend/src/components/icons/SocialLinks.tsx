import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import Link from 'next/link';

export function SocialLinks() {
  return (
    <div className="flex space-x-6 justify-center">
      <Link href="http://facebook.com/">
        <FacebookIcon />
      </Link>
      <Link href="http://youtube.com/">
        <YouTubeIcon />
      </Link>
      <Link href="http://instagram.com/">
        <InstagramIcon />
      </Link>
    </div>
  );
}
