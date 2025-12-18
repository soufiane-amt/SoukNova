'use client';
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { getFirstTwoWords } from '../utils/helpers';
import Toast from '../components/ui/Toast';

const calculateSubtotalCart = (cart: CartItemType[]) => {
  return cart.reduce((accumulator, currentItem) => {
    return accumulator + currentItem.price * currentItem.quantity;
  }, 0);
};

const calculateTotalCart = (cart: CartItemType[]) => {
  return cart.reduce((accumulator, currentItem) => {
    const { price, quantity, discount } = currentItem;
    let total = price * quantity;
    if (discount) total = total - total * (discount / 100);
    return accumulator + total;
  }, 0);
};

export interface CartItemType {
  productId: string;
  productName: string;
  image: string;
  price: number;
  quantity: number;
  discount: number;
}

interface CartContextType {
  cart: CartItemType[];
  subtotal: number;
  total: number;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  decreaseFromCart: (productId: string) => Promise<void>;
  resetCart: () => void;
  showToast: (msg: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItemType[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, []);

  const resetCart = useCallback(() => {
    setCart([]);
  }, []);

  const fetchCart = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!res?.ok) {
        return;
      }
      const data = await res?.json();
      setCart(
        data.map((product: any) => ({
          ...product,
          productName: getFirstTwoWords(product.productName),
        })),
      );
    } catch (err: any) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const subtotal = useMemo(() => calculateSubtotalCart(cart), [cart]);
  const total = useMemo(() => calculateTotalCart(cart), [cart]);

  const addToCart = useCallback(
    async (productId: string, quantity: number = 1) => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/cart/${productId}`,
          {
            method: 'POST',
            credentials: 'include',
          },
        );
        if (!res?.ok) throw new Error('Failed to add to cart');
        const item: CartItemType = await res?.json();

        setCart((prev) => {
          const existing = prev.find((i) => i.productId === productId);
          if (existing) {
            return prev.map((i) =>
              i.productId === productId
                ? { ...i, quantity: i.quantity + quantity }
                : i,
            );
          }
          return [...prev, { ...item, quantity }];
        });
        showToast('Item added to cart!');
      } catch (err) {
        console.error(err);
      }
    },
    [showToast],
  );

  const removeFromCart = useCallback(async (productId: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cart/${productId}`,
        { method: 'DELETE', credentials: 'include' },
      );
      if (!res?.ok) throw new Error('Failed to remove from cart');

      setCart((prev) => prev.filter((i) => i.productId !== productId));
    } catch (err) {
      console.error(err);
    }
  }, []);

  const decreaseFromCart = useCallback(async (productId: string) => {
      console.log("cart : ", cart)
    
    const quantity =
      cart.find((item) => item.productId === productId)?.quantity || 0;
      console.log("quantity : ", quantity)
      console.log("productId : ", productId)
    if (quantity < 1) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cart/${productId}`,
        {
          method: 'PATCH',
          credentials: 'include',
        },
      );
      if (!res?.ok) throw new Error('Failed to update cart');

      if (quantity > 1)
        setCart((prev) =>
          prev.map((i) =>
            i.productId === productId ? { ...i, quantity: i.quantity - 1 } : i,
          ),
        );
      else setCart((prev) => prev.filter((i) => i.productId !== productId));
    } catch (err) {
      console.error(err);
    }
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        subtotal,
        total,
        addToCart,
        removeFromCart,
        decreaseFromCart,
        resetCart,
        showToast,
      }}
    >
      {children}
      {toast && <Toast mes={toast} />}
    </CartContext.Provider>
  );
};
