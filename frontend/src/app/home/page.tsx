import { SiteFooter } from '../../components/layout/SiteFooter';
import { ArticleSection } from './components/ArticleSection';
import BenefitsDisplay from './components/BenefitsDisplay';
import CustomCarousel from './components/CustomCarousel';
import NewArrivalSection from './components/NewArrivalSection';
import { NewsLetterSub } from './components/NewsLetterSub';
import { PromoHighlightSection } from './components/PromoHighlightSection';
import { PromoSection } from './components/PromoSection';

function HomePage() {
  return (
    <div>
      <div className="px-6 md:px-12 lg:px-25 max-w-screen-2xl mx-auto">
        <CustomCarousel />
        <div className="my-12">
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
