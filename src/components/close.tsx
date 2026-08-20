import { Section } from "./section";
import { closeData } from "@/data/close";

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="mt-1 shrink-0 text-[var(--color-accent)]"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

/**
 * The close.
 *
 * Ambiguity about what happens next kills more conversions than weak copy
 * does, so this says plainly what the call is, what gets covered, and what
 * comes out of it. Split into two columns so it doesn't read as one more
 * paragraph at the end of a page of paragraphs.
 */
export function Close() {
  return (
    <Section id="contact" tone="band">
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-8 md:p-12">
        <div className="grid gap-10 md:grid-cols-2 md:gap-16">
          <div>
            <h2
              data-reveal
              className="text-3xl font-bold tracking-tight md:text-4xl"
            >
              {closeData.heading}
            </h2>

            <p
              data-reveal
              className="mt-5 text-lg leading-relaxed text-[var(--color-muted)]"
            >
              {closeData.body}
            </p>

            <div data-reveal className="mt-8">
              <a
                href={closeData.cta.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
              >
                {closeData.cta.label}
              </a>
            </div>
          </div>

          <div>
            <p
              data-reveal
              className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]"
            >
              What we cover
            </p>

            <ul className="mt-5 flex flex-col gap-3">
              {closeData.covers.map((item) => (
                <li
                  key={item}
                  data-reveal
                  className="flex gap-3 leading-relaxed"
                >
                  <CheckIcon />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}
