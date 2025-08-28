import { Typography } from '@mui/material';
import RatingStars from './RatingStars';
import Image from 'next/image';
import { poppins } from '@/layout';


function getFirstTwoWords(title :string) {
  const words = title.split(' ');
  if (words.length >= 2) {
    return `${words[0]} ${words[1]}`;
  }
  return title;
}

function isProductNew(productDateString: string) {
  const today = new Date();
  const productDate = new Date(productDateString);
  const differenceInTime = today.getTime() - productDate.getTime();
  const differenceInDays = differenceInTime / (1000 * 3600 * 24);
  const daysThreshold = 365;
  return differenceInDays <= daysThreshold;
}


interface ProductCardProps {
  productName: string;
  currentPrice: number;
  originalPrice?: number;
  discountPercentage?: number;
  rating: number;
  image: string;
  date: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  productName,
  currentPrice,
  originalPrice,
  discountPercentage,
  rating,
  image,
  date
}) => {
  productName = getFirstTwoWords(productName)
  const isNew = isProductNew(date)
  return (
    <div className="w-[300px] flex-shrink-0 cursor-pointer mb-5" >
      <div className="relative  bg-[#f4f4f4] w-full h-[349px] flex items-center justify-center">
        <Image
          src={image}
          alt={`${productName}`}
          width={500}
          height={349}
          className=" h-1/2 w-[60%]"
          style={{ mixBlendMode: 'multiply' }}
        />
        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {isNew && (
            <Typography className="rounded flex justify-center !text-md !font-bold !bg-[#FFFFFF] px-3  ">
              NEW
            </Typography>
          )}
          {discountPercentage && (
            <Typography className="rounded px-3 !text-md bg-[#38CB89] text-white !font-bold">
              -{discountPercentage}%
            </Typography>
          )}
        </div>
      </div>
      <div className="mt-3">
        <RatingStars isStatic={true} defaultValue={rating} />
        <div className="mb-1">
          <p className={`font-medium ${poppins.className}`}>{productName}</p>
        </div>
        <div className="flex gap-4">
          <Typography className="!font-semibold  !text-sm !overflow-hidden !text-ellipsis">
            ${Number(currentPrice).toFixed(2)}
          </Typography>
          {originalPrice && (
            <Typography className="text-color-primary line-through !text-sm">
              ${Number(originalPrice).toFixed(2)}
            </Typography>
          ) }
        </div>
      </div>
    </div>
  );
};
