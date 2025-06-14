'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface NavbarClientProps {
  title: string;
  isAdmin: boolean;
  logoUrl?: string;
}

export default function NavbarClient({ title, isAdmin, logoUrl }: NavbarClientProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/">
              <Image
                src={logoUrl || "/imgs/logo3.png"}
                alt="Cocinas Itinerantes Logo"
                width={84}
                height={84}
                className="object-contain"
              />
            </Link>
            <span className="ml-3 text-lg font-semibold text-[var(--primary)] hidden sm:block">
              {title}
            </span>
          </div>
          <div className="flex items-center">
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
            {/* Links desktop */}
            <div className="hidden sm:flex items-center space-x-8">
              <Link href="/" className="text-[var(--primary)] hover:text-[var(--accent)] transition-colors duration-200 uppercase text-sm tracking-wide font-medium">
                Productos
              </Link>
              <Link href="/sobre-nosotros" className="text-[var(--primary)] hover:text-[var(--accent)] transition-colors duration-200 uppercase text-sm tracking-wide font-medium">
                Sobre Nosotros
              </Link>
              {isAdmin && (
                <Link href="/admin" className="text-[var(--primary)] hover:text-[var(--accent)] transition-colors duration-200 uppercase text-sm tracking-wide font-medium">
                  Admin
                </Link>
              )}
            </div>
          </div>
        </div>
        {/* Menú mobile */}
        {isMenuOpen && (
          <div className="sm:hidden mt-2 space-y-2">
            <Link href="/" className="block text-[var(--primary)] hover:text-[var(--accent)] font-medium" onClick={() => setIsMenuOpen(false)}>
              Productos
            </Link>
            <Link href="/sobre-nosotros" className="block text-[var(--primary)] hover:text-[var(--accent)] font-medium" onClick={() => setIsMenuOpen(false)}>
              Sobre Nosotros
            </Link>
            {isAdmin && (
              <Link href="/admin" className="block text-[var(--primary)] hover:text-[var(--accent)] font-medium" onClick={() => setIsMenuOpen(false)}>
                Admin
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
} 