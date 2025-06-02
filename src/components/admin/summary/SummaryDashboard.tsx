import { getCategoriesWithProducts, getProductsWithCategories } from "@/actions/summary-actions"
import { formatCurrency } from '@/utils/format'
import { DeleteProductButton } from './DeleteProductButton'

export async function SummaryDashboard() {
  const categoriesResponse = await getCategoriesWithProducts();
  const productsResponse = await getProductsWithCategories();

  if (!categoriesResponse.success || !productsResponse.success || !categoriesResponse.data || !productsResponse.data) {
    return <div>Error loading data</div>;
  }

  const categories = categoriesResponse.data;
  const allProducts = productsResponse.data;

  console.log('Products data:', allProducts);

  return (
    <div className="space-y-8">
      {/* Categories Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Categories</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <div key={category.id} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-2 text-[var(--primary)]">{category.nombre}</h3>
              <div className="space-y-2">
                <p className="text-sm font-medium text-[var(--foreground)]">Products ({category.productos.length})</p>
                <ul className="text-sm text-[var(--secondary)]">
                  {category.productos.map((product) => (
                    <li key={product.id} className="flex items-center justify-between py-1">
                      <span>{product.nombre}</span>
                      <div className="flex gap-2">
                        <span className="text-[var(--secondary)]">${formatCurrency(product.price || 0)}</span>
                        <span className="text-[var(--secondary)]">Stock: {product.inStock || 0}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All Products Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-[var(--primary)]">All Products</h2>
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-4 text-[var(--primary)] font-medium">Name</th>
                  <th className="text-left p-4 text-[var(--primary)] font-medium">Categories</th>
                  <th className="text-left p-4 text-[var(--primary)] font-medium">Price</th>
                  <th className="text-left p-4 text-[var(--primary)] font-medium">Stock</th>
                  <th className="text-left p-4 text-[var(--primary)] font-medium w-[200px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allProducts.map((product) => {
                  console.log('Rendering product:', product);
                  return (
                    <tr key={product.id} className="border-b border-gray-200">
                      <td className="p-4 text-[var(--foreground)]">{product.nombre}</td>
                      <td className="p-4 text-[var(--foreground)]">
                        {product.categorias.map(cat => cat.nombre).join(', ') || 'Uncategorized'}
                      </td>
                      <td className="p-4 text-[var(--foreground)]">${formatCurrency(product.price || 0)}</td>
                      <td className="p-4 text-[var(--foreground)]">{product.inStock || 0}</td>
                      <td className="p-4 w-[200px]">
                        <DeleteProductButton 
                          productId={product.id}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
