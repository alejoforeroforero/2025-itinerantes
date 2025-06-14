import { SiteSettings } from "@/components/website/settings/SiteSettings";
import prisma from "@/lib/prisma";

export default async function SettingsPage() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: 1 },
  });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Configuración del Sitio</h1>
      <SiteSettings currentFavicon={settings?.faviconUrl} />
    </div>
  );
} 