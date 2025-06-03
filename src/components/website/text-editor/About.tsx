import { getAbout } from "@/actions/about-actions";


export const About = async() => {
  const about = await getAbout();
  return (
    <div>{about?.content}</div>
  )
}

