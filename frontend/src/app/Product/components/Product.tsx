// import { Typography } from '@mui/material';
// import Image from 'next/image';
// import { Swiper, SwiperSlide } from 'swiper/react';


// interface ProductProps {
//   productName: string;
//   isNew: boolean;
//   discountPercentage?: number;
//   image: string;
//   description : string
// }

// export const Product: React.FC<ProductProps> = ({
//   productName,
//   isNew,
//   discountPercentage,
//   image,
//   description
// }) => {
//   return (
//     <div>
//           <Swiper
//             spaceBetween={30}
//             slidesPerView={1}
//             navigation
//             pagination={{ clickable: true }}
//             autoplay={{ delay: 3000, disableOnInteraction: false }}
//             loop={true}
//           >
//             {CAROUSEL_IMAGES.map((img) => (
//               <SwiperSlide key={img.src}>
//                 <img
//                   src={img.src}
//                   alt={img.alt}
//                   className="w-full md:h-[536px] h-[336px] object-cover"
//                   onError={(e) =>
//                     (e.currentTarget.src =
//                       'https://placehold.co/1200x600/CCCCCC/666666?text=Image+Error')
//                   }
//                 />
//               </SwiperSlide>
//             ))}
//           </Swiper>
      
//       {/* <div className="relative">
//         <Image
//           src={image}
//           alt={`${productName}`}
//           width={500}
//           height={349}
//           className=" h-[349px]"
//         />
//         <div className="absolute left-3 top-3 flex flex-col gap-2">
//           {isNew && (
//             <Typography className="rounded flex justify-center !text-md !font-bold !bg-[#FFFFFF] px-3  ">
//               NEW
//             </Typography>
//           )}
//           {discountPercentage && (
//             <Typography className="rounded px-3 !text-md bg-[#38CB89] text-white !font-bold">
//               -{discountPercentage}%
//             </Typography>
//           )}
//         </div>
//       </div> */}
//     </div>
//   );
// }
