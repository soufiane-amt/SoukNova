import CustomButton from '../../../components/buttons/CustomButton';
import Image from 'next/image';

interface PromoCardProps {
  title: string;
  image: string;
}

export const PromoCardLarge: React.FC<PromoCardProps> = ({ title, image }) => {
  return (
    <div className="relative w-full h-full min-h-[300px] md:min-h-[560px] rounded-xl overflow-hidden group cursor-pointer">
      <div className="absolute inset-0 bg-neutral-bg">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="absolute top-8 left-8 z-10">
        <h5 className="md:text-4xl text-2xl font-semibold text-[#141718] mb-3">
          {title}
        </h5>
        <CustomButton label="Shop Now" href="/shop" />
      </div>
    </div>
  );
};
