import CustomButton from '@/components/CustomButton';
import Image from 'next/image';

interface PromoCardProps {
  title: string;
  image: string;
}

export const PromoCardLarge: React.FC<PromoCardProps> = ({ title, image }) => {
  return (
    <div className="md:mr-2 flex flex-col items-center h-full">
      <div className="relative w-full  h-full">
        <div className='bg-[#F3F5F7] h-full '>
          <Image
            src={image}
            alt={title}
            width={500}
            height={300}
            className="md:w-full w-[300px]"
          />
        </div>
        <div className="absolute top-7 left-7">
          <h5 className="md:text-4xl text-2xl">{title}</h5>
          <CustomButton label='Shop now'/>
        </div>
      </div>
    </div>
  );
};
