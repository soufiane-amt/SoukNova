import { Typography } from '@mui/material';
import Image from 'next/image';
import CustomButton from '../../../components/buttons/CustomButton';
import { poppins } from '@/layout';
import Link from 'next/link';

interface ArticleCardProps {
  id: string;
  title: string;
  image: string;
}

export function ArticleCard({ id, title, image }: ArticleCardProps) {
  return (
    <div className="group cursor-pointer w-full max-w-sm flex flex-col mb-8">
      <div className="relative w-full aspect-[4/3] overflow-hidden rounded-lg shadow-sm transition-shadow duration-300">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <p className={`${poppins.className} pt-4 font-medium text-lg truncate`}>
        {title}
      </p>
      <div className="mt-2">
        <CustomButton label="Read More" href={`/blog/${id}`} />
      </div>
    </div>
  );
}
