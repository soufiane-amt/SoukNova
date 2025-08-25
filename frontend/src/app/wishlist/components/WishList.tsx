import { inter } from '@/layout';
import WishItem from './WishItem';

function WishList() {
  return (
    <div className="w-full md:ml-25 md:mt-0 mt-5">
      <div className="mb-5 mt-10">
        <p className={`${inter.className} font-semibold text-xl`}>
          Your Wishlist
        </p>
      </div>
      <div>
        <div className="text-sm text-[var(--color-primary)] border-b border-gray-300 pb-2">
          <p>Products</p>
        </div>
        <WishItem
          productName="uxcell Shredded"
          productImage="https://m.media-amazon.com/images/I/51i6LeHlc9L._SS522_.jpg"
          price={39.49}
        />
        <WishItem
          productName="uxcell Shredded"
          productImage="https://m.media-amazon.com/images/I/51i6LeHlc9L._SS522_.jpg"
          price={39.49}
        />
        <WishItem
          productName="uxcell Shredded"
          productImage="https://m.media-amazon.com/images/I/51i6LeHlc9L._SS522_.jpg"
          price={39.49}
        />
      </div>
    </div>
  );
}

export default WishList;
