'use client';

import { createCategory, updateCategory } from "@/actions/category-actions";
import { useActionState } from "react";
import { useState } from "react";
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CategoryFormProps {
  categories: { 
    id: string; 
    nombre: string;
    productos: { id: string; nombre: string; }[];
  }[];
  products: { id: string; nombre: string }[];
  mode?: 'create' | 'edit';
}

export function CategoryForm({ categories, products }: CategoryFormProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [isListExpanded, setIsListExpanded] = useState(true);
  const [data, action, isPending] = useActionState(
    selectedCategoryId 
      ? (prev: unknown, formData: FormData) => updateCategory(selectedCategoryId, prev, formData)
      : createCategory,
    undefined
  );

  const handleCategoryClick = (category: { id: string; nombre: string }) => {
    setSelectedCategoryId(category.id);
    const selectedCategory = categories.find(c => c.id === category.id);
    if (selectedCategory) {
      const form = document.querySelector('form') as HTMLFormElement;
      if (form) {
        (form.elements.namedItem('nombre') as HTMLInputElement).value = selectedCategory.nombre;
        (form.elements.namedItem('slug') as HTMLInputElement).value = selectedCategory.nombre.toLowerCase().replace(/\s+/g, '-') || '';
        
        const productsSelect = form.elements.namedItem('products') as HTMLSelectElement;
        const productIds = selectedCategory.productos.map(p => p.id);
        
        Array.from(productsSelect.options).forEach(option => {
          option.selected = productIds.includes(option.value);
        });
      }
    }
  };

  const handleCancelEdit = () => {
    setSelectedCategoryId(null);
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
          <span className="font-medium">Mostrar categorías ({categories.length})</span>
          {isListExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        
        {isListExpanded && (
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category)}
                className={`px-3 py-1.5 rounded-full transition-colors ${
                  selectedCategoryId === category.id 
                    ? 'bg-blue-500 text-white hover:bg-blue-600' 
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                {category.nombre}
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
              placeholder="Nombre de la categoría"
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
              placeholder="slug-de-la-categoria"
              defaultValue={data?.fieldData?.slug}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="products" className="form-label">Productos</label>
            <select 
              id="products"
              name="products" 
              multiple 
              className="form-select min-h-[120px]"
            >
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.nombre}
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
              {isPending ? "Procesando..." : selectedCategoryId ? "Actualizar Categoría" : "Crear Categoría"}
            </button>

            {selectedCategoryId && (
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
