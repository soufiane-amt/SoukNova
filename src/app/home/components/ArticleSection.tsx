import { Typography } from '@mui/material';
import { ArticleCard } from './ArticleCard';
import CustomButton from '../../../components/ui/CustomButton';
import { ARTICLES } from '../../../constants/articalList';

export function ArticleSection() {
  return (
    <section className="flex flex-col justify-center px-4 md:px-12 lg:px-25 max-w-screen-2xl mx-auto my-12">
      <div className="flex justify-between w-full items-center mb-7">
        <Typography
          variant="h3"
          sx={{
            fontWeight: 'bold',
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
        {ARTICLES.map((item, index) => (
          <div key={item.id} data-aos="fade-up" data-aos-delay={index * 150}>
            <ArticleCard title={item.title} image={item.image} />
          </div>
        ))}
      </div>
    </section>
  );
}
