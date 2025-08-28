import { ArticleCard } from './ArticleCard';
import CustomButton from '../../../components/ui/CustomButton';
import { ARTICLES } from '../../../constants/articalList';
import { poppins } from '@/layout';

export function ArticleSection() {
  return (
    <section className="flex flex-col justify-center px-4 md:px-12 lg:px-25 max-w-screen-2xl mx-auto my-12">
      <div className="flex justify-between w-full items-center mb-7">
        <p className={`text-3xl font-medium ${poppins.className}`}>Articles</p>
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
