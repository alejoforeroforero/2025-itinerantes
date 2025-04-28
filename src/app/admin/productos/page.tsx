
import { getCategories } from "@/actions/category-actions";
import { getProducts } from "@/actions/product-actions";
import { ProductForm } from "@/components";

export default async function ProductosPage() {
  const products = await getProducts(); // This includes categorias relation
  const categories = await getCategories();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Productos</h1>
      <ProductForm 
        products={products} 
        categories={categories}
        mode="create"
      />
    </div>
  );
}
