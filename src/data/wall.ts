/**
 * THE WALL — the recognition section.
 *
 * Carries almost all the weight of the page. There is no case study further
 * down to rescue it. If a stranger doesn't see themselves here, they bounce.
 *
 * ⚠️ Generalised on 12 Aug. The first version framed all of this around one
 * scenario — someone who prototyped with AI and hit a wall. That's a real pain
 * point and it made for good writing, but it describes one route to the gap
 * rather than the gap itself, and the only client who has ever paid would have
 * recognised himself in it immediately. That version is banked as a post in
 * Story Bank → Content Seeds.
 *
 * What the buyers actually have in common is narrower than a prototype and
 * broader than vibe coding: they know what needs building, and crossing the
 * distance to something the business runs on means owning the consequences.
 * However far along they are is a detail.
 *
 * HEADING REPLACED 17 Aug. "The idea isn't the hard part" spent its opening
 * words telling the reader that the thing they had done was the easy bit —
 * which is a strange way to open the section whose only job is recognition.
 * Matt's call, and his replacement leads with the destination rather than the
 * obstacle. "Alchemise" is the brand verb, doing work that "take" or "get"
 * can't.
 */

export interface WallData {
  heading: string;
  body: string[];
  kicker: string;
}

export const wallData: WallData = {
  heading: "Alchemise an idea into the tab nobody closes",

  body: [
    "You already know what the business needs, and roughly how you'd fix it. A document, a spreadsheet that half does the job, or something you've had a go at building yourself.",

    "Getting from there to something people open every morning is a different kind of work. Somewhere for it to live, accounts and permissions, a database holding real records. And all of it still standing on the days nobody is thinking about it.",

    "And that part isn't really about hours. It's whose name sits against it the first time it touches real money, and who picks up the phone when it breaks. Weighed against a job you already don't have enough time for, that's usually where a good idea stops.",
  ],

  kicker: "That's the part I take off you. The burden, not just the stack.",
};
