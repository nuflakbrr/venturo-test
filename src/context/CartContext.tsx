import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';

import { ItemCart } from '@/interfaces/itemCart';

type ContextType = {
  carts?: ItemCart[] | any;
  addItem: ({ id, gambar, nama, harga, catatan }: ItemCart) => void;
  addNotes: (id: number, catatan: string) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
};

const defaultValue: ContextType = {
  addItem: () => null,
  addNotes: () => null,
  removeItem: () => null,
  clearCart: () => null,
};

const CartContext = createContext<ContextType>(defaultValue);

export const CartProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [carts, setCart] = useState<ItemCart[] | undefined>(undefined);

  const addItem = useCallback((item: ItemCart) => {
    setCart((prev) => {
      if (prev) {
        return [...prev, item];
      }

      return [item];
    });
  }, []);

  const addNotes = useCallback((id: number, catatan: string) => {
    setCart((prev) => {
      if (prev) {
        return prev.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              catatan,
            };
          }

          return item;
        });
      }

      return [];
    });
  }, []);

  const removeItem = useCallback((id: number) => {
    setCart((prev) => {
      if (prev) {
        return prev.filter((item) => item.id !== id);
      }

      return [];
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart(undefined);
    localStorage.removeItem('cart');
  }, []);

  useEffect(() => {
    const data = localStorage.getItem('cart');

    if (data) {
      setCart(JSON.parse(data));
    }
  }, []);

  useEffect(() => {
    if (carts) {
      localStorage.setItem('cart', JSON.stringify(carts));
    }
  }, [carts]);

  return (
    <CartContext.Provider
      value={{
        carts,
        addItem,
        addNotes,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
