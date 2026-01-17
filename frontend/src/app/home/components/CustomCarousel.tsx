/* eslint-disable @next/next/no-img-element */
'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { CAROUSEL_IMAGES } from '../../../constants/carouselImages';
import { poppins } from '@/layout';

const CustomCarousel = () => (
  <div
    className="mx-auto mt-5 rounded-2xl overflow-hidden shadow-lg"
    data-aos="fade-up"
  >
    <Swiper
      modules={[Navigation, Pagination, Autoplay, EffectFade]}
      spaceBetween={0}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 4000, disableOnInteraction: false }}
      loop={true}
      effect="fade"
      fadeEffect={{ crossFade: true }}
    >
      {CAROUSEL_IMAGES.map((img) => (
        <SwiperSlide key={img.src}>
          <div className="relative">
            <img
              src={img.src}
              alt={img.alt}
              className="w-full md:h-[560px] h-[380px] object-cover"
              onError={(e) =>
                (e.currentTarget.src =
                  'https://placehold.co/1200x600/CCCCCC/666666?text=Image+Error')
              }
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            {/* Content overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
              <div className="max-w-2xl">
                <span
                  className={`inline-block px-3 py-1 bg-white/90 text-[#141718] text-xs md:text-sm font-medium rounded-full mb-4 ${poppins.className}`}
                >
                  New Collection
                </span>
                <p className="text-white/80 text-sm md:text-base mb-6 max-w-lg">
                  Explore our curated collection of premium home decor and
                  furniture
                </p>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  </div>
);

export default CustomCarousel;
