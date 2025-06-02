"use client";

import Link from "next/link";
import useStore from "@/store/store";
import Image from "next/image";
import { formatCurrency } from '@/utils/format'
import { DEFAULT_IMAGE } from "@/config/defaults";
import { getValidImageUrl } from '@/utils/format';
import { useState } from 'react';

interface Categoria {
  id: string;
  nombre: string;
  slug: string;
}

interface Product {
  id: string;
  nombre: string;
  description: string | null;
  slug: string;
  price: number | null;
  inStock: number | null;
  categorias?: Categoria[];
  images?: string[];
}

interface ListProductsProps {
  products: Product[];
}

export function ListProducts({ products }: ListProductsProps) {
  const cartProducts = useStore((state) => state.products);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const handleAddToCart = (product: Product) => {
    if (product.price === null || product.inStock === null || product.inStock <= 0) return;
    
    const productCart = {
      id: product.id,
      name: product.nombre,
      price: product.price,
      quantity: 1,
      stock: product.inStock,
      images: product.images || []
    };
    
    useStore.getState().addProduct(productCart);
  };

  const getAvailableStock = (product: Product) => {
    const cartProduct = cartProducts.find(p => p.id === product.id);
    if (!cartProduct) return product.inStock || 0;
    return (product.inStock || 0) - cartProduct.quantity;
  };

  const handleImageError = (productId: string) => {
    setImageErrors(prev => new Set(prev).add(productId));
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
          <div className="w-full h-48 relative">
            <Image
              src={imageErrors.has(product.id) ? DEFAULT_IMAGE : getValidImageUrl(product.images?.[0], DEFAULT_IMAGE)}
              alt={product.nombre}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={() => handleImageError(product.id)}
            />
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              <Link className="cursor-pointer" href={`/producto/${product.slug}`}>{product.nombre}</Link>
            </h3>
            {product.description && (
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {product.description}
              </p>
            )}

            <div className="space-y-2">
              {product.price !== undefined && product.price !== null && (
                <p className="text-lg font-bold text-[var(--primary)]">
                  ${formatCurrency(product.price)}
                </p>
              )}

              {product.inStock !== undefined && (
                <p className="text-sm text-gray-500">
                  Stock: {getAvailableStock(product)} unidades
                </p>
              )}

              {product.categorias && product.categorias.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.categorias.map((categoria) => (
                    <span
                      key={categoria.id}
                      className="px-2 py-1 bg-[var(--background)] text-[var(--primary)] text-xs rounded-full border border-gray-100"
                    >
                      <Link className="cursor-pointer" href={`/categoria/${categoria.slug}`}>
                        {" "}
                        {categoria.nombre}
                      </Link>
                    </span>
                  ))}
                </div>
              )}
              {getAvailableStock(product) > 0 && (
                <div className="mt-3">
                  <button
                    onClick={() => {
                      handleAddToCart(product);
                    }}
                    className="w-full py-2 px-4 bg-[var(--primary)] hover:bg-[var(--accent)] text-white font-medium rounded-lg transition-colors duration-200 cursor-pointer"
                  >
                    Agregar producto
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
