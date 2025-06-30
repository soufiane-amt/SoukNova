import CustomButton from '@/components/CustomButton';
import { Typography } from '@mui/material';
import Image from 'next/image';

const promoHighlightImage = '/images/home/fourniture.png';

export function PromoHighlightSection() {
  return (
    <div className="w-full md:flex md:h-[532px]" >
      <div className="flex-1" data-aos="fade-left" data-aos-duration="1000">
        <Image
          src={promoHighlightImage}
          alt="Highlight promotion"
          width={600}
          height={400}
          className="w-full h-[367px] md:h-[532px]"
        />
      </div>
      <div className="flex  items-center bg-[#F3F5F7] flex-1" data-aos="fade-right" data-aos-duration="1000">
        <div className=" px-15 py-12 w-2/3">
          <Typography
            variant="subtitle1"
            component="div"
            sx={{ fontFamily: 'Inter', fontWeight: 'bold' }}
            gutterBottom
            color="#377DFF"
          >
            SALE UP TO 35% OFF
          </Typography>
          <Typography
            variant="h4"
            component="div"
            gutterBottom
            color="main.primary"
            style={{ fontWeight: 'bold' }}
          >
            HUNDREDS of New lower prices!
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mt: 2,
              color: 'text.secondary',
              lineHeight: 1.6,
            }}
          >
            It’s more affordable than ever to give every room in your home a
            stylish makeover
          </Typography>
          <div className="mt-8">
            <CustomButton label="Shop Now" />
          </div>
        </div>
      </div>
    </div>
  );
}
