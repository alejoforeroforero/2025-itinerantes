import type { Metadata } from "next";
import { getProductDataBySlug } from "@/actions/product-actions";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const res = await getProductDataBySlug(slug);

  return {
    title: res.product?.nombre,
    description: res.product?.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const res = await getProductDataBySlug(slug);

  if (!res.product) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="p-8 bg-white shadow-lg rounded-lg">
          <h1 className="text-2xl font-bold text-red-600">Producto no encontrado</h1>
          <p className="mt-2 text-gray-600">No hemos encontrado el producto que estás buscando.</p>
        </div>
      </div>
    );
  }

  const { nombre, description, inStock, price, categorias } = res.product;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Product Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
          <h1 className="text-3xl font-bold text-white">{nombre}</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Product Image */}
          <div className="p-6 flex items-center justify-center">
            <svg 
              className="w-full max-w-md h-64 text-gray-300" 
              viewBox="0 0 280 280" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="280" height="280" fill="#f3f4f6" />
              <path 
                d="M140 50C89.5 50 49 90.5 49 141C49 191.5 89.5 232 140 232C190.5 232 231 191.5 231 141C231 90.5 190.5 50 140 50ZM96.5 196.5L82 182L120.5 143.5L140 163L179.5 123.5L194 138L140 192L96.5 196.5Z" 
                fill="#d1d5db" 
              />
              <path 
                d="M140 85C140 82.2386 142.239 80 145 80H165C167.761 80 170 82.2386 170 85V105C170 107.761 167.761 110 165 110H145C142.239 110 140 107.761 140 105V85Z" 
                fill="#d1d5db" 
              />
            </svg>
          </div>

          {/* Product Content */}
          <div className="p-6">
            {/* Description */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Descripción</h2>
              <p className="text-gray-600">{description || "Sin descripción disponible"}</p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 gap-6 mb-6">
              {/* Price */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Precio</h3>
                <div className="mt-1 text-2xl font-bold text-gray-900">
                  {price ? `$${price.toFixed(2)}` : "No disponible"}
                </div>
              </div>

              {/* Stock */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Disponibilidad</h3>
                <div className="mt-1 flex items-center">
                  {inStock && inStock > 0 ? (
                    <>
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-lg font-semibold text-gray-900">
                        {inStock} unidades disponibles
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                      <span className="text-lg font-semibold text-gray-900">Agotado</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Categories */}
            {categorias && categorias.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Categorías</h2>
                <div className="flex flex-wrap gap-2">
                  {categorias.map((categoria) => (
                    <span
                      key={categoria.id || Math.random().toString()}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {categoria.nombre}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Call to Action */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                disabled={!inStock || inStock <= 0}
                className={`flex-1 px-6 py-3 rounded-md font-medium ${
                  inStock && inStock > 0
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                    : "bg-gray-300 cursor-not-allowed text-gray-500"
                } transition-colors duration-200 text-center`}
              >
                Añadir al carrito
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}