'use client';
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';

export interface CartItem {
  productId: string;
  productName: string;
  image: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  decreaseFromCart: (productId: string) => Promise<void>;
  setCart: (items: CartItem[]) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from backend when app starts
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch('/api/cart', {
          method: 'GET',
        });
        if (!res.ok) {
          const errorBody = await res.json().catch(() => ({}));
          throw new Error(errorBody.message || 'Failed to update profile');
        }
        const data = await res.json();
        setCart(data);
        console.log('data : ', data);
      } catch (err: any) {
        console.error(err);
      }
    };
    fetchCart();
  }, []);

  const addToCart = async (productId: string, quantity: number = 1) => {
    try {
      const res = await fetch(`/api/cart/${productId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Failed to add to cart');
      const item: CartItem = await res.json();

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
    } catch (err) {
      console.error(err);
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      const res = await fetch(`/api/cart/${productId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to remove from cart');

      setCart((prev) => prev.filter((i) => i.productId !== productId));
    } catch (err) {
      console.error(err);
    }
  };

  const decreaseFromCart = async (productId: string) => {
    const quantity =
      cart.find((item) => item.productId === productId)?.quantity || 0;
    if (quantity < 1) return;
    try {
      const res = await fetch(`/api/cart/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Failed to update cart');

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
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, decreaseFromCart, setCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
