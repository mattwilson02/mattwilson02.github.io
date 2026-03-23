import dynamic from "next/dynamic";
import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { Footer } from "@/components/footer";
import { ScrollToTop } from "@/components/scroll-to-top";

const About = dynamic(() =>
  import("@/components/about").then((m) => ({ default: m.About })),
);
const Experience = dynamic(() =>
  import("@/components/experience").then((m) => ({ default: m.Experience })),
);
const Projects = dynamic(() =>
  import("@/components/projects").then((m) => ({ default: m.Projects })),
);
const Skills = dynamic(() =>
  import("@/components/skills").then((m) => ({ default: m.Skills })),
);
const Certifications = dynamic(() =>
  import("@/components/certifications").then((m) => ({
    default: m.Certifications,
  })),
);
const LatestPosts = dynamic(() =>
  import("@/components/latest-posts").then((m) => ({
    default: m.LatestPosts,
  })),
);
const Contact = dynamic(() =>
  import("@/components/contact").then((m) => ({ default: m.Contact })),
);
const CurrentlyBuilding = dynamic(() =>
  import("@/components/currently-building").then((m) => ({
    default: m.CurrentlyBuilding,
  })),
);

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main-content">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Certifications />
        <LatestPosts />
        <CurrentlyBuilding />
        <Contact />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
