'use client';

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { NavCount } from "./NavCount";
import { usePathname } from "next/navigation";

interface NavbarClientProps {
  title: string;
  isAdmin: boolean;
  logoUrl?: string;
}

export default function NavbarClient({ title, isAdmin, logoUrl }: NavbarClientProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    console.log('Current pathname:', pathname);
  }, [pathname]);

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname?.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="bg-white shadow-md mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo y título */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src={logoUrl || "/imgs/logo3.png"}
                alt="Cocinas Itinerantes Logo"
                width={48}
                height={48}
                className="object-contain"
              />
              <span className="ml-2 text-lg font-semibold text-[var(--primary)]">
                {title}
              </span>
            </Link>
          </div>

          {/* Menú central en desktop */}
          <div className="hidden sm:flex items-center justify-center flex-1">
            <div className="flex items-center space-x-8">
              <Link 
                href="/" 
                className={`text-[var(--primary)] hover:text-[var(--accent)] transition-colors duration-200 uppercase text-sm tracking-wide ${
                  isActive('/') ? 'font-bold' : 'font-medium'
                }`}
              >
                Productos
              </Link>
              <Link 
                href="/sobre-nosotros" 
                className={`text-[var(--primary)] hover:text-[var(--accent)] transition-colors duration-200 uppercase text-sm tracking-wide ${
                  isActive('/sobre-nosotros') ? 'font-bold' : 'font-medium'
                }`}
              >
                Sobre Nosotros
              </Link>
              {isAdmin && (
                <Link 
                  href="/admin" 
                  className={`text-[var(--primary)] hover:text-[var(--accent)] transition-colors duration-200 uppercase text-sm tracking-wide ${
                    isActive('/admin') ? 'font-bold' : 'font-medium'
                  }`}
                >
                  Admin
                </Link>
              )}
            </div>
          </div>

          {/* Carrito y menú móvil */}
          <div className="flex items-center space-x-4">
            {/* Carrito - visible en todas las vistas */}
            <Link href="/carrito" className="relative text-[var(--primary)] hover:text-[var(--accent)] transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <NavCount />
            </Link>
            {/* Botón menú hamburguesa para mobile */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="sm:hidden p-2 rounded-md text-[var(--primary)] hover:text-[var(--accent)] focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Overlay y menú móvil */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 sm:hidden ${
          isMenuOpen ? 'opacity-50 z-40' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
      />
      <div 
        className={`fixed top-0 right-0 h-screen w-4/5 max-w-sm bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 sm:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 space-y-6">
          <div className="flex justify-end">
            <button
              onClick={() => setIsMenuOpen(false)}
              className="text-[var(--primary)] hover:text-[var(--accent)]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="space-y-4">
            <Link 
              href="/" 
              className={`block text-[var(--primary)] hover:text-[var(--accent)] text-lg ${
                isActive('/') ? 'font-bold' : 'font-medium'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Productos
            </Link>
            <Link 
              href="/sobre-nosotros" 
              className={`block text-[var(--primary)] hover:text-[var(--accent)] text-lg ${
                isActive('/sobre-nosotros') ? 'font-bold' : 'font-medium'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Sobre Nosotros
            </Link>
            {isAdmin && (
              <Link 
                href="/admin" 
                className={`block text-[var(--primary)] hover:text-[var(--accent)] text-lg ${
                  isActive('/admin') ? 'font-bold' : 'font-medium'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Admin
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 