export const dynamic = 'force-dynamic';

import { getProducts } from "@/actions/product-actions";
import { ListProducts, Greet } from "@/components";

export default async function Home() {
  const products = await getProducts();

  return (
    <>
      <Greet />
      <ListProducts products={products} />
    </>
  );
}
