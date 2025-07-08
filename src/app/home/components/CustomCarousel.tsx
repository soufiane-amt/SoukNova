'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const images = [
  {
    src: '/images/home/carousel/carousel_img1.png',
    alt: 'Image 1',
  },
  {
    src: '/images/home/carousel/carousel_img2.jpg',
    alt: 'Image 2',
  },
  {
    src: '/images/home/carousel/carousel_img3.jpg',
    alt: 'Slide 3',
  },
  {
    src: '/images/home/carousel/carousel_img4.jpg',
    alt: 'Slide 4',
  },
];

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
      {images.map((img, i) => (
        <SwiperSlide key={i}>
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
