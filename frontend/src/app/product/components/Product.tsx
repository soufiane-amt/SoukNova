'use client';
import * as React from 'react';
import { useEffect, useState } from 'react';
import Traversal from '../../../components/ui/Traversal';
import Carousel from 'react-material-ui-carousel';
import { Typography } from '@mui/material';
import CountdownTimer from '../../../components/ui/CountDownTimer';
import {
  getDiscountedPrice,
  isProductNew,
} from '../../../utils/helpers';
import EastIcon from '@mui/icons-material/East';
import ProductImage from './ProductImage';
import ThumbnailList from './ThumbnailList';
import RatingStars from '../../../components/inputs/RatingStars';
import ReviewsSort from './ReviewsSort';
import { Review } from '../../../components/cards/Review';
import { useCart } from '../../../context/CartContext';
import { poppins } from '@/layout';
import ShowMoreButton from '../../../components/buttons/ShowMoreButton';
import { useShowMore } from '../../../hooks/useShowMore';
import { useRouter } from 'next/navigation';
import { ProductType } from '../../../types/product.dt';

interface ProductTabsProps{
  productData: ProductType
}
function ProductTabs({ productData }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<'reviews' | 'info'>('reviews');
  const { visibleItems, setVisibleItems, handleShowMore, hasMore } =
    useShowMore(productData.comments, 5);
  const [reviewInput, setReviewInput] = useState('');
  const [ratingInput, setRatingInput] = useState<number | null>(1);
  const route = useRouter();

  useEffect(() => {}, [visibleItems]);
  const handleWrtitingReview = (e: any) => {
    setReviewInput(e.target.value);
  };

  const handleAddReview = async () => {
    if (!reviewInput) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/comment/${productData.id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content: reviewInput, rating: ratingInput }),
          credentials: 'include',
        },
      );
      if (res.status === 401) {
        route.push('/auth/signin');
        return;
      }

      const data = await res.json();
      const newReview = {
        ...data,
        avatar: data.avatar,
      };
      setVisibleItems([newReview, ...visibleItems]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="flex border-b border-gray-300 mb-6 font-semibold">
        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-4 py-2 text-lg cursor-pointer ${
            activeTab === 'reviews'
              ? 'border-b-2'
              : 'text-[var(--color-primary)] font-medium'
          }`}
        >
          Reviews
        </button>
        <button
          onClick={() => setActiveTab('info')}
          className={`px-4 py-2 text-lg cursor-pointer ${
            activeTab === 'info'
              ? 'border-b-2'
              : 'text-[var(--color-primary)] font-medium'
          }`}
        >
          Additional Info
        </button>
      </div>
      {activeTab === 'reviews' && (
        <div>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 550,
              marginBottom: 2,
              fontSize: {
                xs: '0.75rem',
                sm: '1rem',
                md: '1.25rem',
                lg: '1.75rem',
              },
              fontFamily: 'Poppins, sans-serif',
            }}
          >
            Customer Reviews
          </Typography>
          <div className="flex space-x-4 mt-5" data-aos="fade-up">
            <RatingStars isStatic={true} defaultValue={productData.rate} />
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              <span>{productData?.comments?.length ?? 0}</span> Reviews
            </Typography>
          </div>
          <div
            className={`border border-gray-300 flex justify-between items-center px-5 py-2 rounded-lg mt-6 ${poppins.className}`}
            data-aos="fade-up"
          >
            <input
              type="text"
              onChange={handleWrtitingReview}
              placeholder="Share your review"
              className={`flex-1 text-gray-700 placeholder-gray-400 outline-none bg-transparent py-2 md:py-4 text-sm`}
            />
            <div className="flex items-end space-x-5" data-aos="fade-up">
              <RatingStars
                isStatic={false}
                defaultValue={1}
                size="medium"
                onChange={(newValue) => setRatingInput(newValue)}
              />
              <button
                value={reviewInput}
                onClick={handleAddReview}
                className="cursor-pointer bg-black text-white px-2 py-2 rounded-full md:px-8 font-medium"
              >
                <EastIcon
                  sx={{
                    fontSize: '1rem',
                    color: 'white',
                    bgcolor: 'black',
                    borderRadius: '50%',
                    p: '4px',
                    width: 25,
                    height: 25,
                    display: {
                      xs: 'inline-flex',
                      md: 'none',
                      lg: 'none',
                    },
                  }}
                />
                <span className="md:inline hidden">Write review</span>
              </button>
            </div>
          </div>
          <div
            className="mt-12 flex justify-between items-end"
            data-aos="fade-right"
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 500,
                fontSize: {
                  xs: '0.75rem',
                  sm: '1rem',
                  md: '1.25rem',
                  lg: '1.75rem',
                },
                fontFamily: 'Poppins, sans-serif',
              }}
            >
              <span>{productData?.comments?.length ?? 0}</span> Reviews
            </Typography>
            <ReviewsSort />
          </div>
          <div>
            {visibleItems.map((item: any, index: number) => (
              <div
                key={item.id}
                data-aos="fade-right"
                data-aos-delay={`${index * 100}`}
              >
                <Review
                  name={item.name}
                  image={item.avatar}
                  rate={item.rate}
                  comment={item.content}
                />
              </div>
            ))}
          </div>
          {hasMore && <ShowMoreButton handleShowMore={handleShowMore} />}
        </div>
      )}

      {activeTab === 'info' && (
        <div className={`${poppins.className} space-y-4`}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 500,
              marginBottom: 2,
              fontSize: {
                xs: '1rem',
                sm: '1.25rem',
                md: '1.50rem',
                lg: '2rem',
              },
              fontFamily: 'Poppins, sans-serif',
            }}
          >
            Additional Info
          </Typography>

          <div>
            <p
              className="font-semibold md:text-xl text-md text-[var(--color-primary)]"
              data-aos="fade-right"
              data-aos-delay="100"
            >
              Details
            </p>
            <p
              className="font-medium md:text-md text-sm"
              data-aos="fade-right"
              data-aos-delay="150"
            >
              {productData.about_item}
            </p>
          </div>

          <div data-aos="fade-right">
            <p
              className="font-semibold md:text-xl text-md text-[var(--color-primary)]"
              data-aos="fade-right"
              data-aos-delay="200"
            >
              Packaging
            </p>
            <p
              className="font-medium md:text-md text-sm"
              data-aos="fade-right"
              data-aos-delay="250"
            >
              {productData.package_dimensions}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

interface ProductProps {
  productData: ProductType;
}

const Product: React.FC<ProductProps> = ({ productData }) => {
  const { cart, addToCart, decreaseFromCart, showToast } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const [activeImage, setActiveImage] = useState(
    productData?.images?.[0] || '',
  );

  const handleAddWishlist = async (productId: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/wishlist/${productId}`,
        {
          method: 'POST',
          credentials: 'include',
        },
      );
      setIsWishlisted((prev) => !prev);
      showToast('Product is added to wishlist!');
      if (!res?.ok) throw new Error('Failed to delete');
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    setActiveImage(productData?.images?.[0] || '');
  }, [productData]);

  const handleSelectImage = (image: string) => {
    setActiveImage(image);
  };

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
        <div className="mb-10 lg:mr-15 lg:w-[550px]" data-aos="fade-right">
          <Carousel navButtonsAlwaysInvisible={true}>
            {activeImage && (
              <ProductImage
                image={activeImage}
                isNew={isProductNew(productData.date)}
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
              <RatingStars isStatic={true} defaultValue={productData?.rate} />
              <Typography sx={{ fontSize: '0.675rem' }}>
                <span>{productData?.comments?.length ?? 0}</span> Reviews
              </Typography>
            </div>
            <div data-aos="fade-up" data-aos-delay="100">
              <p
                className={`text-[40px] font-medium`}
                style={{ fontFamily: 'var(--font-poppins), sans-serif' }}
              >
                {productData.title}
              </p>
              <p className=" w-full overflow-hidden text-ellipsis text-wrap font-inter leading-[26px] text-[var(--color-primary)] text-sm">
                {productData.about_item}
              </p>
            </div>
          </div>
          <div data-aos="fade-up" data-aos-delay="200">
            <div className="flex gap-4 py-8">
              <Typography className="!font-semibold !text-2xl !overflow-hidden !whitespace-nowrap !text-ellipsis">
                $
                {Number(
                  getDiscountedPrice(productData.price, productData.discount),
                ).toFixed(2)}
              </Typography>
              {productData.price && (
                <Typography
                  className="line-through !text-xl !font-semibold"
                  sx={{ color: 'var(--color-primary)' }}
                >
                  ${Number(productData.price).toFixed(2)}
                </Typography>
              )}
            </div>
            <div className="border-b border-t border-gray-300 py-8">
              <CountdownTimer />
            </div>
            <div className="mt-5">
              <p className="font-semibold text-black-shade-4 text-md text-[var(--color-primary)]">
                Measurements
              </p>
              <p className="mt-2 text-xl">{productData.package_dimensions}</p>
            </div>
          </div>

          <div
            className="flex space-x-8 mt-5"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <div className="bg-[#F5F5F5] flex-1 flex justify-around items-center font-bold rounded-lg text-sm md:text-md">
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
              onClick={() => handleAddWishlist(productData.id)}
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
                  fill={isWishlisted ? 'red' : '#141718'}
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
              onClick={() => addToCart(productData.id)}
              className="w-full bg-black text-white rounded-lg py-4 cursor-pointer font-semibold"
              data-aos="zoom-in"
              data-aos-delay="500"
            >
              Add To Cart
            </button>
          </div>
          <div
            className="my-15 text-xs space-y-2"
            data-aos="fade-up"
            data-aos-delay="500"
          >
            <div className="flex items-center">
              <p className="w-24 text-[var(--color-primary)] font-medium">
                CATEGORY
              </p>
              <p className="text-gray-800">{productData.categoriesText}</p>
            </div>

            <div className="flex items-center">
              <p className="w-24 text-[var(--color-primary)] font-medium">
                SKU
              </p>
              <p className="text-gray-800">{productData.item_model_number}</p>
            </div>
          </div>
        </div>
      </div>
      <div>
        <ProductTabs productData={productData} />
      </div>
    </div>
  );
};

export default Product;
