'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { formatCurrency } from '@/utils/format'

interface Product {
  id: string;
  nombre: string;
  description?: string;
  inStock?: number;
  price?: number;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  categorias: {
    id: string;
    nombre: string;
  }[];
}

interface ProductsSummaryProps {
  products: Product[] | null | undefined;
}

export function ProductsSummary({ products }: ProductsSummaryProps) {
  const [expandedProducts, setExpandedProducts] = useState<Set<string>>(new Set());

  const toggleProduct = (productId: string) => {
    const newExpanded = new Set(expandedProducts);
    if (newExpanded.has(productId)) {
      newExpanded.delete(productId);
    } else {
      newExpanded.add(productId);
    }
    setExpandedProducts(newExpanded);
  };

  return (
    <section>
      <div className="summary-container">
        {products?.map((product) => (
          <div key={product.id} className="summary-item">
            <button
              onClick={() => toggleProduct(product.id)}
              className="summary-button cursor-pointer"
            >
              <h3 className="summary-title">
                {product.nombre}
                <span className="summary-count">
                  ({product.categorias.length} categorías)
                </span>
              </h3>
              {expandedProducts.has(product.id) ? <ChevronUp /> : <ChevronDown />}
            </button>

            {expandedProducts.has(product.id) && (
              <div className="summary-content">
                <div className="summary-details">
                  {product.description && (
                    <div className="summary-field">
                      <span className="summary-field-label">Descripción:</span>
                      <p className="summary-field-value">{product.description}</p>
                    </div>
                  )}
                  
                  {product.inStock !== undefined && (
                    <div className="summary-field">
                      <span className="summary-field-label">Stock:</span>
                      <span className="summary-field-value">{product.inStock} unidades</span>
                    </div>
                  )}
                  
                  {product.price !== undefined && product.price !== null && (
                    <div className="summary-field">
                      <span className="summary-field-label">Precio:</span>
                      <span className="summary-field-value">${formatCurrency(product.price)}</span>
                    </div>
                  )}

                  <div className="summary-field">
                    <span className="summary-field-label">Slug:</span>
                    <span className="summary-field-value">{product.slug}</span>
                  </div>

                  <div className="summary-field">
                    <span className="summary-field-label">Creado:</span>
                    <span className="summary-field-value">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="summary-field">
                    <span className="summary-field-label">Última actualización:</span>
                    <span className="summary-field-value">
                      {new Date(product.updatedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="summary-field">
                    <span className="summary-field-label">Categorías:</span>
                    {product.categorias.length > 0 ? (
                      <div className="summary-tags-container">
                        {product.categorias.map((category) => (
                          <span key={category.id} className="summary-tag">
                            {category.nombre}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="summary-empty-message">
                        No hay categorías en este producto
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {products?.length === 0 && (
          <p className="summary-empty-message">
            No hay productos registrados
          </p>
        )}
      </div>
    </section>
  );
}
