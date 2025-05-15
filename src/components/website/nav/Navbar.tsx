import { getUserSession } from "@/actions/auth-actions";

import Link from "next/link";
import { NavCount } from "./NavCount";

export const Navbar = async () => {
  const session = await getUserSession();

  return (
    <nav className="nav-bar">
      <ul className="flex justify-center items-center">
        <li className="mx-4">
          <Link className="cursor-pointer" href="/">
            Productos
          </Link>
        </li>
        <li className="relative">
          <Link className="mx-10 cursor-pointer" href="/carrito">
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
              className="text-[var(--primary)] hover:text-[var(--accent)] transition-colors duration-200 cursor-pointer"
            >
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </Link>
          <NavCount />
        </li>
        {session?.user?.email === process.env.ALLOWED_EMAIL && (
          <li>
            <Link className="mx-10 cursor-pointer" href="/admin">
              Admin
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};
