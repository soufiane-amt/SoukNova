import CustomButton from '../../../components/ui/CustomButton';
import Image from 'next/image';

interface PromoCardProps {
  title: string;
  image: string;
}

export const PromoCardSmall: React.FC<PromoCardProps> = ({ title, image }) => {
  return (
    <div className="bg-neutral-bg h-full">
      <div className="relative h-full w-full flex flex-col justify-between items-center">
        <div className="absolute bottom-8 left-8 z-10">
          <h5 className="text-2xl md:text-4xl bold">{title}</h5>
          <CustomButton label="Shop now" href="/shop" />
        </div>

        <Image
          src={image}
          alt="Description"
          width={500}
          height={300}
          className="w-[300px] md:w-full h-auto "
        />
      </div>
    </div>
  );
};
