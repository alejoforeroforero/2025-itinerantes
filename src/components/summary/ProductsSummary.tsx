'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Product {
  id: string;
  nombre: string;
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
              className="summary-button"
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
