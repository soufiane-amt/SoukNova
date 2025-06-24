import { PromoCardLarge } from './PromoCardLarge';
import { PromoCardSmall } from './PromoCardSmall';

const promoImg1 = '/images/home/promoImg1.png';
const promoImg2 = '/images/home/promoImg2.png';
const promoImg3 = '/images/home/promoImg3.png';

export const PromoSection = () => (
  <div className="md:flex justify-center items-center ">
    <div>
      <PromoCardLarge title="Living room" image={promoImg3} />
    </div>
    <div className="flex flex-col justify-between">
      <PromoCardSmall title="Kitchen" image={promoImg2} />
      <PromoCardSmall title="Bedroom" image={promoImg1} />
    </div>
  </div>
);
