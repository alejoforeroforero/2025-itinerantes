import Image from "next/image";
import { PrismaClient } from "@prisma/client";

// Initialize Prisma Client
const prisma = new PrismaClient();

// Fetch products from database
async function getProducts() {
  try {
    const products = await prisma.producto.findMany({
      include: {
        categorias: true,
      },
    });
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Our Products
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Discover our wide range of high-quality products
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            const isOutOfStock = !product.inStock || product.inStock <= 0;
            
            return (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                    <Image
                      src="/product-logo.svg"
                      alt={product.nombre}
                      width={100}
                      height={100}
                      className="opacity-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {product.categorias.map((categoria) => (
                        <span
                          key={categoria.id}
                          className="text-sm text-indigo-600 font-medium"
                        >
                          {categoria.nombre}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {product.nombre}
                    </h3>
                    <p className="text-gray-600">{product.description}</p>
                    <div className="flex items-center justify-between pt-4">
                      <span className="text-2xl font-bold text-gray-900">
                        ${product.price?.toFixed(2)}
                      </span>
                      <div className="flex items-center gap-4">
                        <span className={`text-sm ${isOutOfStock ? 'text-red-500' : 'text-gray-500'}`}>
                          {isOutOfStock ? 'Out of Stock' : `${product.inStock} in stock`}
                        </span>
                        <button 
                          className={`px-4 py-2 rounded-md transition-colors duration-300 ${
                            isOutOfStock 
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                              : 'bg-indigo-600 text-white hover:bg-indigo-700'
                          }`}
                          disabled={isOutOfStock}
                        >
                          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
