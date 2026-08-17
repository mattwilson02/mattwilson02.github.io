import dynamic from "next/dynamic";
import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { Footer } from "@/components/footer";
import { ScrollToTop } from "@/components/scroll-to-top";

const Wall = dynamic(() =>
  import("@/components/wall").then((m) => ({ default: m.Wall })),
);
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
 *   Wall          — recognition. Carries the weight; no case study to rescue it
 *   WhatIDo       — the bridge, right-sized
 *   HowThisWorks  — the forwardable block. Written for the champion's manager
 *   LatestPosts   — proof accumulates here over time
 *   Close         — CTA repeated + what happens next
 *
 * Experience, Skills, Certifications and Testimonials have come off this page.
 * They belong on /about, and only where they help a stranger decide whether to
 * trust him with their business — not where they prove employability.
 */
export default function Home() {
  return (
    <>
      <Nav />
      <main id="main-content">
        <Hero />
        <Wall />
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
