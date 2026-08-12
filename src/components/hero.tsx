import { heroData } from "@/data/hero";
import { HeroMotif } from "./hero-motif";

/**
 * Above the fold.
 *
 * No CTA — "Book a call" is persistent in the nav. Not animated and no client
 * JavaScript, so the headline is there on first paint.
 */
export function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden border-b border-[var(--color-border)] pb-16 pt-20 md:pb-24 md:pt-28"
    >
      {/* Soft accent bloom behind the motif — gives the right side some depth
          instead of flat black. Decorative only. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-1/2 hidden h-[420px] w-[620px] -translate-y-1/2 rounded-full bg-[var(--color-accent)] opacity-[0.07] blur-[110px] lg:block"
      />

      <div className="relative mx-auto w-full max-w-5xl px-6">
        <HeroMotif />

        <div className="relative max-w-3xl">
          <div className="flex items-center gap-3">
            <span
              className="h-px w-8 bg-[var(--color-accent)]"
              aria-hidden="true"
            />
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
              {heroData.eyebrow}
            </span>
          </div>

          <h1 className="mt-7 text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl lg:text-[3.5rem]">
            {heroData.headline}
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--color-muted)] md:text-xl">
            {heroData.subline}
          </p>
        </div>
      </div>
    </section>
  );
}
