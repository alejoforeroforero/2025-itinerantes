'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Category {
  id: string;
  nombre: string;
  slug: string;
  productos: { id: string }[];
}

interface CategoryTabsProps {
  categories: Category[];
  totalProducts: number;
}

export function CategoryTabs({ categories, totalProducts }: CategoryTabsProps) {
  const pathname = usePathname();
  const isAllProducts = pathname === '/' || pathname === '/productos';

  return (
    <div className="w-full bg-white">
      <div className="container mx-auto">
        <div className="flex space-x-1 overflow-x-auto py-4 px-4">
          <Link
            href="/"
            className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors duration-200 ${
              isAllProducts
                ? 'bg-[var(--primary)] text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Todos los productos ({totalProducts})
          </Link>
          {categories.map((category) => {
            const isActive = pathname === `/categoria/${category.slug}`;
            return (
              <Link
                key={category.id}
                href={`/categoria/${category.slug}`}
                className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors duration-200 ${
                  isActive
                    ? 'bg-[var(--primary)] text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {category.nombre} ({category.productos.length})
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
} 