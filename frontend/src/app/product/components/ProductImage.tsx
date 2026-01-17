import Image from 'next/image';

interface ProductImageProps {
  image: string;
  isNew: boolean;
}

const ProductImage: React.FC<ProductImageProps> = ({ image, isNew }) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-8">
      <Image
        src={image}
        alt={`Product image${isNew ? ' - New' : ''}`}
        width={500}
        height={500}
        className="object-contain max-h-[500px] transition-transform duration-500 ease-out group-hover:scale-105"
        style={{ mixBlendMode: 'multiply' }}
        priority
      />
      {/* Badges */}
      <div className="absolute left-4 top-4 flex flex-col gap-2">
        {isNew && (
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-sm">
            NEW
          </span>
        )}
      </div>
    </div>
  );
};

export default ProductImage;
