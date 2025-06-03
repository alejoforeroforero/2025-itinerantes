import { getAbout } from "@/actions/about-actions";
import { convertToHTMLDynamic } from "./text-editor/utils/convertToHTMLDynamic";

export const About = async () => {
  const about = await getAbout();
  return (
    <div>
      <h1 className="text-2xl font-bold text-center mb-8">{about?.title}</h1>
      <div>{about?.content && convertToHTMLDynamic(about.content)}</div>
    </div>
  );
};
