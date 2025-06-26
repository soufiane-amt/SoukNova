import { Typography } from '@mui/material';
import { ArticleCard } from './ArticleCard';
import CustomButton from '@/components/CustomButton';

export function ArticleSection() {
  const articals = [
    {
      title: '7 ways to decor your home',
      image: '/images/home/article/article1.png',
    },
    {
      title: 'Kitchen organization',
      image: '/images/home/article/article2.png',
    },
    {
      title: 'Decor your bedroom',
      image: '/images/home/article/article3.png',
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center gap-10">
      <div className="flex justify-between w-full max-w-6xl items-center">
        <Typography
          variant="h3"
          sx={{
            fontWeight: 'semibold',
            fontSize: {
              xs: '1.5rem',
              sm: '2rem',
              md: '2.5rem',
            },
          }}
        >
          Articles
        </Typography>
        <CustomButton label="More articles" />
      </div>

      <div className="flex flex-col md:flex-row gap-10 items-center justify-center">
        {articals.map((item, index) => (
          <ArticleCard key={index} title={item.title} image={item.image} />
        ))}
      </div>
    </div>
  );
}
