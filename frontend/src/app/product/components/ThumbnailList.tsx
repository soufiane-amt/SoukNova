import Image from 'next/image';

interface ThumbnailListProps {
  images: string[] | undefined;
  activeImage: string;
  onSelectImage: (image: string) => void;
}

const ThumbnailList: React.FC<ThumbnailListProps> = ({
  images,
  activeImage,
  onSelectImage,
}) => {
  if (!images) return <></>;
  return (
    <div className="flex justify-center mt-4 space-x-2" data-aos="fade-up">
      {images.map((image, index) => {
        const img = image.trim();

        return (
          <div
            key={img + index}
            className={`cursor-pointer border-2 p-1 rounded-md ${
              activeImage === img ? 'border-blue-500' : 'border-transparent'
            }`}
            onClick={() => onSelectImage(img)}
          >
            <Image
              src={img}
              alt={`Thumbnail ${index + 1}`}
              width={70}
              height={70}
              className="rounded-md"
            />
          </div>
        );
      })}
    </div>
  );
};

export default ThumbnailList;
