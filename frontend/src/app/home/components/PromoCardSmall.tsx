import CustomButton from '../../../components/buttons/CustomButton';
import Image from 'next/image';

interface PromoCardProps {
  title: string;
  image: string;
}

export const PromoCardSmall: React.FC<PromoCardProps> = ({ title, image }) => {
  return (
    <div className="relative group cursor-pointer w-full h-full min-h-[200px] md:min-h-[268px] rounded-xl overflow-hidden group cursor-pointer">
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
          className="w-[300px] md:w-full h-auto transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </div>
  );
};
