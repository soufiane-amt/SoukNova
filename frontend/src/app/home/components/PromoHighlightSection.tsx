import { poppins, inter } from '@/layout';
import CustomButton from '../../../components/buttons/CustomButton';
import Image from 'next/image';
import { PROMO_HIGHLIGHT_IMAGE } from '../../../constants/assets';

export function PromoHighlightSection() {
  return (
    <section className="w-full md:flex md:min-h-[560px] mt-16 overflow-hidden">
      {/* Image Side */}
      <div
        className="flex-1 relative min-h-[400px] md:min-h-[560px]"
        data-aos="fade-right"
        data-aos-duration="800"
      >
        <Image
          src={PROMO_HIGHLIGHT_IMAGE}
          alt="Highlight promotion"
          fill
          className="object-cover"
          priority
        />
        {/* Decorative element */}
        <div className="absolute top-8 left-8 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2">
          <span className="text-orange-500 font-semibold text-sm">🔥 Hot Deal</span>
        </div>
      </div>

      {/* Content Side */}
      <div
        className="flex items-center justify-center bg-[#F3F5F7] flex-1"
        data-aos="fade-left"
        data-aos-duration="800"
      >
        <div className="px-8 md:px-16 py-16 max-w-xl">
          {/* Badge */}
          <span
            className={`inline-block px-4 py-1.5 bg-[#377DFF] text-white text-xs font-semibold rounded-full mb-6 ${inter.className}`}
          >
            SALE UP TO 35% OFF
          </span>

          {/* Title */}
          <h2
            className={`font-semibold ${poppins.className} text-3xl md:text-[42px] leading-tight text-[#141718] mb-4`}
          >
            HUNDREDS of New lower prices!
          </h2>

          {/* Description */}
          <p
            className={`text-[#6C7275] text-base md:text-lg leading-relaxed mb-8 ${inter.className}`}
          >
            It&apos;s more affordable than ever to give every room in your home a
            stylish makeover. Shop our sale items now!
          </p>

          {/* CTA */}
          <CustomButton label="Shop Now" href="/shop" />
        </div>
      </div>
    </section>
  );
}
