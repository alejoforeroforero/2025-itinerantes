
'use client';

import { useState, useEffect } from 'react';
import { getCategoriesWithProducts, getProductsWithCategories } from "@/actions/summary-actions";
import { CategorySummary, ProductsSummary } from "@/components";

interface CategoryResponse {
  success: boolean;
  data: Array<{
    id: string;
    nombre: string;
    productos: Array<{
      id: string;
      nombre: string;
      slug: string;
    }>;
  }> | null;
  total: number;
  error: string | null;
}

interface ProductResponse {
  success: boolean;
  data: Array<{
    id: string;
    nombre: string;
    categorias: Array<{
      id: string;
      nombre: string;
      slug: string;
    }>;
  }> | null;
  total: number;
  error: string | null;
}

export default function AdminPage() {
  const [categoriesResponse, setCategoriesResponse] = useState<CategoryResponse | null>(null);
  const [productsResponse, setProductsResponse] = useState<ProductResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const response = await getCategoriesWithProducts();
      setCategoriesResponse({
        ...response,
        total: response.total ?? 0,
      });
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategoriesResponse({
        success: false,
        data: null,
        total: 0,
        error: 'Error al cargar las categorías'
      });
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await getProductsWithCategories();
      setProductsResponse({
        ...response,
        total: response.total ?? 0,
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      setProductsResponse({
        success: false,
        data: null,
        total: 0,
        error: 'Error al cargar los productos'
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchCategories(),
        fetchProducts()
      ]);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!categoriesResponse?.success || !productsResponse?.success) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-red-500 p-4 rounded-lg border border-red-300 bg-[var(--background)]">
          <h2 className="text-2xl font-bold mb-2">Error en el resumen</h2>
          <p className="text-sm">
            {categoriesResponse?.error || productsResponse?.error || 'Error desconocido'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold">Dashboard</h2>
        <p className="text-sm mt-2">Vista general de categorías y productos</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="p-6 rounded-lg border border-gray-300 dark:border-gray-600 bg-[var(--background)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-medium">Total Categorías</h3>
            <span className="text-2xl font-bold text-blue-500">
              {categoriesResponse.total || 0}
            </span>
          </div>
          <CategorySummary 
            categories={categoriesResponse.data || []}
          />
        </div>

        <div className="p-6 rounded-lg border border-gray-300 dark:border-gray-600 bg-[var(--background)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-medium">Total Productos</h3>
            <span className="text-2xl font-bold text-blue-500">
              {productsResponse.total || 0}
            </span>
          </div>
          <ProductsSummary 
            products={productsResponse.data || []}
          />
        </div>
      </div>
    </div>
  );
}
