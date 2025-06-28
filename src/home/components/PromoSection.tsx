import { PromoCardLarge } from './PromoCardLarge';
import { PromoCardSmall } from './PromoCardSmall';

const promoImg1 = '/images/home/promoImg1.png';
const promoImg2 = '/images/home/promoImg2.png';
const promoImg3 = '/images/home/promoImg3.png';

export const PromoSection = () => (
  <div className="md:flex gap-4 h-[560px]">
    <div className="flex-1 mb-5 md:mb-0">
      <PromoCardLarge title="Living room" image={promoImg3} />
    </div>
    <div className="flex-1 flex flex-col gap-4">
      <div className="flex-1">
        <PromoCardSmall title="Kitchen" image={promoImg2} />
      </div>
      <div className="flex-1">
        <PromoCardSmall title="Bedroom" image={promoImg1} />
      </div>
    </div>
  </div>
);

