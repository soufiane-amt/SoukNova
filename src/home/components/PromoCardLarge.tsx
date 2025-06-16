import Image from 'next/image';

interface PromoCardProps {
  title: string;
  image: string;
}


export const PromoCardLarge: React.FC<PromoCardProps> = ({ title, image }) => {
    return (
        <div className="relative mt-5 mr-5">
            <div>
                <Image src={image} alt="Description" width={500} height={300} />
            </div>
            <div className="absolute top-7 left-7 ">
                <h5 className='text-4xl'>{title}</h5>
                <div className='mt-3'>
                    <button className='text-lg underline cursor-pointer'>Shop now</button>
                </div>
            </div>
        </div>
    );
}
