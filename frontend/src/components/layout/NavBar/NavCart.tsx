function NavCart() {
  return (
    <div>
      <div>
        <p>Cart</p>
      </div>
      <div>
        <p>No Products In Cart</p>
      </div>
      <div className="">
        <div className="text-md flex justify-between py-4 border-b border-gray-200">
          <label>Subtotal</label>
          <p className="font-semibold">$37.49</p>
        </div>
        <div className="text-lg font-bold flex justify-between py-4">
          <label>Total</label>
          <p>$37.49</p>
        </div>
      </div>
      <div className="mt-5 md:mt-0">
        <button className="w-full bg-black text-white rounded-lg py-2 cursor-pointer font-semibold md:px-5">
          Checkout
        </button>
      </div>
    </div>
  );
}

export default NavCart;
