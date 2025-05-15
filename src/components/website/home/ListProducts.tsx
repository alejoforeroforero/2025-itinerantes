"use client";

import Link from "next/link";
import useStore from "@/store/store";

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
}

interface ListProductsProps {
  products: Product[];
}

export function ListProducts({ products }: ListProductsProps) {
  const handleAddToCart = (product: Product) => {
    if (product.price === null) return;
    
    const productCart = {
      id: product.id,
      name: product.nombre,
      price: product.price,
      quantity: 1,
    };
    
    useStore.getState().addProduct(productCart);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
          <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
            <svg
              className="w-24 h-24 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
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
                <p className="text-lg font-bold text-blue-600">
                  ${product.price.toFixed(2)}
                </p>
              )}

              {product.inStock !== undefined && (
                <p className="text-sm text-gray-500">
                  Stock: {product.inStock} unidades
                </p>
              )}

              {product.categorias && product.categorias.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.categorias.map((categoria) => (
                    <span
                      key={categoria.id}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      <Link className="cursor-pointer" href={`/categoria/${categoria.slug}`}>
                        {" "}
                        {categoria.nombre}
                      </Link>
                    </span>
                  ))}
                </div>
              )}
              {product.inStock !== undefined &&
                product.inStock !== null &&
                product.inStock > 0 && (
                  <div className="mt-3">
                    <button
                      onClick={() => {
                        handleAddToCart(product);
                      }}
                      className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 cursor-pointer"
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
