export interface HeroData {
  /** The category line, in the accent treatment above the name. */
  eyebrow: string;
  /** The masthead. Sell Matt, not software. */
  name: string;
  /** The positioning sentence. The line that actually makes an argument. */
  statement: string;
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
 *
 * RESTRUCTURED 17 Aug, testing the fernandobelotto.com hero shape:
 *   eyebrow → NAME → statement → descriptor → CTA, centred.
 *
 * The important move is the demotion. "Bespoke software development and
 * automations" was the headline and it is a category label — it names a
 * service without making a claim, which is why it read as a directory entry
 * at 56px. As a small mono descriptor it does its job fine. The sentence that
 * was the subline carries the argument, so it moves up; and the masthead
 * becomes the name, which is what "sell Matt, not software" means literally.
 *
 * No new copy was written for this. Every string below already existed.
 */
export const heroData: HeroData = {
  eyebrow: "Bespoke software development and automations",

  name: "Matt Wilson",

  statement:
    "You know what the business needs. I take the idea the rest of the way.",

  primaryCta: {
    label: "Book a call",
    href: "https://calendly.com/mattwilsontech/discovery",
  },
};
