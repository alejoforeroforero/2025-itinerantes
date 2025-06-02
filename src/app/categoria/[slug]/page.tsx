import type { Metadata } from "next";
import { getCategoryWithProductsInfo } from "@/actions/category-actions";
import { ListProducts, Pagination } from "@/components";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const res = await getCategoryWithProductsInfo(slug);

  if (!res.category) {
    return {
      title: 'Categoría no encontrada',
    };
  }

  return {
    title: res.category.nombre,
    description: `Explora nuestra colección de ${res.category.nombre} - ${res.category.productos.length} productos disponibles`,
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page) || 1;
  const productsPerPage = 10;

  const res = await getCategoryWithProductsInfo(slug);

  if (!res.category) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <h1 className="text-2xl font-bold text-red-600">Categoría no encontrada</h1>
      </div>
    );
  }

  const products = res.category.productos;
  const totalProducts = products.length;
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  const startIndex = (page - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const paginatedProducts = products.slice(startIndex, endIndex);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-[var(--primary)] mb-6">{res.category.nombre}</h1>
      <ListProducts products={paginatedProducts} />
      <Pagination 
        currentPage={page} 
        totalPages={totalPages} 
        baseUrl={`/categoria/${slug}`}
      />
    </div>
  );
}
