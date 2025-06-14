// import NavbarClient from "./NavbarClient";

import NavbarClient from "./NavbarClient";

interface NavbarProps {
  title: string;
  isAdmin: boolean;
  logoUrl?: string;
}

export function Navbar({ title, isAdmin, logoUrl }: NavbarProps) {
  return <NavbarClient title={title} isAdmin={isAdmin} logoUrl={logoUrl} />;
}
