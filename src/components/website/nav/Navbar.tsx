'use client';

import Image from "next/image";
import Link from "next/link";
import { NavCount } from "./NavCount";
import { useState } from "react";
import { usePathname } from "next/navigation";

interface NavbarProps {
  title: string;
  isAdmin: boolean;
}

export const Navbar = ({ title, isAdmin }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  return (
    <>
      <nav className="bg-[var(--background)] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center relative overflow-hidden">
                <Image
                  src="/imgs/logo3.png"
                  alt="Cocinas Itinerantes Logo"
                  width={84}
                  height={84}
                  className="object-contain"
                />
              </div>
              <span className="ml-3 text-lg font-semibold text-[var(--primary)] hidden sm:block">
                {title}
              </span>
              <span className="ml-3 text-lg font-semibold text-[var(--primary)] sm:hidden text-center">
                {title.split(' ').map((word, index) => (
                  <span key={index}>
                    {word}
                    {index < title.split(' ').length - 1 && <br />}
                  </span>
                ))}
              </span>
            </Link>

            {/* Desktop Navigation - Centered */}
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

            {/* Right side items */}
            <div className="flex items-center space-x-4">
              {/* Cart Icon - Always visible */}
              <Link href="/carrito" className="relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[var(--primary)] hover:text-[var(--accent)] transition-colors duration-200"
                >
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                <NavCount />
              </Link>

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="sm:hidden p-2 rounded-md text-[var(--primary)] hover:text-[var(--accent)] focus:outline-none"
              >
                {isMenuOpen ? (
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
                ) : (
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
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 sm:hidden ${
          isMenuOpen ? 'opacity-100 z-40' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Mobile Navigation Menu Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-64 bg-[var(--background)] shadow-lg transform transition-transform duration-300 ease-in-out sm:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } z-50`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-[var(--primary)]">Menú</h2>
          </div>
          <div className="flex-1 px-4 py-6 space-y-4">
            <Link
              href="/"
              className={`block text-base text-[var(--primary)] hover:text-[var(--accent)] ${
                isActive('/') ? 'font-bold' : 'font-medium'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Productos
            </Link>
            <Link
              href="/sobre-nosotros"
              className={`block text-base text-[var(--primary)] hover:text-[var(--accent)] ${
                isActive('/sobre-nosotros') ? 'font-bold' : 'font-medium'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Sobre Nosotros
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                className={`block text-base text-[var(--primary)] hover:text-[var(--accent)] ${
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
    </>
  );
};
