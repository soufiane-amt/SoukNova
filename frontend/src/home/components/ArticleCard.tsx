import CustomButton from '@/components/CustomButton';
import { Typography } from '@mui/material';
import Image from 'next/image';

interface ArticleCardProps {
  title: string;
  image: string;
}

export function ArticleCard({ title, image }: ArticleCardProps) {
  return (
    <div className='mb-7'>
      <div>
        <Image src={image} height={325} width={357} alt={title} />
      </div>
      <Typography sx={{ fontFamily: 'Poppins, sans-serif', paddingTop: '15px', fontWeight: 'bold' }}>
        {title}
      </Typography>
      <CustomButton label="Read More" />
    </div>
  );
}
