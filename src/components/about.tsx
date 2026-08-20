import { Section } from "./section";
import { Avatar } from "./avatar";
import { Breadcrumbs } from "./breadcrumbs";
import { aboutData } from "@/data/about";

/**
 * ABOUT — its own page, not a home-page section.
 *
 * It was a two-column block with a headshot, three stat tiles and the
 * employability bio, and nothing rendered it. What replaced it is a single
 * measured column, because the page is 209 words of prose and a grid around
 * that much text is scaffolding with nothing to hold up.
 *
 * Header band → prose on base → Close on band, which is the same alternating
 * rhythm the home page and /blog already use.
 *
 * The last paragraph is separated by a rule rather than a "Beyond the code"
 * label. Stark's About does the same thing and the shift in register does the
 * signposting on its own.
 *
 * ⚠️ The header block is deliberately NOT revealed. It is above the fold on
 * every viewport, so animating it in delays the first thing the reader looks
 * at in exchange for nothing.
 */
export function About() {
  return (
    <>
      <Section id="about" tone="band" className="pt-28 md:pt-32">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />

        <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
          <div className="shrink-0">
            <Avatar size={88} src={aboutData.avatarSrc} />
          </div>

          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            About
          </h1>
        </div>
      </Section>

      <Section id="about-body">
        <div className="flex max-w-2xl flex-col gap-6">
          {aboutData.body.map((paragraph) => (
            <p
              key={paragraph.slice(0, 32)}
              data-reveal
              className="text-base leading-relaxed text-[var(--color-muted)] md:text-lg"
            >
              {paragraph}
            </p>
          ))}

          <p
            data-reveal
            className="mt-4 border-t border-[var(--color-border)] pt-6 text-base leading-relaxed text-[var(--color-muted)] md:text-lg"
          >
            {aboutData.beyondTheCode}
          </p>
        </div>
      </Section>
    </>
  );
}
