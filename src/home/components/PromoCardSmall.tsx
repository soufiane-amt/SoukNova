import Image from 'next/image';

interface PromoCardProps {
  title: string;
  image: string;
}

export const PromoCardSmall: React.FC<PromoCardProps> = ({ title, image }) => {
  return (
    <div className="mt-5 flex flex-col justify-center items-center">
      <div className="relative">
        <Image src={image} alt="Description" width={500} height={300} />
        <div className="absolute bottom-7 left-7 ">
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
