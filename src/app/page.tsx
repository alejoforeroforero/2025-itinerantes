import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Inicio',
  description: 'Bienvenido a Itinerantes - Tu tienda de productos artesanales y únicos',
};

export const dynamic = 'force-dynamic';

import { getProducts } from "@/actions/product-actions";
import { ListProducts } from "@/components";
import { Pagination } from "@/components/website/products/Pagination";

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function Home({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const page = Number(resolvedParams.page) || 1;
  const productsPerPage = 10;
  
  const products = await getProducts();
  const totalProducts = products.length;
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  
  const startIndex = (page - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const paginatedProducts = products.slice(startIndex, endIndex);

  return (
    <div className="space-y-8">
      <ListProducts products={paginatedProducts} />
      <Pagination 
        currentPage={page} 
        totalPages={totalPages} 
        baseUrl="/"
      />
    </div>
  );
}
