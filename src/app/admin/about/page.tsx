import { AboutAdmin } from "@/components/website/text-editor/AboutAdmin";
import { getAbout } from "@/actions/about-actions";

export default async function AboutPage() {
  const about = await getAbout();
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Editar Página Acerca de</h1>
      <AboutAdmin 
        title={about?.title ?? ''} 
        content={about?.content ?? ''} 
      />
    </div>
  );
}
