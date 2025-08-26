import CartItem from './CartItem';

function CartItemsTable() {
  return (
    <div className='flex-1 mb-10 xl:max-w-[500px]'>
      <div className="w-full flex justify-between font-semibold py-5 border-b ">
        <div className='flex-4 xl:mr-10'>
          <p >Product</p>
        </div>
        <div className='flex-7 hidden xl:flex xl:justify-between'>
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
      </div>
    </div>
  );
}

export default CartItemsTable;
