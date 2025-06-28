import { PromoCardLarge } from './PromoCardLarge';
import { PromoCardSmall } from './PromoCardSmall';

const promoImg1 = '/images/home/promoImg1.png';
const promoImg2 = '/images/home/promoImg2.png';
const promoImg3 = '/images/home/promoImg3.png';


export const PromoSection = () => (
  <div>
    <div className='md:flex md:items-center md:justify-between mb-8'>
      <div className='md:w-1/2'>
        <h1 className="font-semibold md:text-[72px] text-[40px] md:leading-[80px] leading-[45px]">
          Simply Unique<span className="text-red-400">/</span> Simply Better{' '}
          <span className="text-red-400">.</span>
        </h1>
      </div>
      <div className='md:w-1/3 mb-8 mt-4 md:mt-0 md:mb-0'>
        <p className='text-[#6C7275]'>
          <span className='text-black'>3legant</span> is a gift & decorations store based in HCMC, Vietnam. Est
          since 2019.
        </p>
      </div>
    </div>
    <div className="md:flex gap-4 min-h-[560px]">
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
  </div>
);

// <div>
//   <h1 className="text-[72px]">
//     Simply Unique<span className="text-red-400">/</span> Simply Better{' '}
//     <span className="text-red-400">.</span>
//   </h1>
// </div>
