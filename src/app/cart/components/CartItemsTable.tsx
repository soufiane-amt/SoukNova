import CartItem from './CartItem';

function CartItemsTable() {
  return (
    <div>
      <div className="w-full flex justify-between font-semibold py-5 border-b ">
        <div className='flex-4 md:mr-10'>
          <p >Product</p>
        </div>
        <div className='flex-7 hidden md:flex md:justify-between'>
          <p className="max-sm:hidden">Quantity</p>
          <p className="max-sm:hidden">Price</p>
          <p className="max-sm:hidden">Subtotal</p>
        </div>
      </div>
      <div>
        <CartItem
          productName="uxcell Shredded"
          productImage="https://m.media-amazon.com/images/I/51i6LeHlc9L._SS522_.jpg"
          price={39.49}
        />
        <CartItem
          productName="uxcell Shredded"
          productImage="https://m.media-amazon.com/images/I/51i6LeHlc9L._SS522_.jpg"
          price={39.49}
        />
        <CartItem
          productName="uxcell Shredded"
          productImage="https://m.media-amazon.com/images/I/51i6LeHlc9L._SS522_.jpg"
          price={39.49}
        />
      </div>
    </div>
  );
}

export default CartItemsTable;
