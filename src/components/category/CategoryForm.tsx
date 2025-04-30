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
      <div className="form-list-container">
        <button 
          onClick={() => setIsListExpanded(!isListExpanded)}
          className="form-list-toggle"
        >
          <span className="font-medium">Mostrar categorías ({categories.length})</span>
          {isListExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        
        {isListExpanded && (
          <div className="form-list-items">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category)}
                className={`form-list-item ${
                  selectedCategoryId === category.id 
                    ? 'form-list-item-selected' 
                    : ''
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
              className="form-select-multiple"
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
          
          <div className="form-action-buttons">
            <button 
              type="submit"
              className="form-action-button-primary"
              disabled={isPending}
            >
              {isPending ? "Procesando..." : selectedCategoryId ? "Actualizar Categoría" : "Crear Categoría"}
            </button>

            {selectedCategoryId && (
              <button 
                type="button"
                onClick={handleCancelEdit}
                className="form-action-button-cancel"
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
