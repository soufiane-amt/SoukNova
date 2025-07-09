/* eslint-disable @next/next/no-img-element */
'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { CAROUSEL_IMAGES } from '../../../constants/carouselImages';


const CustomCarousel = () => (
  <div className="mx-auto mt-5 " data-aos="fade-up">
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={30}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      loop={true}
    >
      {CAROUSEL_IMAGES.map((img) => (
        <SwiperSlide key={img.src}>
          <img
            src={img.src}
            alt={img.alt}
            className="w-full md:h-[536px] h-[336px] object-cover"
            onError={(e) =>
              (e.currentTarget.src =
                'https://placehold.co/1200x600/CCCCCC/666666?text=Image+Error')
            }
          />
        </SwiperSlide>
      ))}
    </Swiper>
  </div>
);

export default CustomCarousel;
