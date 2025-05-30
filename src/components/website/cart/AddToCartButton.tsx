'use client';

import useStore from "@/store/store";
import { Producto } from "@prisma/client";
import { useState } from "react";

interface AddToCartButtonProps {
  product: Producto;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

interface ProductCart {
  id: string;
  name: string;
  price: number;
  quantity: number;
  stock: number;
}

export function AddToCartButton({ product, disabled, className, children }: AddToCartButtonProps) {
  const addProduct = useStore((state) => state.addProduct);
  const [currentStock, setCurrentStock] = useState(product.inStock || 0);

  const handleAddToCart = () => {
    if (currentStock > 0) {
      const productCart: ProductCart = {
        id: product.id,
        name: product.nombre,
        price: product.price || 0,
        quantity: 1,
        stock: currentStock
      };
      addProduct(productCart);
      setCurrentStock(prev => prev - 1);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={disabled || currentStock <= 0}
      className={className}
    >
      {children}
    </button>
  );
} 