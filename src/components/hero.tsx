import { heroData } from "@/data/hero";
import { HeroMotif } from "./hero-motif";

/**
 * Above the fold.
 *
 * FULL-HEIGHT 17 Aug. The hero was content-sized (460px in a 682px viewport),
 * so the section below always showed on first paint — two competing headlines
 * in one screen, and the Wall spoiled before it could land as a reveal. It now
 * claims exactly one viewport minus the sticky nav.
 *
 * CENTRED STACK 17 Aug, testing the fernandobelotto.com shape at Matt's
 * request: eyebrow → name → statement → descriptor → CTA, all centred.
 *
 * The motif moves from a right-hand object to a full-width background wash.
 * Centred type and a right-aligned graphic fight each other, and the motif's
 * meaning — cells resolving left-to-right, part-built becoming finished —
 * survives being texture. It reads across the whole band rather than sitting
 * beside the words.
 *
 * The CTA returns to the hero. It was removed on the grounds that "Book a
 * call" is persistent in the nav, which is true, but this shape has an empty
 * space where the action belongs and the nav button is not where the eye is.
 * The nav now drops its wordmark and CTA on the home page so they aren't said
 * twice in one viewport — see nav.tsx.
 *
 * ⚠️ Typography is Inter throughout, per the site's own system. The reference
 * site used monospace for its small lines; borrowing that here would be wrong
 * twice over — it's someone else's voice, and on this site monospace already
 * means "this is code". The small-label treatment is the existing house one:
 * Inter semibold, uppercase, 0.18em tracking, accent or muted.
 *
 * ONE SMALL LINE, NOT TWO (17 Aug). The stack briefly carried an eyebrow
 * ("Independent software engineer") and a descriptor ("Bespoke software
 * development and automations") in identical treatments, top and bottom.
 * Two category lines at the same weight cancel each other and neither gets
 * read. The job title was scrapped and the category line promoted into the
 * eyebrow slot, which is the strongest position in the stack — accented,
 * rule-flanked, and read first. Matt's call.
 *
 * The stack is now: what this is → who → what they get → book.
 *
 * Not animated and no client JavaScript, so the type is there on first paint.
 */
export function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-[calc(100svh-var(--nav-h))] items-center justify-center overflow-hidden border-b border-[var(--color-border)] py-16 md:py-20"
    >
      {/* Accent bloom — depth instead of flat black. Decorative only. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-accent)] opacity-[0.08] blur-[120px]"
      />

      {/* Motif as a full-width band. 40 columns rather than 14, so stretching
          it across the viewport keeps the cells small and the left-to-right
          resolution legible — which is the whole point of the graphic. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 h-[340px] -translate-y-1/2 opacity-[0.5]"
      >
        <HeroMotif cols={40} rows={9} className="h-full w-full" />
      </div>

      <div className="relative mx-auto w-full max-w-3xl px-6 text-center">
        <div className="flex items-center justify-center gap-3">
          <span
            className="h-px w-8 bg-[var(--color-accent)]"
            aria-hidden="true"
          />
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
            {heroData.eyebrow}
          </span>
          <span
            className="h-px w-8 bg-[var(--color-accent)]"
            aria-hidden="true"
          />
        </div>

        <h1 className="mt-6 text-5xl font-bold leading-[0.95] tracking-tight md:text-7xl lg:text-8xl">
          {heroData.name}
        </h1>

        <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-[var(--color-muted)] md:text-xl">
          {heroData.statement}
        </p>

        <div className="mt-10">
          <a
            href={heroData.primaryCta.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full bg-[var(--color-accent)] px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]"
          >
            {heroData.primaryCta.label}
          </a>
        </div>
      </div>
    </section>
  );
}
