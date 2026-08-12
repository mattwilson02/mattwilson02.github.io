export interface HeroData {
  eyebrow: string;
  headline: string;
  subline: string;
  primaryCta: { label: string; href: string };
}

/**
 * ⚠️ The one-liner was RETIRED here on 12 Aug.
 *
 * "I diagnose where a business is losing time, then build the software that
 * takes it back" was written on 10 Aug, before the ICP landed. It describes a
 * buyer with a vague pain who needs an expert to find it. The actual buyer has
 * already found it, already specified it, and already built the first 30% —
 * so there is nothing left to diagnose. Matt caught the contradiction.
 *
 * What replaces it is the June framing, which the rest of the page already
 * agrees with: a bridge between someone non-technical with a real idea and a
 * deployed application.
 *
 * (He still diagnoses — the gap between a prototype and a production system,
 * not the business problem. That belongs in What I Do, not the masthead.)
 */
export const heroData: HeroData = {
  eyebrow: "Independent software engineer",

  headline: "Bespoke software development and automations",

  subline:
    "You know what the business needs built. I take the idea the rest of the way — and carry the risk of getting there.",

  primaryCta: {
    label: "Book a call",
    href: "https://calendly.com/wilson-mjaw/discovery",
  },
};
