import Image from 'next/image';
import Traversal from './Traversal';
import { poppins } from '@/layout';


interface SectionShowProps{
  imageUrl :string, 
  head :string, 
  desc :string, 
}

export default function SectionShow({imageUrl, head, desc} : SectionShowProps) {
  return (
    <div className="relative h-96 overflow-hidden">
      <Image
        className="w-full h-full object-cover"
        src={imageUrl}
        alt="Side visual"
        width={600}
        height={400}
        priority
      />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full text-center">
        <div className="mb-5 flex justify-center align-center">
          <Traversal
            items={[{ label: 'Home', href: '/' }, { label: head }]}
          />
        </div>
        <div className="flex  justify-center text-center">
          <div>
            <h1 className={`text-4xl md:text-6xl font-medium mb-5 ${poppins.className}`}>{`${head} Page`}</h1>
            <p className='text-sm md:text-md'>{desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
