'use client'; // <--- Add this line

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const images = [
  {
    src: 'https://digitalma.ma/wp-content/uploads/2024/03/blog2.jpg',
    alt: 'Image 1',
  },
  {
    src: 'https://digitalma.ma/wp-content/uploads/2024/03/blog2.jpg',
    alt: 'Image 2',
  },
  {
    src: 'https://placehold.co/1200x600/0000FF/FFFFFF?text=Slide+3',
    alt: 'Slide 3',
  },
  {
    src: 'https://placehold.co/1200x600/FFFF00/000000?text=Slide+4',
    alt: 'Slide 4',
  },
  {
    src: 'https://placehold.co/1200x600/FFA500/FFFFFF?text=Slide+5',
    alt: 'Slide 5',
  },
];

const CustomCarousel = () => (
  <div className=" mx-auto mt-5">
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
            className="w-full h-[500px] object-cover rounded-xl"
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
