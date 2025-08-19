import { Typography } from '@mui/material';
import Image from 'next/image';


interface ProductProps {
  productName: string;
  isNew: boolean;
  discountPercentage?: number;
  rating: number;
  image: string;
  description : string
}

export const Product: React.FC<ProductProps> = ({
  productName,
  isNew,
  discountPercentage,
  image,
  description
}) => {
  return (
    <div>
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
    </div>
  );
}
