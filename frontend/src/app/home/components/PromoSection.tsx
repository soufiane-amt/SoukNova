'use client';
import { useEffect } from 'react';
import { PromoCardLarge } from './PromoCardLarge';
import { PromoCardSmall } from './PromoCardSmall';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { PROMO_IMAGES } from '../../../constants/promoImages';

export const PromoSection = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="md:w-1/2" data-aos="fade-right">
          <h1 className="font-semibold md:text-[72px] text-[40px] md:leading-[80px] leading-[45px]">
            Simply Unique<span className="text-red-400">/</span> Simply Better{' '}
            <span className="text-red-400">.</span>
          </h1>
        </div>
        <div
          className="md:w-1/3 mb-8 mt-4 md:mt-0 md:mb-0 "
          data-aos="fade-left"
          data-aos-delay="200"
        >
          <p className="text-color-primary">
            <span className="text-black">3legant</span> is a gift & decorations
            store based in HCMC, Vietnam. Est since 2019.
          </p>
        </div>
      </div>
      <div className="md:flex gap-4 min-h-[560px]">
        <div className="flex-1 mb-5 md:mb-0" data-aos="fade-up">
          <PromoCardLarge title="Living room" image={PROMO_IMAGES.livingRoom} />
        </div>
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex-1" data-aos="fade-up" data-aos-delay="100">
            <PromoCardSmall title="Kitchen" image={PROMO_IMAGES.kitchen} />
          </div>
          <div className="flex-1" data-aos="fade-up" data-aos-delay="200">
            <PromoCardSmall title="Bedroom" image={PROMO_IMAGES.bedroom} />
          </div>
        </div>
      </div>
    </div>
  );
};
