/**
 * WHAT I DO — the bridge.
 *
 * Closes the second escape route. The wall answers "why can't I finish this
 * myself"; this answers "why shouldn't I just buy something off the shelf".
 * A generic product makes you pay a generalisation tax for being one instance
 * of an industry — which is exactly why Jacob's team scoped Re-Leased and
 * called it overkill.
 *
 * ⚠️ Do NOT name an industry. ⚠️ Lead with their wall, not the word
 * "production-grade" — that's Matt's standard, not their problem.
 */

export interface WhatIDoItem {
  title: string;
  body: string;
}

export interface WhatIDoData {
  heading: string;
  items: WhatIDoItem[];
}

export const whatIDoData: WhatIDoData = {
  heading: "Built for how you actually work",


  items: [
    {
      title: "Your specification is the starting point",
      body: "A document, a spreadsheet, or something half-built. It gets used, not replaced. What I ask about is the rest: who uses it, what it connects to, and what happens when it breaks.",
    },
    {
      title: "Tailored to your business",
      body: "Off-the-shelf software is built for a whole industry, so you pay for features you never open and bend your process to fit theirs. Yours is built round how you already work, and it's yours to keep.",
    },
    {
      title: "Supercharge your workflows",
      body: "You're doing the same thirty-minute job again, and it's costing you the thing you'd rather be spending on the business. We turn that work into something that runs itself, and hand the time back.",
    },
  ],
};
