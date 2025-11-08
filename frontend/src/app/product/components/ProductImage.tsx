import { Typography } from '@mui/material';
import Image from 'next/image';

interface ProductImageProps {
  image: string;
  isNew: boolean;
}

const ProductImage: React.FC<ProductImageProps> = ({ image, isNew }) => {
  return (
    <div
      className="relative bg-[#f4f4f4] h-[649px] flex items-center justify-center"
      data-aos="fade-right"
      data-aos-delay="200"
    >
      <Image
        src={image}
        alt={`Product image${isNew ? ' - New' : ''}`}
        width={500}
        height={349}
        className="transition-transform duration-300 ease-in-out hover:scale-105"
        style={{ mixBlendMode: 'multiply' }}
      />
      <div className="absolute left-3 top-3 flex flex-col gap-2">
        {isNew && (
          <Typography className="rounded flex justify-center !text-md !font-bold !bg-[#FFFFFF] px-3">
            NEW
          </Typography>
        )}
      </div>
    </div>
  );
};

export default ProductImage;
