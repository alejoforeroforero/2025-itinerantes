import { getCategoriesWithProducts, getProductsWithCategories } from "@/actions/summary-actions"

export async function SummaryDashboard() {
  const categoriesResponse = await getCategoriesWithProducts();
  const productsResponse = await getProductsWithCategories();

  if (!categoriesResponse.success || !productsResponse.success || !categoriesResponse.data || !productsResponse.data) {
    return <div>Error loading data</div>;
  }

  const categories = categoriesResponse.data;
  const allProducts = productsResponse.data;

  return (
    <div className="space-y-8">
      {/* Categories Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Categories</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <div key={category.id} className="rounded-lg border bg-grey-900 p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-2">{category.nombre}</h3>
              <div className="space-y-2">
                <p className="text-sm font-medium">Products ({category.productos.length})</p>
                <ul className="text-sm text-gray-600">
                  {category.productos.map((product) => (
                    <li key={product.id} className="flex items-center justify-between py-1">
                      <span>{product.nombre}</span>
                      <div className="flex gap-2">
                        <span className="text-gray-500">${product.price || 0}</span>
                        <span className="text-gray-500">Stock: {product.inStock || 0}</span>
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
        <h2 className="text-2xl font-bold mb-4">All Products</h2>
        <div className="rounded-lg border bg-grey-900 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Name</th>
                  <th className="text-left p-4">Categories</th>
                  <th className="text-left p-4">Price</th>
                  <th className="text-left p-4">Stock</th>
                </tr>
              </thead>
              <tbody>
                {allProducts.map((product) => (
                  <tr key={product.id} className="border-b">
                    <td className="p-4">{product.nombre}</td>
                    <td className="p-4">
                      {product.categorias.map(cat => cat.nombre).join(', ') || 'Uncategorized'}
                    </td>
                    <td className="p-4">${product.price || 0}</td>
                    <td className="p-4">{product.inStock || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
