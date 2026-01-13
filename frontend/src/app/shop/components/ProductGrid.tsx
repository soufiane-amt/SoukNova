import { Grid } from '@mui/material';
import EmptySectionMessage from '../../../components/feedback/EmptySection';
import CustomPagination from '../../../components/ui/CustomPagination';
import ProductCard from '../../../components/cards/ProductCard/ProductCard';
import { ProductType } from '../../../types/product.dt';

interface ProductGridProps {
  itemsData: {
    products: ProductType[];
    totalPages: number;
  };
  selectedShape: number;
  page: number;
  handlePageChange: (e: React.ChangeEvent<unknown>, v: number) => void;
}

function ProductGrid({
  itemsData,
  selectedShape,
  page,
  handlePageChange,
}: ProductGridProps) {
  return (
    <div
      className={`${selectedShape === 0 ? 'lg:col-span-3' : 'lg:col-span-4'}`}
    >
      {!itemsData.products.length ? (
        <div className="flex justify-center items-center mt-20">
          <EmptySectionMessage message="No Products are available" />
        </div>
      ) : (
        <>
          <Grid
            container
            spacing={2}
            sx={{ width: '100%' }}
            justifyContent={{ xs: 'center', md: 'space-between' }}
          >
            {itemsData.products.map((item: any, index: number) => (
              <div
                data-aos="fade-up"
                data-aos-delay={index * 100}
                key={item.id || index}
              >
                <ProductCard
                  productId={item.id}
                  productName={item.title}
                  currentPrice={item.price}
                  originalPrice={item.originalPrice}
                  discountPercentage={item.discount}
                  rating={item.rate}
                  image={item.primary_image}
                  date={item.date}
                />
              </div>
            ))}
          </Grid>
          <CustomPagination
            pagesCount={itemsData.totalPages}
            page={page}
            handlePageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}

export default ProductGrid;
