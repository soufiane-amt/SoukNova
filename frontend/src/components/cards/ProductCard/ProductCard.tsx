import { Typography } from '@mui/material';
import Image from 'next/image';
import RatingStars from '../../inputs/RatingStars';
import { poppins } from '@/layout';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useRouter } from 'next/navigation';
import { useCart } from '../../../context/CartContext';
import React, { useState } from 'react';
import { CircularProgress } from '@mui/material';

function getFirstTwoWords(title: string) {
  const words = title.split(' ');
  if (words.length >= 2) {
    return `${words[0]} ${words[1]}`;
  }
  return title;
}

function isProductNew(productDateString: string) {
  const today = new Date();
  const productDate = new Date(productDateString);
  const differenceInTime = today.getTime() - productDate.getTime();
  const differenceInDays = differenceInTime / (1000 * 3600 * 24);
  const daysThreshold = 365;
  return differenceInDays <= daysThreshold;
}

interface LikeButtonProps {
  productId: string;
}
const LikeButton = ({ productId }: LikeButtonProps) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast } = useCart();

  const handleAddWishlist = async (productId: string) => {
    if (loading) return;
    setIsWishlisted(true);
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/wishlist/${productId}`,
        {
          method: 'POST',
          credentials: 'include',
        },
      );

      if (!res?.ok) {
        setIsWishlisted(false);
        showToast('Failed to add to wishlist');
        return;
      }

      showToast('Item added to wishlist!');
    } catch (err) {
      setIsWishlisted(false);
      console.error(err);
      showToast('Failed to add to wishlist');
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleAddWishlist(productId);
  };

  return (
    <button
      className="rounded-full bg-white p-1 shadow-lg cursor-pointer"
      onClick={handleClick}
      aria-pressed={isWishlisted}
      disabled={loading}
    >
      {loading ? (
        <div className="px-0.5">
          <CircularProgress
            size={20}
            sx={{ color: isWishlisted ? 'red' : 'black' }}
          />
        </div>
      ) : isWishlisted ? (
        <FavoriteIcon className="text-red-500" />
      ) : (
        <FavoriteBorderOutlinedIcon />
      )}
    </button>
  );
};

interface ProductCardProps {
  productId: string;
  productName: string;
  currentPrice: number;
  originalPrice?: number;
  discountPercentage?: number;
  rating: number;
  image: string | undefined;
  date: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  productId,
  productName,
  currentPrice,
  originalPrice,
  discountPercentage,
  rating,
  image,
  date,
}) => {
  const { addToCart } = useCart();

  productName = getFirstTwoWords(productName);
  const isNew = isProductNew(date);
  const route = useRouter();
  if (!image) return <></>;
  const handleClickProduct = () => {
    route.push(`/product/${productId}`);
  };

  const [adding, setAdding] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (adding) return;
    try {
      setAdding(true);
      await addToCart(productId);
    } catch (err) {
      console.error('Add to cart failed', err);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div
      className="w-[300px] flex-shrink-0 cursor-pointer mb-5"
      onClick={handleClickProduct}
    >
      <div className="relative group bg-[#f4f4f4] w-full h-[349px] flex items-center justify-center">
        <Image
          src={image}
          alt={`${productName}`}
          width={500}
          height={349}
          className=" h-1/2 w-[60%]"
          style={{ mixBlendMode: 'multiply' }}
        />
        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {isNew && (
            <Typography className="rounded flex justify-center !text-md !font-bold !bg-[#FFFFFF] px-3  ">
              NEW
            </Typography>
          )}
          {discountPercentage && (
            <Typography className="rounded px-3 !text-md bg-[#38CB89] text-white !font-bold">
              -{discountPercentage}%
            </Typography>
          )}
        </div>
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500">
          <LikeButton productId={productId} />
        </div>
        <div className="absolute bottom-4 w-[90%] opacity-0 cursor-pointer group-hover:opacity-100 transition-all duration-500">
          <button
            onClick={handleAddToCart}
            className="w-full bg-black text-white rounded-lg py-2 cursor-pointer font-semibold flex items-center justify-center"
            data-aos="zoom-in"
            data-aos-delay="500"
            disabled={adding}
          >
            {adding ? (
              <CircularProgress size={25} sx={{ color: 'white' }} />
            ) : (
              'Add To Cart'
            )}
          </button>
        </div>
      </div>
      <div className="mt-3">
        <RatingStars isStatic={true} defaultValue={rating} />
        <div className="mb-1">
          <p className={`font-medium ${poppins.className}`}>{productName}</p>
        </div>
        <div className="flex gap-4">
          <Typography className="!font-semibold  !text-sm !overflow-hidden !text-ellipsis">
            ${Number(currentPrice).toFixed(2)}
          </Typography>
          {originalPrice && (
            <Typography className="text-color-primary line-through !text-sm">
              ${Number(originalPrice).toFixed(2)}
            </Typography>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProductCard);
