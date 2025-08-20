'use client';
import React, { useEffect, useState } from 'react';
import Carousel from 'react-material-ui-carousel';
import { Typography } from '@mui/material';
import { useParams, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';

import Image from 'next/image';
import RatingStars from '../../../components/ui/RatingStars';
import CountdownTimer from '../../../components/ui/CountDownTimer';
import { Review } from '../../../components/ui/Review';
import EastIcon from '@mui/icons-material/East';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import CircularIndeterminate from '../../../components/ui/CircularIndeterminate';

// Centralized animation variants for cleaner code
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Stagger all children
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

const popIn = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      damping: 12,
      stiffness: 100,
    },
  },
};

const imagePop = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

interface TraversalProps {
  productName: string;
}

const Traversal = ({ productName }: TraversalProps) => {
  return (
    <motion.div
      className="flex min-h-5 items-center gap-4 font-inter text-sm font-medium text-[#605F5F] max-sm:text-xs py-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="flex-shrink-0 overflow-hidden"
        variants={itemVariants}
      >
        <div>
          <a className="flex items-center gap-1" href="/">
            <p className="text-nowrap font-inter text-sm font-medium">Home</p>
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 512 512"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M294.1 256L167 129c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.3 34 0L345 239c9.1 9.1 9.3 23.7.7 33.1L201.1 417c-4.7 4.7-10.9 7-17 7s-12.3-2.3-17-7c-9.4-9.4-9.4-24.6 0-33.9l127-127.1z"></path>
            </svg>
          </a>
        </div>
      </motion.div>
      <motion.div
        className="flex-shrink-0 overflow-hidden"
        variants={itemVariants}
      >
        <div>
          <a className="flex items-center gap-1" href="/shop">
            <p className="text-nowrap font-inter text-sm font-medium">Shop</p>
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 512 512"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M294.1 256L167 129c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.3 34 0L345 239c9.1 9.1 9.3 23.7.7 33.1L201.1 417c-4.7 4.7-10.9 7-17 7s-12.3-2.3-17-7c-9.4-9.4-9.4-24.6 0-33.9l127-127.1z"></path>
            </svg>
          </a>
        </div>
      </motion.div>
      <motion.div
        className="flex items-center gap-1 truncate font-inter text-sm font-medium text-black"
        variants={itemVariants}
      >
        <div>
          <p className="text-nowrap font-inter text-sm font-medium">
            {productName}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

interface ThumbnailListProps {
  images: string[];
  activeImage: string;
  onSelectImage: (image: string) => void;
}

const ThumbnailList: React.FC<ThumbnailListProps> = ({
  images,
  activeImage,
  onSelectImage,
}) => {
  return (
    <motion.div
      className="flex justify-center mt-4 space-x-2"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {images.map((image, index) => (
        <motion.div
          key={index}
          className={`cursor-pointer border-2 p-1 rounded-md ${
            activeImage === image.trim()
              ? 'border-blue-500'
              : 'border-transparent'
          }`}
          onClick={() => onSelectImage(image.trim())}
          variants={popIn}
        >
          <Image
            src={image.trim()}
            alt={`Thumbnail ${index + 1}`}
            width={70}
            height={70}
            className="rounded-md"
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

const ReviewsSort = () => {
  const [sortOption, setSortOption] = React.useState('newest');

  const handleChange = (event: SelectChangeEvent) => {
    setSortOption(event.target.value as string);
  };

  return (
    <Box
      sx={{
        minWidth: 150,
        marginTop: 3,
        borderColor: 'black',
      }}
    >
      <FormControl fullWidth>
        <Select
          value={sortOption}
          onChange={handleChange}
          sx={{
            fontSize: '1.2rem',
            borderRadius: '8px',
            height: '56px',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#141718',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#141718',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#141718',
            },
          }}
        >
          <MenuItem value="all">All reviews</MenuItem>
          <MenuItem value="newest">Newest</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

// Helper functions remain the same
function isProductNew(productDateString: string) {
  const today = new Date();
  const productDate = new Date(productDateString);
  const differenceInTime = today.getTime() - productDate.getTime();
  const differenceInDays = differenceInTime / (1000 * 3600 * 24);
  const daysThreshold = 365;
  return differenceInDays <= daysThreshold;
}

function getFirstTwoWords(title: string) {
  const words = title.split(' ');
  if (words.length >= 2) {
    return `${words[0]} ${words[1]}`;
  }
  return title;
}

function getDiscountedPrice(price: number, discount: number): number {
  const discountedPrice = price - (price * discount) / 100;
  return parseFloat(discountedPrice.toFixed(2));
}

const SUPABASE_URL = 'https://oowcjcmdcfitnnsqfohw.supabase.co/rest/v1';
const API_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vd2NqY21kY2ZpdG5uc3Fmb2h3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA4MTI3MTksImV4cCI6MjA0NjM4ODcxOX0.bx4a1dNx8g-BZX2KWceWBuRlPwAqgxhZ80i7L4K8M7Y';

export default function ProductPage() {
  const { id } = useParams();
  const [productData, setProductData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `${SUPABASE_URL}/products?select=*&id=eq.${id}`,
          {
            headers: {
              apikey: API_KEY,
              Authorization: `Bearer ${API_KEY}`,
              Accept: 'application/json',
            },
          },
        );
        if (!response.ok) {
          throw new Error('Failed to fetch product data.');
        }

        const data = await response.json();
        if (data.length > 0) {
          setProductData(data[0]);
        } else {
          setProductData(null);
        }
      } catch (err) {
        setError('Product not found or failed to load.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <CircularIndeterminate />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="mx-10 lg:mx-30">
      <Product productData={productData} />
    </div>
  );
}

interface ProductImageProps {
  image: string;
  isNew: boolean;
}

const ProductImage: React.FC<ProductImageProps> = ({ image, isNew }) => {
  return (
    <motion.div
      className="relative bg-[#f4f4f4] h-[649px] flex items-center justify-center"
      variants={imagePop}
      initial="hidden"
      animate="visible"
    >
      <Image
        src={image}
        alt={`${image}`}
        width={500}
        height={349}
        className=""
        style={{ mixBlendMode: 'multiply' }}
      />
      <div className="absolute left-3 top-3 flex flex-col gap-2">
        {isNew && (
          <Typography className="rounded flex justify-center !text-md !font-bold !bg-[#FFFFFF] px-3">
            NEW
          </Typography>
        )}
      </div>
    </motion.div>
  );
};

interface ProductProps {
  productData: any;
}

const Product: React.FC<ProductProps> = ({ productData }) => {
  const [quantity, setQuantity] = useState(0);
  const [activeImage, setActiveImage] = useState(
    productData?.images?.[0]?.trim() || '',
  );
  const searchParams = useSearchParams();
  const categoryValue = searchParams.get('category');

  useEffect(() => {
    setActiveImage(productData?.images?.[0]?.trim() || '');
  }, [productData]);

  const handleSelectImage = (image: string) => {
    setActiveImage(image.trim());
  };

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };
  const decreaseQuantity = () => {
    if (quantity > 0) setQuantity((prev) => prev - 1);
  };

  return (
    <motion.div
      key={productData.id} // Re-run animations on product change
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Traversal
        category={categoryValue || ''}
        productName={productData.title}
      />
      <div className="lg:flex w-full">
        <motion.div
          className="mb-10 lg:mr-15 lg:w-[500px]"
          variants={itemVariants}
        >
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
        </motion.div>
        <div className="lg:w-[508px]">
          <motion.div variants={itemVariants} className="flex flex-col gap-2">
            <motion.div
              className="flex items-start space-x-2 w-"
              variants={itemVariants}
            >
              <RatingStars isStatic={true} defaultValue={productData?.Rate} />
              <Typography sx={{ fontSize: '0.675rem' }}>
                <span>{productData?.reviews?.length ?? 0}</span> Reviews
              </Typography>
            </motion.div>
            <motion.div variants={itemVariants}>
              <p
                className={`text-[40px] font-medium`}
                style={{ fontFamily: 'var(--font-poppins), sans-serif' }}
              >
                {getFirstTwoWords(productData.title)}
              </p>
              <p className="max-h-[78px] w-full overflow-hidden text-ellipsis text-wrap font-inter leading-[26px] text-[var(--color-primary)] text-sm">
                {productData.about_item}
              </p>
            </motion.div>
          </motion.div>
          <motion.div variants={itemVariants}>
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
          </motion.div>

          <motion.div className="flex space-x-8 mt-5" variants={itemVariants}>
            <div className="bg-[#F5F5F5] flex-1 flex justify-around items-center font-bold rounded-lg">
              <button className="cursor-pointer" onClick={decreaseQuantity}>
                -
              </button>
              <span>{quantity}</span>
              <button className="cursor-pointer" onClick={increaseQuantity}>
                +
              </button>
            </div>
            <button className="w-full rounded-lg bg-white border flex items-center justify-center space-x-2 flex-2 py-3 cursor-pointer">
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
          </motion.div>
          <motion.div
            className="w-full mt-5 border-b border-gray-300 pb-5"
            variants={itemVariants}
          >
            <motion.button
              onClick={increaseQuantity}
              className="w-full bg-black text-white rounded-lg py-4 cursor-pointer font-semibold"
              variants={popIn}
            >
              Add To Cart
            </motion.button>
          </motion.div>
          <motion.div
            className="flex items-center gap-[58px] my-15"
            variants={itemVariants}
          >
            <p className="w-[65px] text-[var(--color-primary)]">CATEGORY</p>
            <p>
              {Array.isArray(productData.categoriesText)
                ? productData.categoriesText.map((c) => `{${c}}`).join(', ')
                : productData.categoriesText || ''}
            </p>
          </motion.div>
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
        <div className="flex space-x-4 mt-5">
          <RatingStars isStatic={true} defaultValue={productData.Rate} />
          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
            <span>{productData?.reviews?.length ?? 0}</span> Reviews
          </Typography>
        </div>
      </div>
      <div className="border flex justify-between items-center px-5 py-2 rounded-lg border-gray-400 mt-6">
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
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {productData.reviews.map((item: any, index: number) => (
          <motion.div key={index} variants={itemVariants}>
            <Review
              name={item.name}
              image={item.avatar}
              rate={item.rate}
              comment={item.comments}
            />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};
