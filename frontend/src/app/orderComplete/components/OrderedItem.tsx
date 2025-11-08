import Image from "next/image";

interface OrderedItemProps {
  productName: string;
  imageUrl: string;
  count: number;
}

function OrderedItem({ productName, imageUrl, count }: OrderedItemProps) {
  return (
    <div className="relative w-[85px]" data-aos="zoom-in" data-aos-delay="200">
      <div className="h-[90px] w-[85px] bg-[#f4f4f4]">
        <Image
          src={imageUrl}
          alt={`Product image of ${productName}`}
          width={85}
          height={90}
          className="object-contain w-full h-full"
          style={{ mixBlendMode: "multiply" }}
        />
      </div>
      <span className="absolute -top-2 -right-2 bg-black rounded-full w-8 h-8 text-white flex justify-center items-center text-sm">
        {count}
      </span>
    </div>
  );
}

export default OrderedItem;
