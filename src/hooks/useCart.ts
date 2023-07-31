import { useContext } from 'react';

import CartContext from '@/context/CartContext';

export const useCart = () => {
  const cartContext = useContext(CartContext);

  return cartContext;
};
