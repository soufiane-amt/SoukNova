import CustomButton from '../../../components/ui/CustomButton';
import { ProductCard } from '../../../components/ui/ProductCard';
import { arrivals } from '../../../constants/arrivals';


export default function NewArrivalSection() {
  return (
    <section aria-labelledby="new-arrivals" className='my-12'>
      <div className="flex justify-between" data-aos="fade-up">
        <div className="w-20">
          <h1 className="text-3xl font-bold">New Arrivals</h1>
        </div>
        <div className="flex justify-end mt-8">
          <CustomButton label="More products" />
        </div>
      </div>
      <div className="flex overflow-x-auto overflow-y-hidden space-x-6 py-10 custom-scrollbar">
        {arrivals.map((item, index) => (
          <div data-aos="fade-up" data-aos-delay={index * 100} key={index}>
            <ProductCard
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
    </section>
  );
}
