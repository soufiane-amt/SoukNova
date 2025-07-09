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
    <main>
      <div className="px-6 md:px-12 lg:px-25 max-w-screen-2xl mx-auto">
        <CustomCarousel />
        <PromoSection />
        <NewArrivalSection />
        <BenefitsDisplay />
      </div>
      <PromoHighlightSection />
      <ArticleSection />
      <NewsLetterSub />
      <SiteFooter />
    </main>
  );
}

export default HomePage;
