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
 * Order is deliberate, and the tones alternate base/band down the page:
 *   Hero          base — one-liner, one CTA, nothing else
 *   Wall          band — the recognition moment. Their problem, before any solution
 *   WhatIDo       base — the bridge, right-sized
 *   HowThisWorks  band — the forwardable block. Written for the champion's manager
 *   LatestPosts   base — proof accumulates here over time
 *   Close         band — CTA repeated + what happens next
 *
 * Before 17 Aug every section was base except What I Do, which was card —
 * so the page read as four black bands and one charcoal accident. Raised
 * objects (cards, tiles) always use --color-card, which is lighter than
 * either section tone, so they lift off whichever band they land on.
 *
 * RESTORED 17 Aug. The Wall was hidden on 14 Aug, but the objection was to its
 * presentation and layout, not its message — Matt's clarification. Without it
 * the page ran Hero straight into WhatIDo and never said "here is your problem"
 * to a stranger. Copy stands; the layout is what gets worked on.
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
