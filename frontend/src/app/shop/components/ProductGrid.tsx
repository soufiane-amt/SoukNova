import { Grid } from '@mui/material';
import ShowMoreButton from '../../../components/buttons/ShowMoreButton';
import { ProductCard } from '../../../components/cards/ProductCard/ProductCard';
import EmptySectionMessage from '../../../components/feedback/EmptySection';
import { useShowMore } from '../../../hooks/useShowMore';

interface ProductGridProps {
  products: any[];
  selectedShape: number;
}

function ProductGrid({ products, selectedShape }: ProductGridProps) {
  const { visibleItems, handleShowMore, hasMore } = useShowMore(products, 12);

  return (
    <div
      className={`${selectedShape === 0 ? 'lg:col-span-3' : 'lg:col-span-4'}`}
    >
      {!products.length ? (
        <div className="flex justify-center items-center mt-20">
          <EmptySectionMessage message="No Products are available" />
        </div>
      ) : (
        <Grid
          container
          spacing={2}
          sx={{ width: '100%' }}
          justifyContent={{ xs: 'center', md: 'space-between' }}
        >
          {visibleItems.map((item, index) => (
            <div data-aos="fade-up" data-aos-delay={index * 100} key={index}>
              <ProductCard
                productId={item.id}
                productName={item.title}
                currentPrice={item.price}
                originalPrice={item.originalPrice}
                discountPercentage={item.discount}
                rating={item.rate}
                image={item.primary_image}
                date={item.Date}
              />
            </div>
          ))}
        </Grid>
      )}

      {hasMore && <ShowMoreButton handleShowMore={handleShowMore} />}
    </div>
  );
}

export default ProductGrid;
