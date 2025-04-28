'use client';

import { createProduct, updateProduct } from "@/actions/product-actions";
import { useActionState } from "react";
import { useState } from "react";
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ProductFormProps {
  products: { 
    id: string; 
    nombre: string;
    categorias: { id: string; nombre: string; }[];
  }[];
  categories: { id: string; nombre: string }[];
  mode?: 'create' | 'edit';
}

export function ProductForm({ products, categories }: ProductFormProps) {
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isListExpanded, setIsListExpanded] = useState(true);
  const [data, action, isPending] = useActionState(
    selectedProductId 
      ? (prev: unknown, formData: FormData) => updateProduct(selectedProductId, prev, formData)
      : createProduct,
    undefined
  );

  const handleProductClick = (product: { id: string; nombre: string }) => {
    setSelectedProductId(product.id);
    const selectedProduct = products.find(p => p.id === product.id);
    if (selectedProduct) {
      const form = document.querySelector('form') as HTMLFormElement;
      if (form) {
        (form.elements.namedItem('nombre') as HTMLInputElement).value = selectedProduct.nombre;
        (form.elements.namedItem('slug') as HTMLInputElement).value = selectedProduct.nombre.toLowerCase().replace(/\s+/g, '-') || '';
        
        const categoriasSelect = form.elements.namedItem('categorias') as HTMLSelectElement;
        const categoryIds = selectedProduct.categorias.map(c => c.id);
        
        Array.from(categoriasSelect.options).forEach(option => {
          option.selected = categoryIds.includes(option.value);
        });
      }
    }
  };

  const handleCancelEdit = () => {
    setSelectedProductId(null);
    const form = document.querySelector('form') as HTMLFormElement;
    if (form) {
      form.reset();
    }
  };

  return (
    <div className="summary-container">
      <div className="mb-8 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
        <button 
          onClick={() => setIsListExpanded(!isListExpanded)}
          className="w-full flex items-center justify-between mb-4 text-sm text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400"
        >
          <span className="font-medium">Mostrar productos ({products.length})</span>
          {isListExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        
        {isListExpanded && (
          <div className="flex flex-wrap gap-2">
            {products.map((product) => (
              <button
                key={product.id}
                onClick={() => handleProductClick(product)}
                className={`px-3 py-1.5 rounded-full transition-colors ${
                  selectedProductId === product.id 
                    ? 'bg-blue-500 text-white hover:bg-blue-600' 
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                {product.nombre}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="summary-content">
        <form action={action} className="form-container">
          <div className="form-group">
            <label htmlFor="nombre" className="form-label">Nombre</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              placeholder="Nombre del producto"
              defaultValue={data?.fieldData?.nombre}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="slug" className="form-label">Slug</label>
            <input
              type="text"
              id="slug"
              name="slug"
              placeholder="slug-del-producto"
              defaultValue={data?.fieldData?.slug}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="categorias" className="form-label">Categorías</label>
            <select 
              id="categorias"
              name="categorias" 
              multiple 
              className="form-select min-h-[120px]"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.nombre}
                </option>
              ))}
            </select>
          </div>
          
          {data?.message && <p className="form-success">{data.message}</p>}
          {data?.error && <p className="form-error">{data.error}</p>}
          
          <div className="flex gap-2">
            <button 
              type="submit"
              className="form-button"
              disabled={isPending}
            >
              {isPending ? "Procesando..." : selectedProductId ? "Actualizar Producto" : "Crear Producto"}
            </button>

            {selectedProductId && (
              <button 
                type="button"
                onClick={handleCancelEdit}
                className="form-button bg-gray-500"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}