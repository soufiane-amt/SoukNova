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
  if (!images || images.length <= 1) return null;

  return (
    <div className="flex justify-center gap-3 mt-4" data-aos="fade-up">
      {images.map((image, index) => {
        const img = image.trim();
        const isActive = activeImage === img;

        return (
          <button
            key={img + index}
            className={`relative w-20 h-20 rounded-xl overflow-hidden bg-[#F5F5F5] transition-all duration-300 cursor-pointer ${
              isActive
                ? 'ring-2 ring-[#141718] ring-offset-2'
                : 'opacity-60 hover:opacity-100 hover:ring-2 hover:ring-gray-300 hover:ring-offset-1'
            }`}
            onClick={() => onSelectImage(img)}
            aria-label={`View image ${index + 1}`}
            aria-pressed={isActive}
          >
            <Image
              src={img}
              alt={`Product thumbnail ${index + 1}`}
              fill
              className="object-contain p-2"
              style={{ mixBlendMode: 'multiply' }}
            />
          </button>
        );
      })}
    </div>
  );
};

export default ThumbnailList;
