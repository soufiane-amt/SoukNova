import { Typography } from '@mui/material';
import RatingStars from './RatingStars';
import Image from 'next/image';

interface ReviewProps {
  name: string;
  image: string;
  rate: number;
  comment: string;
}

export const Review = ({ name, image, rate, comment }: ReviewProps) => {
  return (
    <div className='mt-8 border-b border-gray-300 pb-8'>
      <div className="flex space-x-8 items-center ">
        <Image
          className="rounded-full w-15 h-15"
          src={image}
          height={80}
          width={80}
          alt={name}
          unoptimized
        />
        <div className="flex flex-col">
          <Typography sx={{ marginBottom: 1, fontWeight: 'bold' }}>
            {name}
          </Typography>
          <RatingStars isStatic={true} defaultValue={rate} />
        </div>
      </div>
      <div className='mt-5'>
        <p className="text-xs">{comment}</p>
      </div>
      <div className="flex justify-center space-x-8 mt-5 text-xs font-semibold">
        <button className='cursor-pointer'>Like</button>
        <button className='cursor-pointer'>Reply</button>
      </div>
    </div>
  );
};
