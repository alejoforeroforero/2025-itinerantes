'use client';

import { createProduct, updateProduct } from "@/actions/product-actions";
import { useActionState } from "react";
import { useState } from "react";
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Product {
  id: string;
  nombre: string;
  slug: string;
  description?: string;
  inStock?: number;
  price?: number;
  categorias: { id: string; nombre: string; }[];
}

interface ActionResponse {
  success: boolean;
  message: string | null;
  error: string | null;
  fieldData: {
    nombre: string;
    slug: string;
    description?: string;
    inStock?: number;
    price?: number;
    categoriasIds: string[];
  };
}

interface ProductFormProps {
  products: Product[];
  categories: { id: string; nombre: string }[];
  mode?: 'create' | 'edit';
}

export function ProductForm({ products, categories }: ProductFormProps) {
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isListExpanded, setIsListExpanded] = useState(true);
  const [data, action, isPending] = useActionState<ActionResponse | undefined, FormData>(
    selectedProductId 
      ? (prev: ActionResponse | undefined, formData: FormData) => updateProduct(selectedProductId, prev, formData)
      : createProduct,
    undefined
  );

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nameValue = e.target.value;
    const slugInput = document.querySelector('#slug') as HTMLInputElement;
    if (slugInput) {
      slugInput.value = generateSlug(nameValue);
    }
  };

  const handleProductClick = (product: { id: string; nombre: string }) => {
    setSelectedProductId(product.id);
    const selectedProduct = products.find(p => p.id === product.id);
    if (selectedProduct) {
      const form = document.querySelector('form') as HTMLFormElement;
      if (form) {
        (form.elements.namedItem('nombre') as HTMLInputElement).value = selectedProduct.nombre;
        (form.elements.namedItem('slug') as HTMLInputElement).value = generateSlug(selectedProduct.nombre);
        (form.elements.namedItem('description') as HTMLTextAreaElement).value = selectedProduct.description || '';
        (form.elements.namedItem('inStock') as HTMLInputElement).value = selectedProduct.inStock?.toString() || '';
        (form.elements.namedItem('price') as HTMLInputElement).value = selectedProduct.price?.toString() || '';
        
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
      <div className="form-list-container">
        <button 
          onClick={() => setIsListExpanded(!isListExpanded)}
          className="form-list-toggle"
        >
          <span className="font-medium">Mostrar productos ({products.length})</span>
          {isListExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        
        {isListExpanded && (
          <div className="form-list-items">
            {products.map((product) => (
              <button
                key={product.id}
                onClick={() => handleProductClick(product)}
                className={`form-list-item ${
                  selectedProductId === product.id 
                    ? 'form-list-item-selected' 
                    : ''
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
              onChange={handleNameChange}
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
            <label htmlFor="description" className="form-label">Descripción</label>
            <textarea
              id="description"
              name="description"
              placeholder="Descripción del producto"
              defaultValue={data?.fieldData?.description}
              className="form-input"
              rows={4}
            />
          </div>

          <div className="form-group">
            <label htmlFor="inStock" className="form-label">Stock</label>
            <input
              type="number"
              id="inStock"
              name="inStock"
              placeholder="Cantidad en stock"
              defaultValue={data?.fieldData?.inStock}
              className="form-input"
              min="0"
            />
          </div>

          <div className="form-group">
            <label htmlFor="price" className="form-label">Precio</label>
            <input
              type="number"
              id="price"
              name="price"
              placeholder="Precio del producto"
              defaultValue={data?.fieldData?.price}
              className="form-input"
              min="0"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label htmlFor="categorias" className="form-label">Categorías</label>
            <select 
              id="categorias"
              name="categorias" 
              multiple 
              className="form-select-multiple"
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
          
          <div className="form-action-buttons">
            <button 
              type="submit"
              className="form-action-button-primary"
              disabled={isPending}
            >
              {isPending ? "Procesando..." : selectedProductId ? "Actualizar Producto" : "Crear Producto"}
            </button>

            {selectedProductId && (
              <button 
                type="button"
                onClick={handleCancelEdit}
                className="form-action-button-secondary"
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
