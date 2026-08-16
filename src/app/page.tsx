import dynamic from "next/dynamic";
import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { Footer } from "@/components/footer";
import { ScrollToTop } from "@/components/scroll-to-top";

const WhatIDo = dynamic(() =>
  import("@/components/what-i-do").then((m) => ({ default: m.WhatIDo })),
);
const HowThisWorks = dynamic(() =>
  import("@/components/how-this-works").then((m) => ({
    default: m.HowThisWorks,
  })),
);
const LatestPosts = dynamic(() =>
  import("@/components/latest-posts").then((m) => ({ default: m.LatestPosts })),
);
const Close = dynamic(() =>
  import("@/components/close").then((m) => ({ default: m.Close })),
);

/**
 * The main page.
 *
 * Order is deliberate:
 *   Hero          — one-liner, one CTA, nothing else
 *   WhatIDo       — the bridge, right-sized
 *   HowThisWorks  — the forwardable block. Written for the champion's manager
 *   LatestPosts   — proof accumulates here over time
 *   Close         — CTA repeated + what happens next
 *
 * HIDDEN 14 Aug: the Wall ("The idea isn't the hard part"). Component and copy
 * still live in src/components/wall.tsx and src/data/wall.ts, just not rendered
 * — Matt's call that it reads like a LinkedIn post and may not be relevant.
 * Restore by re-adding the dynamic import and the <Wall /> below Hero.
 *
 * Experience, Skills, Certifications, Testimonials, Projects and the rest are
 * archived in /archive. They proved employability, which is not the buyer's
 * question. /about is the exception and is being rewritten.
 */
export default function Home() {
  return (
    <>
      <Nav />
      <main id="main-content">
        <Hero />

        <WhatIDo />
        <HowThisWorks />
        <LatestPosts />
        <Close />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
