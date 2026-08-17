/**
 * HOW THIS WORKS — the forwardable block.
 *
 * 🔴 The most important section on the page, and the one most consultancy
 * sites don't have.
 *
 * The real reader is not the person on the page. It's whoever they have to
 * convince, reading it second-hand. That person's question is not "can he do
 * it?" — it's "what happens if it goes wrong?" Capability evidence does not
 * answer that. This does.
 *
 * Every point is written to survive being lifted out on its own. No "as
 * mentioned above", no dependence on the section before it.
 *
 * ⚠️ Deliberately no insurance figures. Keane advised against disclosing PI
 * terms in the contract, on the basis that stating them creates an obligation
 * and buys nothing. The same logic applies here — "insured" reassures, a
 * number invites scrutiny of the number.
 */

export interface HowThisWorksPoint {
  label: string;
  body: string;
}

export interface HowThisWorksData {
  heading: string;
  points: HowThisWorksPoint[];
  forwardableSummary: string;
}

/**
 * The intro line was DELETED on 17 Aug, not relocated — Matt's call:
 * "completely unnecessary". It announced what the six points were about to
 * demonstrate, which is a preamble the points don't need.
 */
export const howThisWorksData: HowThisWorksData = {
  heading: "How working together works",

  points: [
    {
      label: "Fixed price, agreed up front",
      body: "You get a number before anything starts, and that's the number. No hourly meter, no invoice that grows while you're not looking.",
    },
    {
      label: "Delivered and paid in phases",
      body: "Each stage is quoted, started and signed off separately. You can stop between phases without losing what's already built.",
    },
    {
      label: "You own the code",
      body: "It sits in your repository from the first day, under your account. Ownership transfers to you as each phase is paid for, not at the end and not conditionally.",
    },
    {
      label: "Professionally insured",
      body: "Professional indemnity and public liability cover are in place, with cyber cover for anything touching personal data. Certificates available on request.",
    },
    {
      label: "Warranty after go-live",
      body: "Thirty days from the day each phase goes live. If delivered code doesn't do what it was demonstrated doing, it gets fixed at no charge.",
    },
    {
      label: "Changes are quoted, never assumed",
      body: "Anything outside what was agreed gets written down and re-quoted before a line of it is written. Scope creep becomes your decision rather than your surprise.",
    },
  ],

  // Never displayed — offered as a copy button. It restates the points above,
  // which is correct for something being pasted cold and pure bloat on screen.
  forwardableSummary:
    "The engagement is fixed-price and delivered in stages, so there's no open-ended commitment and no exposure to the full amount at any point. The code lives in our repository from day one and ownership transfers to us as each stage is paid. He carries professional indemnity, public liability and cyber cover, and there's a thirty-day warranty on each phase once it's live.",
};
