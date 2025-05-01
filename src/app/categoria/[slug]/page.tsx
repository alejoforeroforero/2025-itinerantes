import type { Metadata } from "next";
import { getCategoryWithProductsInfo } from "@/actions/category-actions";
import { ListProducts } from "@/components";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const res = await getCategoryWithProductsInfo(slug);

  return {
    title: res.category?.nombre,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const res = await getCategoryWithProductsInfo(slug);

  return (
    <>
      <h2>{res.category?.nombre}</h2>
      <ListProducts products={res.category?.productos ?? []} />
    </>
  );
}
