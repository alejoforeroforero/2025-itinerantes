import { getUserSession } from "@/actions/auth-actions";

import Link from "next/link";
import { NavCount } from "./NavCount";

export const Navbar = async () => {
  const session = await getUserSession();

  return (
    <nav className="bg-[var(--background)] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] border-3 border-[var(--primary)] flex items-center justify-center relative overflow-hidden">
              <span className="text-2xl">👨‍🍳</span>
            </div>
            <span className="ml-3 text-lg font-semibold text-[var(--primary)]">
              Cocinas Itinerantes
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className="text-[var(--primary)] hover:text-[var(--accent)] transition-colors duration-200 uppercase text-sm font-medium tracking-wide"
            >
              Productos
            </Link>

            {/* Cart Icon */}
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

            {/* Admin Link */}
            {session?.user?.email === process.env.ALLOWED_EMAIL && (
              <Link
                href="/admin"
                className="text-[var(--primary)] hover:text-[var(--accent)] transition-colors duration-200 uppercase text-sm font-medium tracking-wide"
              >
                Admin
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
