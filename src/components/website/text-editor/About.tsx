import { getAbout } from "@/actions/about-actions";


const About = async() => {
  const about = await getAbout();
  return (
    <div>{about?.content}</div>
  )
}

export default About