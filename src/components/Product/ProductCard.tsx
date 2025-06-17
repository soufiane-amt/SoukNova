import { Typography } from '@mui/material';
import RatingStars from '../RatingStars';
import Image from 'next/image';

interface ProductCardProps {
  productName: string;
  currentPrice: number;
  originalPrice?: number;
  isNew: boolean;
  discountPercentage?: number;
  rating: number;
  image: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  productName,
  currentPrice,
  originalPrice,
  isNew,
  discountPercentage,
  rating,
  image,
}) => {
  return (
    <div className="w-[150px]">
      <div>
        <Image src={image} alt={`${productName}`} width={270} height={300}/>
      </div>
      <div>
        <RatingStars isStatic={true} defaultValue={rating} />
        <Typography className="!font-bold">{productName}</Typography>
        <div className="flex justify-between">
          <Typography className="!font-bold">${`${currentPrice}`} </Typography>
          <Typography>${`${originalPrice}`}</Typography>
        </div>
      </div>
    </div>
  );
};
