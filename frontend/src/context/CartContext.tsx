'use client';
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { fetchWithAuth, getFirstTwoWords } from '../utils/helpers';
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
  products: any[];
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  decreaseFromCart: (productId: string) => Promise<void>;
  setSubtotal: (items: number) => void;
  setTotal: (items: number) => void;
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
  const [products, setProducts] = useState<[]>([]);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const resetCart = () => {
    setCart([]);
    setSubtotal(0);
    setTotal(0);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/product', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();

        setProducts(data.slice(0, 7));
      } catch (e: any) {
        console.error(e.message);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch('/api/cart', {
          method: 'GET',
        });
        if (!res?.ok) {
          const errorBody = await res?.json().catch(() => ({}));
          throw new Error(errorBody.message || 'Failed to update profile');
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
    };
    fetchCart();
  }, []);

  useEffect(() => {
    const subtotal = calculateSubtotalCart(cart);
    const total = calculateTotalCart(cart);

    setSubtotal(subtotal);
    setTotal(total);
  }, [cart]);

  const addToCart = async (productId: string, quantity: number = 1) => {
    try {
      const res = await fetchWithAuth(`/api/cart/${productId}`, {
        method: 'POST',
      });
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
  };

  const removeFromCart = async (productId: string) => {
    try {
      const res = await fetch(`/api/cart/${productId}`, { method: 'DELETE' });
      if (!res?.ok) throw new Error('Failed to remove from cart');

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
      const res = await fetchWithAuth(`/api/cart/${productId}`, {
        method: 'PATCH',
      });
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
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        subtotal,
        total,
        products,
        addToCart,
        removeFromCart,
        decreaseFromCart,
        setSubtotal,
        setTotal,
        resetCart,
        showToast,
      }}
    >
      {children}
      {toast && <Toast mes={toast} />}
    </CartContext.Provider>
  );
};
