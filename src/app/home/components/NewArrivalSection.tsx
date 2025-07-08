import CustomButton from "@/components/ui/CustomButton";
import { ProductCard } from "@/components/ui/ProductCard";

const arrivals = [
  {
    productName: 'Classic White Sneakers',
    currentPrice: 59.99,
    originalPrice: 89.99,
    isNew: true,
    discountPercentage: 33,
    rating: 4.5,
    image: '/images/home/arrivals/arival1.png',
  },
  {
    productName: 'Casual Denim Jacket',
    currentPrice: 79.99,
    originalPrice: 109.99,
    isNew: false,
    discountPercentage: 27,
    rating: 4.2,
    image: '/images/home/arrivals/arival2.png',
  },
  {
    productName: 'Slim Fit Chinos',
    currentPrice: 39.99,
    isNew: true,
    rating: 4.7,
    image: '/images/home/arrivals/arival3.png',
  },
  {
    productName: 'Leather Handbag',
    currentPrice: 129.99,
    originalPrice: 159.99,
    isNew: false,
    discountPercentage: 19,
    rating: 4.8,
    image: '/images/home/arrivals/arival4.png',
  },
  {
    productName: 'Sporty Smartwatch',
    currentPrice: 199.99,
    isNew: true,
    rating: 4.9,
    image: '/images/home/arrivals/arival5.png',
  },
];

export default function NewArrivalSection() {
  return (
    <div>
      <div className="flex justify-between" data-aos="fade-up">
        <div className="w-20">
          <h1 className="text-3xl bold-font">New Arrivals</h1>
        </div>
        <div className="flex justify-end mt-8">
          <CustomButton label="More products" />
        </div>
      </div>
      <div className="flex overflow-x-auto overflow-y-hidden space-x-6 py-10 custom-scrollbar">
        {arrivals.map((item, index) => (
          <div data-aos="fade-up" data-aos-delay={index * 100} key={index}>
            <ProductCard
              key={index}
              productName={item.productName}
              currentPrice={item.currentPrice}
              originalPrice={item.originalPrice}
              isNew={item.isNew}
              discountPercentage={item.discountPercentage}
              rating={item.rating}
              image={item.image}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
