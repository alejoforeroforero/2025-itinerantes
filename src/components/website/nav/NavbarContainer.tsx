import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import { getAboutTitle } from "@/actions/about";
import { getSettings } from "@/actions/settings-actions";
import { Navbar } from "./Navbar";

export const NavbarContainer = async () => {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.email === process.env.ALLOWED_EMAIL;
  const title = await getAboutTitle();
  const settings = await getSettings();
  const logoUrl = settings?.logoUrl || undefined;

  return <Navbar title={title} isAdmin={isAdmin} logoUrl={logoUrl} />;
}; 