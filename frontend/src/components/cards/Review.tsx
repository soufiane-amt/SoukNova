import { Typography } from '@mui/material';
import Image from 'next/image';
import RatingStars from '../inputs/RatingStars';
import { DEFAULT_USER_IMAGE } from '../../constants/assets';

interface ReviewProps {
  name: string;
  image: string;
  rate: number;
  comment: string;
}

export const Review = ({ name, image, rate, comment }: ReviewProps) => {
  const imageUrl = image
    ? `${process.env.NEXT_PUBLIC_API_URL}${image}`
    : DEFAULT_USER_IMAGE;
  return (
    <div className=" flex items-start mt-8 border-b border-gray-300 pb-8">
      <div className="flex-shrink-0 mr-5">
        <Image
          className="rounded-full w-15 h-15"
          src={imageUrl}
          height={80}
          width={80}
          alt={name}
          unoptimized
        />
      </div>
      <div>
        <div className="flex flex-col">
          <Typography sx={{ marginBottom: 1, fontWeight: 'bold' }}>
            {name}
          </Typography>
          <RatingStars isStatic={true} defaultValue={rate} />
        </div>
        <div className="mt-5">
          <p className="md:text-sm text-xs">{comment}</p>
        </div>
        <div className="flex justify-start space-x-8 mt-5 text-xs font-medium">
          <button className="cursor-pointer">Like</button>
          <button className="cursor-pointer">Reply</button>
        </div>
      </div>
    </div>
  );
};
