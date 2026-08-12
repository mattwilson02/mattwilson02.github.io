/**
 * THE CLOSE.
 *
 * Ambiguity about what happens next kills more conversions than weak copy
 * does. So this section says plainly what the call is, what gets covered, and
 * what comes out of it.
 *
 * Note this is where the "diagnose" idea belongs — not in the masthead. The
 * buyer has already diagnosed their business problem; what gets diagnosed on
 * the call is the current system and the gap to a working one.
 */

export interface CloseData {
  heading: string;
  body: string;
  covers: string[];
  cta: { label: string; href: string };
}

export const closeData: CloseData = {
  heading: "Start with a conversation",

  body: "No pitch, no charge. Thirty minutes, and you do most of the talking.",

  covers: [
    "How the task is handled right now, step by step",
    "Who touches it, and where it stalls",
    "The idea you've had, and what it would take to finish it",
  ],


  cta: {
    label: "Book a call",
    href: "https://calendly.com/wilson-mjaw/discovery",
  },
};
