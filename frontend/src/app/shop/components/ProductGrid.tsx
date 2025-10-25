import { Grid } from '@mui/material';
import { useState } from 'react';
import ShowMoreButton from '../../../components/buttons/ShowMoreButton';
import { ProductCard } from '../../../components/cards/ProductCard/ProductCard';
import EmptySectionMessage from '../../../components/feedback/EmptySection';

const defaultShowCount = 12;
interface ProductGridProps {
  products: any[];
  selectedShape: number;
}

function ProductGrid({ products, selectedShape }: ProductGridProps) {
  const [showCount, setShowCount] = useState(defaultShowCount);

  const handleShowMore = () => {
    const newShowCount = Math.min(
      showCount + defaultShowCount,
      products.length,
    );
    setShowCount(newShowCount);
  };

  return (
    <div
      className={`${selectedShape === 0 ? 'lg:col-span-3' : 'lg:col-span-4'}`}
    >
      {!products.length ? (
        <div className='flex justify-center items-center mt-20'>
          <EmptySectionMessage message="No Products are available" />
        </div>
      ) : (
        <Grid
          container
          spacing={2}
          sx={{ width: '100%' }}
          justifyContent={{ xs: 'center', md: 'space-between' }}
        >
          {products.slice(0, showCount).map((item, index) => (
            <div data-aos="fade-up" data-aos-delay={index * 100} key={index}>
              <ProductCard
                productId={item.id}
                productName={item.title}
                currentPrice={item.Price}
                originalPrice={item.originalPrice}
                discountPercentage={item.discount}
                rating={item.Rate}
                image={item.primary_image}
                date={item.Date}
              />
            </div>
          ))}
        </Grid>
      )}

      {showCount < products.length && (
        <ShowMoreButton handleShowMore={handleShowMore} />
      )}
    </div>
  );
}

export default ProductGrid;
