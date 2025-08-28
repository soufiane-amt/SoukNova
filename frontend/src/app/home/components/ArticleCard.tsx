import { Typography } from '@mui/material';
import Image from 'next/image';
import CustomButton from '../../../components/ui/CustomButton';
import { poppins } from '@/layout';

interface ArticleCardProps {
  title: string;
  image: string;
}

export function ArticleCard({ title, image }: ArticleCardProps) {
  return (
    <div className='mb-7 cursor-pointer'>
      <div>
        <Image src={image} height={325} width={357} alt={title} />
      </div>
      <p className={`${poppins.className} pt-5 font-medium`}>{title}</p>
      <CustomButton label="Read More"  href='/blog' />
    </div>
  );
}
