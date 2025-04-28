
import { getCategories } from "@/actions/category-actions";
import { getProducts } from "@/actions/product-actions";
import { CategoryForm } from "@/components";

export default async function CategoriasPage() {
  const categories = await getCategories(); // This should include productos relation
  const products = await getProducts();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Categorías</h1>
      <CategoryForm 
        categories={categories} 
        products={products}
        mode="create"
      />
    </div>
  );
}
