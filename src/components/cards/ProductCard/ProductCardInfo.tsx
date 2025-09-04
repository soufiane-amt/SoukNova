import { Typography } from '@mui/material';
import Image from 'next/image';

interface ProductCardInfoProps {
  productName: string;
  currentPrice: number;
  originalPrice?: number;
  isNew: boolean;
  discountPercentage?: number;
  rating: number;
  image: string;
  description: string;
}

export const ProductCardInfo: React.FC<ProductCardInfoProps> = ({
  productName,
  currentPrice,
  originalPrice,
  isNew,
  discountPercentage,
  rating,
  image,
  description,
}) => {
  return (
    <div className="w-[262px] flex-shrink-0 cursor-pointer flex">
      <div className="relative">
        <Image
          src={image}
          alt={`${productName}`}
          width={500}
          height={349}
          className=" h-[349px]"
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
          <Typography className="!font-bold">{productName}</Typography>
        </div>
        <div className="flex gap-4">
          <Typography className="!font-semibold  !text-sm">
            ${Number(currentPrice).toFixed(2)}
          </Typography>
          {originalPrice && (
            <Typography className="text-color-primary line-through !text-sm">
              ${Number(originalPrice).toFixed(2)}
            </Typography>
          )}
        </div>
        <Typography className="text-color-primary line-through !text-sm">
          {description}
        </Typography>
      </div>
      <div>
        <div className="flex justify-center">
          <button
            className="w-[90%] md:w-full py-3 bg-[#141718] text-white rounded-md hover:bg-[#47555a] cursor-pointer transition-colors duration-300"
            type="submit"
          >
            Add Cart
          </button>
        </div>
      </div>
    </div>
  );
};
