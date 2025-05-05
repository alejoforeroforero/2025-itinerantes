import { getUserSession } from "@/actions/auth-actions";

import Link from "next/link";
import { NavCount } from "./NavCount";

export const Navbar = async () => {
  const session = await getUserSession();

  return (
    <nav className="nav-bar my-8">
      <ul className="flex justify-center">
        <li className="mx-10">
          <Link className="" href="/">
            Home
          </Link>
        </li>
        <li>
          <Link className="mx-10" href="/carrito">
            Cart
          </Link>
          <NavCount />
        </li>
        {session?.user?.email === process.env.ALLOWED_EMAIL && (
          <li>
            <Link className="mx-10" href="/admin">
              Admin
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};
