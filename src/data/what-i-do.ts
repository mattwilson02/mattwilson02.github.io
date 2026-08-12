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
  intro: string;
  items: WhatIDoItem[];
}

export const whatIDoData: WhatIDoData = {
  heading: "Built for how you actually work",

  intro:
    "Off-the-shelf software is built to fit an entire industry, which means it fits nobody exactly. You pay for the ninety percent you'll never open, and you still bend your process around the ten percent you needed. Building something that fits properly used to be too expensive to consider. It isn't any more.",

  items: [
    {
      title: "I start with what you've already built",
      body: "You've usually done the hardest part — worked out precisely what the thing needs to do. That prototype is a specification. I read it, and I ask about the parts of the job it doesn't show.",
    },
    {
      title: "Right-sized, not a platform",
      body: "No modules you'll never turn on, no subscription that climbs every year, no roadmap set by somebody else's customers. Your process, and the software that serves it.",
    },
    {
      title: "Driven, not generated",
      body: "I build with AI agents every day and they still get things confidently wrong. On my own tooling I've shipped a build, tested it by hand, and found fifteen defects the automated checks had passed. The machines do the typing. The judgement and the signature at the bottom are mine.",
    },
  ],
};
