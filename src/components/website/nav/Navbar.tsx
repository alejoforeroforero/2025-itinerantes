import Link from "next/link";

export const Navbar = () => {
  return (
    <nav className="nav-bar">
      <ul className="flex justify-center">
        <li className="mx-10 borde">
          <Link className="" href="/">
            Home
          </Link>
        </li>
        <li>
          <Link className="" href="/">
            Cart
          </Link>
        </li>
      </ul>
    </nav>
  );
};
