/**
 * THE WALL — the recognition section.
 *
 * Carries almost all the weight of the page. There is no case study further
 * down to rescue it. If a stranger doesn't see themselves here, they bounce.
 *
 * Refined from Matt's own account, 12 Aug. The specifics are his and they are
 * the reason it works — "interactive picture", "localhost to their mate down
 * the aisle". Do not sand those off into generic copy.
 */

export interface WallData {
  heading: string;
  body: string[];
  kicker: string;
}

export const wallData: WallData = {
  heading: "A prototype isn't an application.",

  body: [
    "You spotted something in the business eating hours every week. You described it to an AI, and watched a version of the fix appear on screen. It was genuinely impressive — more than you could have made two years ago, and enough to prove the idea was right.",

    "Then you tried to actually use it. There's no way to log in. The data isn't real. You send the link to someone down the aisle and it won't open, because it only ever existed on your laptop. What you have is an interactive picture of the solution, not the solution.",

    "Closing that gap isn't a bigger version of what you just did. It's authentication, a database, somewhere for it to live, and somebody's name against it the first time it touches real money or real records. Weighed against a job you already don't have enough hours for, the honest cost isn't the time. It's the responsibility.",
  ],

  kicker: "That's the part I take off you — the burden, not just the stack.",
};
