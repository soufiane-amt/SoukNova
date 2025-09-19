import { useEffect, useState } from 'react';
import Traversal from '../../../components/ui/Traversal';
import Carousel from 'react-material-ui-carousel';
import { Typography } from '@mui/material';
import CountdownTimer from '../../../components/ui/CountDownTimer';
import {
  getDiscountedPrice,
  getFirstTwoWords,
  isProductNew,
} from '../../../utils/helpers';
import EastIcon from '@mui/icons-material/East';
import ProductImage from './ProductImage';
import ThumbnailList from './ThumbnailList';
import RatingStars from '../../../components/inputs/RatingStars';
import ReviewsSort from './ReviewsSort';
import { Review } from '../../../components/cards/Review';
import { useCart } from '../../../context/CartContext';

interface ProductProps {
  productData: any;
}

const Product: React.FC<ProductProps> = ({ productData }) => {
  const { cart, addToCart, removeFromCart, decreaseFromCart, setCart } =
    useCart();
  const [quantity, setQuantity] = useState(0);
  const [activeImage, setActiveImage] = useState(
    productData?.images?.[0]?.trim() || '',
  );

  // useEffect(() => {
  //   const fetchPoductCartQuantity = async () => {
  //     console.log('useEffect triggered with:', productData?.id);

  //     if (!productData?.id) return;

  //     const res = await fetch(`/api/cart/${productData.id}`, {
  //       method: 'GET',
  //     });
  //     console.log('res : ', res);
  //     if (!res.ok) {
  //       throw new Error('Failed to fetch product data.');
  //     }
  //     const data = await res.json();

  //     setQuantity(data.quantity);
  //   };

  //   fetchPoductCartQuantity();
  // }, [productData.id]);

  useEffect(() => {
    setActiveImage(productData?.images?.[0]?.trim() || '');
  }, [productData]);

  const handleSelectImage = (image: string) => {
    setActiveImage(image.trim());
  };

  // const UpdateProductToCart = async (
  //   productId: string,
  //   method: 'POST' | 'DELETE',
  // ) => {
  //   if (method === 'DELETE' && quantity === 0) return;
  //   try {
  //     const res = await fetch(`/api/cart/${productId}`, {
  //       method: method,
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //     });

  //     if (!res.ok) {
  //       throw new Error('Failed to add product to cart');
  //     }

  //     const data = await res.json();
  //     setQuantity(data.quantity);

  //     return data;
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  return (
    <div>
      <Traversal
        items={[
          { label: 'Home', href: '/' },
          { label: 'Shop', href: '/shop' },
          { label: productData.title },
        ]}
      />
      <div className="lg:flex w-full">
        <div className="mb-10 lg:mr-15 lg:w-[500px]" data-aos="fade-right">
          <Carousel navButtonsAlwaysInvisible={true}>
            {activeImage && (
              <ProductImage
                image={activeImage}
                isNew={isProductNew(productData.Date)}
              />
            )}
          </Carousel>
          <ThumbnailList
            images={productData.images}
            activeImage={activeImage}
            onSelectImage={handleSelectImage}
          />
        </div>
        <div className="lg:w-[508px]" data-aos="fade-left" data-aos-delay="200">
          <div className="flex flex-col gap-2">
            <div className="flex items-start space-x-2" data-aos="fade-up">
              <RatingStars isStatic={true} defaultValue={productData?.Rate} />
              <Typography sx={{ fontSize: '0.675rem' }}>
                <span>{productData?.reviews?.length ?? 0}</span> Reviews
              </Typography>
            </div>
            <div data-aos="fade-up" data-aos-delay="100">
              <p
                className={`text-[40px] font-medium`}
                style={{ fontFamily: 'var(--font-poppins), sans-serif' }}
              >
                {getFirstTwoWords(productData.title)}
              </p>
              <p className="max-h-[78px] w-full overflow-hidden text-ellipsis text-wrap font-inter leading-[26px] text-[var(--color-primary)] text-sm">
                {productData.about_item}
              </p>
            </div>
          </div>
          <div data-aos="fade-up" data-aos-delay="200">
            <div className="flex gap-4 py-8">
              <Typography className="!font-semibold !text-2xl !overflow-hidden !whitespace-nowrap !text-ellipsis">
                $
                {Number(
                  getDiscountedPrice(productData.Price, productData.discount),
                ).toFixed(2)}
              </Typography>
              {productData.Price && (
                <Typography
                  className="line-through !text-2xl"
                  sx={{ color: 'var(--color-primary)' }}
                >
                  ${Number(productData.Price).toFixed(2)}
                </Typography>
              )}
            </div>
            <div className="border-b border-t border-gray-300 py-8">
              <CountdownTimer />
            </div>
            <div className="mt-5">
              <p className="font-semibold text-black-shade-4 text-sm text-[var(--color-primary)]">
                Measurements
              </p>
              <p className="mt-2 text-xl">{productData.package_dimensions}</p>
            </div>
            <div className="my-11">
              <p className="font-semibold text-black-shade-4 text-sm text-[var(--color-primary)]">
                Choose color
              </p>
              <div className="flex space-x-2 mt-2">
                <div className="w-10 h-10 bg-blue-500 rounded-full border border-blue-500"></div>
                <div className="w-10 h-10 bg-yellow-200 rounded-full border border-blue-500"></div>
                <div className="w-10 h-10 bg-white rounded-full border border-blue-500"></div>
                <div className="w-10 h-10 bg-green-500 rounded-full border border-blue-500"></div>
              </div>
            </div>
          </div>

          <div
            className="flex space-x-8 mt-5"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <div className="bg-[#F5F5F5] flex-1 flex justify-around items-center font-bold rounded-lg">
              <button
                className="cursor-pointer"
                onClick={() => decreaseFromCart(productData.id)}
              >
                -
              </button>
              <span>
                {cart.find((item) => item.productId === productData.id)
                  ?.quantity || 0}
              </span>
              <button
                className="cursor-pointer"
                onClick={() => addToCart(productData.id)}
              >
                +
              </button>
            </div>
            <button
              className="w-full rounded-lg bg-white border flex items-center justify-center space-x-2 flex-2 py-3 cursor-pointer"
              data-aos="zoom-in"
              data-aos-delay="400"
              onClick={() => UpdateProductToCart(productData.id, 'POST')}
            >
              <svg
                width="16"
                height="12"
                viewBox="0 0 16 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8.46162 2.61137C8.20367 2.85892 7.79637 2.85892 7.53842 2.61137L7.07682 2.1684C6.53653 1.64992 5.80664 1.33333 5.00002 1.33333C3.34317 1.33333 2.00002 2.67648 2.00002 4.33333C2.00002 5.92175 2.85988 7.23337 4.10119 8.31104C5.34357 9.38963 6.82895 10.105 7.71645 10.47C7.90202 10.5464 8.09802 10.5464 8.28359 10.47C9.17109 10.105 10.6565 9.38963 11.8988 8.31104C13.1402 7.23336 14 5.92175 14 4.33333C14 2.67648 12.6569 1.33333 11 1.33333C10.1934 1.33333 9.46351 1.64991 8.92322 2.1684L8.46162 2.61137ZM8.00002 1.20638C7.22142 0.459203 6.16435 0 5.00002 0C2.60679 0 0.666687 1.9401 0.666687 4.33333C0.666687 8.57884 5.31358 10.9233 7.20921 11.7031C7.71973 11.9131 8.28031 11.9131 8.79083 11.7031C10.6865 10.9233 15.3334 8.57883 15.3334 4.33333C15.3334 1.9401 13.3933 0 11 0C9.83569 0 8.77862 0.459203 8.00002 1.20638Z"
                  fill="#141718"
                />
              </svg>
              <p className="font-medium">Wishlist</p>
            </button>
          </div>
          <div
            className="w-full mt-5 border-b border-gray-300 pb-5"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <button
              onClick={() => UpdateProductToCart(productData.id, 'POST')}
              className="w-full bg-black text-white rounded-lg py-4 cursor-pointer font-semibold"
              data-aos="zoom-in"
              data-aos-delay="500"
            >
              Add To Cart
            </button>
          </div>
          <div
            className="flex items-center gap-[58px] my-15"
            data-aos="fade-up"
            data-aos-delay="500"
          >
            <p className="w-[65px] text-[var(--color-primary)]">CATEGORY</p>
            <p>
              {Array.isArray(productData.categoriesText)
                ? productData.categoriesText
                    .map((c: any) => `{${c}}`)
                    .join(', ')
                : productData.categoriesText || ''}
            </p>
          </div>
        </div>
      </div>
      <div>
        <div className="mb-10">
          <p className="cursor-pointer border-b border-[#121212] font-medium text-[#121212] md:text-xl lg:text-2xl font-semibold">
            Reviews
          </p>
        </div>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 550,
            marginBottom: 2,
            fontSize: {
              xs: '1rem',
              sm: '1.25rem',
              md: '1.5rem',
              lg: '2rem',
            },
            fontFamily: 'Poppins, sans-serif',
          }}
        >
          Customer Reviews
        </Typography>
        <div className="flex space-x-4 mt-5" data-aos="fade-up">
          <RatingStars isStatic={true} defaultValue={productData.Rate} />
          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
            <span>{productData?.reviews?.length ?? 0}</span> Reviews
          </Typography>
        </div>
      </div>
      <div
        className="border flex justify-between items-center px-5 py-2 rounded-lg border-gray-400 mt-6"
        data-aos="fade-up"
      >
        <input
          type="text"
          placeholder="Share your review"
          className="flex-1 text-gray-700 placeholder-gray-400 outline-none bg-transparent"
        />
        <div className="flex items-end space-x-5">
          <RatingStars isStatic={false} defaultValue={1} />
          <button className="cursor-pointer">
            <EastIcon
              sx={{
                fontSize: '1rem',
                color: 'white',
                bgcolor: 'black',
                borderRadius: '50%',
                p: '4px',
                width: 25,
                height: 25,
              }}
            />
          </button>
        </div>
      </div>
      <div className="mt-12">
        <Typography
          variant="h5"
          sx={{
            fontWeight: 500,
            fontSize: {
              xs: '1rem',
              sm: '1.25rem',
              md: '1.5rem',
              lg: '2rem',
            },
            fontFamily: 'Poppins, sans-serif',
          }}
        >
          <span>{productData?.reviews?.length ?? 0}</span> Reviews
        </Typography>
        <ReviewsSort />
      </div>
      <div>
        {productData.reviews.map((item: any, index: number) => (
          <div
            key={item.id}
            data-aos="fade-up"
            data-aos-delay={`${index * 100}`}
          >
            <Review
              name={item.name}
              image={item.avatar}
              rate={item.rate}
              comment={item.comments}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Product;
