import { SiteFooter } from '@/components/SiteFooter';
import { ArticleSection } from '@/home/components/ArticleSection';
import BenefitsDisplay from '@/home/components/BenefitsDisplay';
import CustomCarousel from '@/home/components/CustomCarousel';
import NewArrivalSection from '@/home/components/NewArrivalSection';
import { NewsLetterSub } from '@/home/components/NewsLetterSub';
import { PromoHighlightSection } from '@/home/components/PromoHighlightSection';
import { PromoSection } from '@/home/components/PromoSection';

function HomePage() {
  return (
    <div>
      <div className="px-6 md:px-12 lg:px-25 max-w-screen-2xl mx-auto">
        <CustomCarousel />
        <div className='my-12'>
          <PromoSection />
        </div>
        <div className="my-12">
          <NewArrivalSection />
        </div>
        <div className="my-12">
          <BenefitsDisplay />
        </div>
      </div>

      <div className="w-full mt-10">
        <PromoHighlightSection />
      </div>
      <div className="px-4 md:px-12 lg:px-25 max-w-screen-2xl mx-auto my-12">
        <ArticleSection />
      </div>
      <div className="w-full" data-aos="fade-up" data-aos-delay="200">
        <NewsLetterSub />
        <SiteFooter />
      </div>
    </div>
  );
}

export default HomePage;
