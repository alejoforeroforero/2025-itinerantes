'use client';

import { Producto } from "@prisma/client";
import { useState, useEffect } from "react";
import useStore from "@/store/store";

interface StockDisplayProps {
  product: Producto;
}

export function StockDisplay({ product }: StockDisplayProps) {
  const [currentStock, setCurrentStock] = useState(product.inStock || 0);
  const products = useStore((state) => state.products);

  useEffect(() => {
    const productInCart = products.find(p => p.id === product.id);
    if (productInCart) {
      setCurrentStock(product.inStock! - productInCart.quantity);
    } else {
      setCurrentStock(product.inStock || 0);
    }
  }, [products, product]);

  return (
    <div className="mt-1 flex items-center">
      {currentStock > 0 ? (
        <>
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <span className="text-lg font-semibold text-[var(--primary)]">
            {currentStock} {currentStock === 1 ? 'unidad disponible' : 'unidades disponibles'}
          </span>
        </>
      ) : (
        <>
          <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
          <span className="text-lg font-semibold text-[var(--primary)]">Agotado</span>
        </>
      )}
    </div>
  );
} 