import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { ScrollToTop } from "@/components/scroll-to-top";
import { Section } from "@/components/section";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { calendlyUrl } from "@/data/navigation";

const Experience = dynamic(() =>
  import("@/components/experience").then((m) => ({ default: m.Experience })),
);
const Skills = dynamic(() =>
  import("@/components/skills").then((m) => ({ default: m.Skills })),
);

export const metadata: Metadata = {
  title: "About — Matt Wilson",
  description:
    "Who I am, how I got here, and why I build software that gives businesses their time back.",
  alternates: { canonical: "/about" },
};

/**
 * /about
 *
 * This is where the personal history lives. The main page is for a stranger
 * who arrived from a post; this page is for someone who has decided they're
 * interested and wants to know who they'd be working with.
 *
 * The test for anything on this page: does it help a stranger decide whether
 * to trust me with their business? Keep it. Is it here to prove I'm
 * employable? Cut it.
 *
 * Layer 5 decision 2 is "sell Matt, not software" — an agency should be
 * faceless, this shouldn't be.
 */
export default function AboutPage() {
  return (
    <>
      <Nav />
      <main id="main-content">
        <Section id="about-intro" className="pt-28 md:pt-32">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />

          <h1 className="mt-6 max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">
            {/* TODO — MATT'S WORDS */}
            [ABOUT HEADING]
          </h1>

          <div className="mt-8 flex max-w-3xl flex-col gap-5 text-lg leading-relaxed text-[var(--color-muted)]">
            <p>
              [THE STORY. Long form is fine here — this is the page where it
              belongs. Self-taught, no CS degree, regulated finance, the
              redundancy, going independent. Written as a person, not a CV.]
            </p>
            <p>
              [WHY THIS WORK. What you actually care about and why you left
              employment to do it.]
            </p>
            <p>
              [WHERE YOU ARE NOW. Isle of Man, Barcelona, what you&apos;re
              building.]
            </p>
          </div>
        </Section>

        {/* Kept from the old site — these earn their place here, not on the
            main page. Prune anything that only proves employability. */}
        <Experience />
        <Skills />

        <Section id="about-cta" className="bg-[var(--color-card)]">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              [CLOSING LINE]
            </h2>
            <a
              href={calendlyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-md bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-accent-hover)]"
            >
              Book a call
            </a>
          </div>
        </Section>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
