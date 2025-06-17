import Image from 'next/image';

interface PromoCardProps {
  title: string;
  image: string;
}

export const PromoCardLarge: React.FC<PromoCardProps> = ({ title, image }) => {
  return (
    <div className="mt-5 md:mr-5 flex flex-col items-center">
      <div className="relative max-w-[500px] w-full">
        <Image
          src={image}
          alt={title}
          width={500}
          height={300}
          className="w-full h-auto object-cover"
        />
        <div className="absolute top-7 left-7">
          <h5 className="md:text-4xl text-2xl">{title}</h5>
          <div className="mt-3">
            <button className="md:text-lg text-md underline cursor-pointer">
              Shop now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
