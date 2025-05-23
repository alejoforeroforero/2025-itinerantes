'use client';

import { useEffect } from 'react';
import useStore from '@/store/store';

export const CartClearer = () => {
  const clearCart = useStore((state) => state.clearCart);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return null;
}; 