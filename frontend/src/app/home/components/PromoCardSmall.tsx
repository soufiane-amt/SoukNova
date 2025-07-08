import CustomButton from '../../../components/ui/CustomButton';
import Image from 'next/image';

interface PromoCardProps {
  title: string;
  image: string;
}

export const PromoCardSmall: React.FC<PromoCardProps> = ({ title, image }) => {
  return (
    <div className="bg-[#F3F5F7] h-full">
      <div className="relative h-full w-full flex flex-col justify-between items-center">
        <div className="absolute bottom-8 left-8 z-10">
          <h5 className="text-2xl md:text-4xl bold">{title}</h5>
          <CustomButton label="Shop now" />
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

// <div className="flex flex-col h-full w-full">
//   <div className="relative h-full w-full">
//     <div className="bg-[#F3F5F7] h-full w-full ">
//       <Image
//         src={image}
//         alt="Description"
//         width={500}
//         height={300}
//         className="md:w-full w-[300px]"
//       />
//     </div>
//     <div className="absolute bottom-7 left-7 ">
//       <h5 className="md:text-4xl text-2xl">{title}</h5>
//       <div className="mt-3">
//         <button className="md:text-lg text-md underline cursor-pointer">
//           Shop now
//         </button>
//       </div>
//     </div>
//   </div>
// </div>
