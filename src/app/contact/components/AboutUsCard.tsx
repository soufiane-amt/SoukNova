import Image from 'next/image';
import CustomButton from '../../../components/ui/CustomButton';
import { poppins } from '@/layout';

const promoHighlightImage = '/images/home/fourniture.png';

function AboutUsCard() {
  return (
    <div
      className="bg-[var(--color-neutral-bg)] md:flex md:h-[413px]"
      data-aos="fade-up"
    >
      <div className="md:w-1/2 h-full" data-aos="fade-right">
        <Image
          src={promoHighlightImage}
          alt="Highlight promotion"
          width={600}
          height={400}
          className="w-full h-[367px] md:h-full"
        />
      </div>
      <div className="mt-10 p-5 md:w-1/2 md:p-15" data-aos="fade-left">
        <p
          className={`${poppins.className} font-medium text-lg md:text-4xl mb-3`}
        >
          About Us
        </p>
        <p className="mb-3 text-[14px]">
          3legant is a gift & decorations store based in HCMC, Vietnam. Est
          since 2019. Our customer service is always prepared to support you
          24/7
        </p>
        <CustomButton label="Shop now" href="/shop" />
      </div>
    </div>
  );
}

export default AboutUsCard;
