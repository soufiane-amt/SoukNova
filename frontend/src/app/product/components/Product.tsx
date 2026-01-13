'use client';
import * as React from 'react';
import { useEffect, useState } from 'react';
import Traversal from '../../../components/ui/Traversal';
import Carousel from 'react-material-ui-carousel';
import { Typography, CircularProgress } from '@mui/material';
import CountdownTimer from '../../../components/ui/CountDownTimer';
import { getDiscountedPrice, isProductNew } from '../../../utils/helpers';
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
import { routeModule } from 'next/dist/build/templates/pages';

interface ProductTabsProps {
  productData: ProductType;
}
function ProductTabs({ productData }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<'reviews' | 'info'>('reviews');
  const { visibleItems, setVisibleItems, handleShowMore, hasMore } =
    useShowMore(productData.comments, 5);
  const [reviewInput, setReviewInput] = useState('');
  const [ratingInput, setRatingInput] = useState<number | null>(1);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const ABOUT_DESC_CHAR_LIMIT = 300;
  const route = useRouter();

  useEffect(() => {}, [visibleItems]);
  const handleWrtitingReview = (e: any) => {
    setReviewInput(e.target.value);
  };

  const handleAddReview = async () => {
    if (!reviewInput) return;
    setReviewLoading(true);
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
      setReviewInput('');
    } catch (err) {
      console.error(err);
    } finally {
      setReviewLoading(false);
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
          <div className="flex items-center gap-3 mt-5" data-aos="fade-up">
            <RatingStars isStatic={true} defaultValue={productData.rate} />
            <span className="text-sm text-[#6C7275]">
              Based on {productData?.comments?.length ?? 0} reviews
            </span>
          </div>

          {/* Review Input Card */}
          <div
            className="bg-[#FAFAFA] rounded-2xl p-5 md:p-6 mt-8 border border-gray-100"
            data-aos="fade-up"
          >
            <p
              className={`text-sm font-semibold text-[#141718] mb-4 ${poppins.className}`}
            >
              Share your experience
            </p>
            <div className="space-y-4">
              <textarea
                value={reviewInput}
                onChange={handleWrtitingReview}
                placeholder="Write your review here... What did you like or dislike about this product?"
                rows={3}
                className="w-full px-4 py-3 text-sm text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-xl outline-none focus:border-[#141718] focus:ring-2 focus:ring-[#141718]/10 transition-all resize-none"
              />
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl border border-gray-200">
                  <span className="text-sm text-[#6C7275]">Your rating:</span>
                  <RatingStars
                    isStatic={false}
                    defaultValue={1}
                    size="medium"
                    onChange={(newValue) => setRatingInput(newValue)}
                  />
                </div>
                <button
                  onClick={handleAddReview}
                  disabled={reviewLoading || !reviewInput}
                  className="inline-flex items-center justify-center gap-2 bg-[#141718] text-white px-6 py-3 rounded-xl font-medium text-sm hover:bg-[#2d3033] hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {reviewLoading ? (
                    <CircularProgress size={18} sx={{ color: 'white' }} />
                  ) : (
                    <>
                      <span>Submit Review</span>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
          {/* Reviews Header */}
          <div
            className="mt-10 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pb-4 border-b border-gray-100"
            data-aos="fade-right"
          >
            <h4
              className={`text-lg font-semibold text-[#141718] ${poppins.className}`}
            >
              {productData?.comments?.length ?? 0} Customer Reviews
            </h4>
            <ReviewsSort />
          </div>

          {/* Reviews List */}
          <div className="mt-6 space-y-4">
            {visibleItems.length === 0 ? (
              <div className="text-center py-12 bg-[#FAFAFA] rounded-2xl">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <p className="text-[#6C7275] text-sm">
                  No reviews yet. Be the first to share your experience!
                </p>
              </div>
            ) : (
              visibleItems.map((item: any, index: number) => (
                <div
                  key={item.id}
                  data-aos="fade-up"
                  data-aos-delay={`${index * 50}`}
                  className="bg-white rounded-xl p-5 border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all"
                >
                  <Review
                    name={item.name}
                    image={item.avatar}
                    rate={item.rate}
                    comment={item.content}
                  />
                </div>
              ))
            )}
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
              {productData.about_item ? (
                productData.about_item.length > ABOUT_DESC_CHAR_LIMIT ? (
                  <>
                    {showFullDescription
                      ? productData.about_item
                      : `${productData.about_item.slice(
                          0,
                          ABOUT_DESC_CHAR_LIMIT,
                        )}...`}
                    <button
                      onClick={() => setShowFullDescription((s) => !s)}
                      className="inline-flex items-center gap-1 ml-2 text-sm text-[#141718] font-semibold hover:text-[#343839] transition-colors cursor-pointer"
                    >
                      <span className="underline underline-offset-2">
                        {showFullDescription ? 'Read less' : 'Read more'}
                      </span>
                      <svg
                        className={`w-4 h-4 transition-transform duration-300 ${
                          showFullDescription ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  </>
                ) : (
                  productData.about_item
                )
              ) : (
                ''
              )}
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
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [incLoading, setIncLoading] = useState(false);
  const [decLoading, setDecLoading] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const PRODUCT_SNIPPET_CHAR_LIMIT = 400;
  const route = useRouter();

  const redirectToSignIn = () => {
    route.push('/auth/signin');
    showToast('Please sign in to add items to your wishlist.');
  };
  const [activeImage, setActiveImage] = useState(
    productData?.images?.[0] || '',
  );

  const handleAddWishlist = async (productId: string) => {
    if (wishlistLoading) return;
    setWishlistLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/wishlist/${productId}`,
        {
          method: 'POST',
          credentials: 'include',
        },
      );
      if (!res?.ok) {
        redirectToSignIn();
      } else {
        setIsWishlisted((prev) => !prev);
        showToast('Product is added to wishlist!');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setWishlistLoading(false);
    }
  };

  useEffect(() => {
    setActiveImage(productData?.images?.[0] || '');
  }, [productData]);

  const handleSelectImage = (image: string) => {
    setActiveImage(image);
  };

  const handleIncrease = async () => {
    if (incLoading) return;
    try {
      setIncLoading(true);
      await addToCart(productData.id);
    } catch (e) {
      console.error('Increase quantity failed', e);
    } finally {
      setIncLoading(false);
    }
  };

  const handleDecrease = async () => {
    if (decLoading) return;
    try {
      setDecLoading(true);
      await decreaseFromCart(productData.id);
    } catch (e) {
      console.error('Decrease quantity failed', e);
    } finally {
      setDecLoading(false);
    }
  };

  const discountedPrice = Number(
    getDiscountedPrice(productData.price, productData.discount),
  ).toFixed(2);
  const originalPrice = Number(productData.price).toFixed(2);
  const discountPercent = productData.discount
    ? Math.round(Number(productData.discount))
    : 0;
  const cartQuantity =
    cart.find((item) => item.productId === productData.id)?.quantity || 0;

  return (
    <div className={poppins.className}>
      {/* Breadcrumb */}
      <Traversal
        items={[
          { label: 'Home', href: '/' },
          { label: 'Shop', href: '/shop' },
          { label: productData.title },
        ]}
      />

      {/* Main Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mt-8">
        {/* Image Gallery Section */}
        <div className="space-y-4" data-aos="fade-right">
          {/* Main Image Container */}
          <div className="relative bg-gradient-to-br from-[#F8F8F8] to-[#F0F0F0] rounded-2xl overflow-hidden aspect-square flex items-center justify-center group">
            {activeImage && (
              <ProductImage
                image={activeImage}
                isNew={isProductNew(productData.date)}
              />
            )}
            {/* Discount Badge */}
            {discountPercent > 0 && (
              <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-rose-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                -{discountPercent}% OFF
              </div>
            )}
          </div>
          {/* Thumbnails */}
          <ThumbnailList
            images={productData.images}
            activeImage={activeImage}
            onSelectImage={handleSelectImage}
          />
        </div>

        {/* Product Details Section */}
        <div className="space-y-6" data-aos="fade-left" data-aos-delay="100">
          {/* Rating & Reviews Badge */}
          <div className="flex items-center gap-3 flex-wrap" data-aos="fade-up">
            <div className="flex items-center gap-2 bg-[#FFF9E6] px-3 py-1.5 rounded-full">
              <RatingStars
                isStatic={true}
                defaultValue={productData?.rate}
                size="small"
              />
              <span className="text-xs font-medium text-[#B8860B]">
                {productData?.rate?.toFixed(1) || '0.0'}
              </span>
            </div>
            <span className="text-sm text-[#6C7275]">
              {productData?.comments?.length ?? 0} reviews
            </span>
          </div>

          {/* Title */}
          <h1
            className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#141718] leading-tight"
            data-aos="fade-up"
            data-aos-delay="50"
          >
            {productData.title}
          </h1>

          {/* Description */}
          <div data-aos="fade-up" data-aos-delay="100">
            <p className="text-[#6C7275] text-sm leading-relaxed">
              {productData.about_item ? (
                productData.about_item.length > PRODUCT_SNIPPET_CHAR_LIMIT ? (
                  <>
                    <span>
                      {showFullDescription
                        ? productData.about_item
                        : `${productData.about_item.slice(
                            0,
                            PRODUCT_SNIPPET_CHAR_LIMIT,
                          )}...`}
                    </span>
                    <button
                      onClick={() => setShowFullDescription((s) => !s)}
                      className="inline-flex items-center gap-1.5 ml-2 text-sm text-[#141718] font-semibold hover:text-[#3b3d3e] transition-colors cursor-pointer group"
                    >
                      <span className="border-b border-[#141718] group-hover:border-[#3b3d3e]">
                        {showFullDescription ? 'Show less' : 'Show more'}
                      </span>
                      <svg
                        className={`w-4 h-4 transition-transform duration-300 ${
                          showFullDescription ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  </>
                ) : (
                  productData.about_item
                )
              ) : null}
            </p>
          </div>

          {/* Price Section */}
          <div
            className="flex items-center gap-4 py-4 border-y border-gray-100"
            data-aos="fade-up"
            data-aos-delay="150"
          >
            <span className="text-3xl font-bold text-[#141718]">
              ${discountedPrice}
            </span>
            {discountPercent > 0 && (
              <>
                <span className="text-xl text-[#6C7275] line-through">
                  ${originalPrice}
                </span>
                <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                  Save $
                  {(Number(originalPrice) - Number(discountedPrice)).toFixed(2)}
                </span>
              </>
            )}
          </div>

          {/* Countdown Timer */}
          <div
            className="rounded-xl p-4"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <div className="flex items-center gap-2 mb-2">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-xs font-medium uppercase tracking-wide opacity-80">
                Limited Time Offer
              </span>
            </div>
            <CountdownTimer />
          </div>

          {/* Measurements */}
          {productData.package_dimensions && (
            <div
              className="flex items-center gap-4 p-4 bg-[#F9F9F9] rounded-xl"
              data-aos="fade-up"
              data-aos-delay="250"
            >
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <svg
                  className="w-6 h-6 text-[#141718]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs text-[#6C7275] uppercase tracking-wide font-medium">
                  Dimensions
                </p>
                <p className="text-[#141718] font-semibold mt-0.5">
                  {productData.package_dimensions}
                </p>
              </div>
            </div>
          )}

          {/* Quantity & Actions */}
          <div className="space-y-4" data-aos="fade-up" data-aos-delay="300">
            {/* Quantity Selector & Wishlist */}
            <div className="flex gap-3">
              {/* Quantity Selector */}
              <div className="flex items-center bg-[#F5F5F5] rounded-xl overflow-hidden">
                <button
                  className="w-12 h-12 flex items-center justify-center text-[#141718] hover:bg-[#E8E8E8] transition-colors disabled:opacity-40 cursor-pointer"
                  onClick={handleDecrease}
                  disabled={decLoading || cartQuantity === 0}
                  aria-label="Decrease quantity"
                >
                  {decLoading ? (
                    <CircularProgress size={16} sx={{ color: '#141718' }} />
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 12H4"
                      />
                    </svg>
                  )}
                </button>
                <span className="w-14 text-center font-bold text-[#141718] text-lg">
                  {cartQuantity}
                </span>
                <button
                  className="w-12 h-12 flex items-center justify-center text-[#141718] hover:bg-[#E8E8E8] transition-colors disabled:opacity-40 cursor-pointer"
                  onClick={handleIncrease}
                  disabled={incLoading}
                  aria-label="Increase quantity"
                >
                  {incLoading ? (
                    <CircularProgress size={16} sx={{ color: '#141718' }} />
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  )}
                </button>
              </div>

              {/* Wishlist Button */}
              <button
                className={`flex-1 flex items-center justify-center gap-2 rounded-xl border-2 py-3 px-4 font-medium transition-all duration-300 cursor-pointer disabled:opacity-50 ${
                  isWishlisted
                    ? 'bg-red-50 border-red-300 text-red-600 hover:bg-red-100'
                    : 'bg-white border-gray-200 text-[#141718] hover:border-[#141718] hover:shadow-md'
                }`}
                onClick={() => {
                  try {
                    handleAddWishlist(productData.id);
                  } catch (e) {
                    console.error('Add to wishlist failed', e);
                    route.push('/auth/signin');
                  }
                }}
                disabled={wishlistLoading}
                aria-pressed={isWishlisted}
              >
                {wishlistLoading ? (
                  <CircularProgress
                    size={18}
                    sx={{ color: isWishlisted ? '#dc2626' : '#141718' }}
                  />
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill={isWishlisted ? 'currentColor' : 'none'}
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    <span className="hidden sm:inline">
                      {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
                    </span>
                  </>
                )}
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={async () => {
                if (addingToCart) return;
                try {
                  setAddingToCart(true);
                  await addToCart(productData.id);
                } catch (e) {
                  console.error('Add to cart failed', e);
                } finally {
                  setAddingToCart(false);
                }
              }}
              disabled={addingToCart}
              className="w-full bg-[#141718] text-white rounded-xl py-4 font-semibold text-base hover:bg-[#2d3033] hover:shadow-lg transition-all duration-300 disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2 group"
            >
              {addingToCart ? (
                <CircularProgress size={20} sx={{ color: 'white' }} />
              ) : (
                <>
                  <svg
                    className="w-5 h-5 group-hover:scale-110 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          </div>

          {/* Product Meta Info */}
          <div
            className="pt-6 border-t border-gray-100 space-y-4"
            data-aos="fade-up"
            data-aos-delay="350"
          >
            {productData?.categories && productData.categories.length > 0 && (
              <div className="flex items-start gap-4">
                <span className="text-xs text-[#6C7275] uppercase tracking-wider font-medium w-20 shrink-0 pt-1.5">
                  Category
                </span>
                <div className="flex flex-wrap gap-2">
                  {productData.categories.map((category, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1.5 bg-[#F5F5F5] hover:bg-[#E8E8E8] text-[#141718] text-xs font-medium rounded-full transition-colors cursor-default"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {productData.item_model_number && (
              <div className="flex items-center gap-4">
                <span className="text-xs text-[#6C7275] uppercase tracking-wider font-medium w-20 shrink-0">
                  SKU
                </span>
                <code className="text-sm text-[#141718] font-mono bg-[#F5F5F5] px-3 py-1.5 rounded-lg">
                  {productData.item_model_number}
                </code>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Tabs Section */}
      <div className="mt-16">
        <ProductTabs productData={productData} />
      </div>
    </div>
  );
};

export default Product;
