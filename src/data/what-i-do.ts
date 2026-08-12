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
      title: "I start from what you already know",
      body: "You've usually done the hardest part — worked out precisely what the thing has to do. However that exists, written down or half-built, it's a specification. I read it, then ask about the parts of the job it doesn't show.",
    },
    {
      title: "Right-sized, not a platform",
      body: "Off-the-shelf software is built to fit an entire industry, which means it fits nobody exactly. You pay for the ninety percent you'll never open, and still bend your process around the ten percent you needed. Building something that fits properly used to be too expensive to consider. It isn't any more.",
    },
    {
      title: "Driven, not generated",
      body: "I build with AI agents every day — it's why something bespoke is realistic now rather than a six-figure project. They also get things confidently wrong: testing one of my own finished builds by hand, I found fifteen defects the automated checks had passed. Nothing reaches you that a person hasn't read.",
    },
  ],
};
