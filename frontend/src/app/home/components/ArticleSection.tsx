import { Typography } from '@mui/material';
import { ArticleCard } from './ArticleCard';
import CustomButton from '@/components/ui/CustomButton';

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
    <div className="flex flex-col justify-center">
      <div className="flex justify-between w-full items-center mb-7">
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

      <div className="flex flex-col md:flex-row items-center justify-between gap-x-5">
        {articals.map((item, index) => (
          <div key={index} data-aos="fade-up" data-aos-delay={index * 150}>
            <ArticleCard title={item.title} image={item.image} />
          </div>
        ))}
      </div>
    </div>
  );
}
