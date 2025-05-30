import type { Metadata } from "next";
import { getProductDataBySlug } from "@/actions/product-actions";
import Image from "next/image";
import { DEFAULT_IMAGE } from "@/config/defaults";
import { AddToCartButton } from "@/components/website/cart/AddToCartButton";
import Link from "next/link";
import { StockDisplay } from "@/components/website/product/StockDisplay";
import { formatCurrency } from '@/utils/format'

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
      <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
        {/* Product Header */}
        <div className="bg-[var(--primary)]/5 border-b border-gray-100 px-6 py-4">
          <h1 className="text-3xl font-bold text-[var(--primary)]">{nombre}</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Product Image */}
          <div className="p-6 flex items-center justify-center">
            <div className="relative w-full max-w-md h-64">
              <Image
                src={DEFAULT_IMAGE}
                alt={nombre}
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* Product Content */}
          <div className="p-6">
            {/* Description */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-[var(--primary)] mb-2">Descripción</h2>
              <p className="text-[var(--secondary)]">{description || "Sin descripción disponible"}</p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 gap-6 mb-6">
              {/* Price */}
              <div className="bg-[var(--background)] p-4 rounded-lg border border-gray-100">
                <h3 className="text-sm font-medium text-[var(--secondary)]">Precio</h3>
                <div className="mt-1 text-2xl font-bold text-[var(--primary)]">
                  {price ? `$${formatCurrency(price)}` : "No disponible"}
                </div>
              </div>

              {/* Stock */}
              <div className="bg-[var(--background)] p-4 rounded-lg border border-gray-100">
                <h3 className="text-sm font-medium text-[var(--secondary)]">Disponibilidad</h3>
                <StockDisplay product={res.product} />
              </div>
            </div>

            {/* Categories */}
            {categorias && categorias.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-[var(--primary)] mb-2">Categorías</h2>
                <div className="flex flex-wrap gap-2">
                  {categorias.map((categoria) => (
                    <Link
                      key={categoria.id || Math.random().toString()}
                      href={`/categoria/${categoria.nombre.toLowerCase().replace(/\s+/g, '-')}`}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[var(--background)] text-[var(--primary)] border border-gray-100 hover:bg-[var(--primary)]/5 transition-colors duration-200"
                    >
                      {categoria.nombre}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Call to Action */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <AddToCartButton 
                product={res.product}
                disabled={!inStock || inStock <= 0}
                className={`flex-1 px-6 py-3 rounded-md font-medium ${
                  inStock && inStock > 0
                    ? "bg-[var(--primary)] hover:bg-[var(--accent)] text-white cursor-pointer"
                    : "bg-gray-300 cursor-not-allowed text-gray-500"
                } transition-colors duration-200 text-center`}
              >
                Añadir al carrito
              </AddToCartButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}