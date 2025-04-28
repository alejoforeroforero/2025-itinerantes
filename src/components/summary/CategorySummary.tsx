'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Category {
  id: string;
  nombre: string;
  productos: {
    id: string;
    nombre: string;
  }[];
}

interface CategorySummaryProps {
  categories: Category[] | null | undefined;
}

export function CategorySummary({ categories }: CategorySummaryProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  return (
    <section>
      <div className="summary-container">
        {categories?.map((category) => (
          <div key={category.id} className="summary-item">
            <button
              onClick={() => toggleCategory(category.id)}
              className="summary-button"
            >
              <h3 className="summary-title">
                {category.nombre}
                <span className="summary-count">
                  ({category.productos.length} productos)
                </span>
              </h3>
              {expandedCategories.has(category.id) ? <ChevronUp /> : <ChevronDown />}
            </button>

            {expandedCategories.has(category.id) && (
              <div className="summary-content">
                {category.productos.length > 0 ? (
                  <div className="summary-tags-container">
                    {category.productos.map((product) => (
                      <span key={product.id} className="summary-tag">
                        {product.nombre}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="summary-empty-message">
                    No hay productos en esta categoría
                  </p>
                )}
              </div>
            )}
          </div>
        ))}

        {categories?.length === 0 && (
          <p className="summary-empty-message">
            No hay categorías registradas
          </p>
        )}
      </div>
    </section>
  );
}
