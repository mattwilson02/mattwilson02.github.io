import { heroData } from "@/data/hero";
import { HeroMotif } from "./hero-motif";

/**
 * Above the fold.
 *
 * The bloom and the motif render at every size — they were desktop-only, which
 * left phones looking at flat black. On small screens the motif sits top-right
 * at lower opacity so it reads as texture behind the type; from lg it moves to
 * centre-right at full strength where there's room for it.
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
      {/* Accent bloom — depth instead of flat black. Decorative only. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-0 h-[320px] w-[420px] rounded-full bg-[var(--color-accent)] opacity-[0.10] blur-[90px] sm:-right-24 lg:-right-40 lg:top-1/2 lg:h-[420px] lg:w-[620px] lg:-translate-y-1/2 lg:opacity-[0.07] lg:blur-[110px]"
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
