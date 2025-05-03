import { getUserSession } from "@/actions/auth-actions";
import Link from "next/link";

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
          <Link className="mx-10" href="/">
            Cart
          </Link>
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
