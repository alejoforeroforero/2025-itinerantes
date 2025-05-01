export const dynamic = 'force-dynamic';

import { getProducts } from "@/actions/product-actions";
import { ListProducts } from "@/components";


export default async function Home() {
  const products = await getProducts()
  
  return (
    <>
      <h1 className="flex justify-center m-12">Bienvenidos a Cocinas itinerantes</h1>
      <ListProducts products={products} />
    </>
  );
}
