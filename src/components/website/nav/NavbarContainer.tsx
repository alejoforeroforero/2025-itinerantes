import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import { getAboutTitle } from "@/actions/about";
import { Navbar } from "./Navbar";

export const NavbarContainer = async () => {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.email === process.env.ALLOWED_EMAIL;
  const title = await getAboutTitle();

  return <Navbar title={title} isAdmin={isAdmin} />;
}; 