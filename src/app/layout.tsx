import type { Metadata } from "next";
import { NavbarContainer } from "@/components";
import { Providers } from "@/components";
import { Geist, Geist_Mono } from "next/font/google";
import { getCategories } from "@/actions/category-actions";
import { getProducts } from "@/actions/product-actions";
import { CategoryTabs } from "@/components/website/products/CategoryTabs";
import "./globals.css";

interface Category {
  id: string;
  nombre: string;
  slug: string;
  productos: { id: string }[];
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: '%s | Itinerantes',
    default: 'Itinerantes - Tienda Online',
  },
  description: 'Descubre nuestra colección de productos artesanales y únicos en Itinerantes.',
  keywords: ['artesanías', 'productos artesanales', 'tienda online', 'compras'],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let categories: Category[] = [];
  let products = [];

  try {
    const categoriesData = await getCategories();
    const productsData = await getProducts();
    
    // Transform the data to match the expected types
    categories = categoriesData.map(category => ({
      id: category.id,
      nombre: category.nombre,
      slug: category.slug,
      productos: category.productos || []
    }));
    
    products = productsData;
  } catch (error) {
    console.error('Error fetching data:', error);
    // Continue with empty arrays if database is not available
  }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <NavbarContainer />
          <div className="sticky top-0 z-10 bg-white shadow-sm">
            <CategoryTabs categories={categories} totalProducts={products.length} />
          </div>
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
