/**
 * /about
 *
 * Every word here is Matt's, written 18–19 Aug. The canonical source and the
 * full decision record live in `business-log/content/2026-08-18-about-page.md`
 * — edit against that file, not this one, and change both together.
 *
 * Shape settled off his own read of Sara Soueidan, Brad Frost, Jonathan Stark
 * and Fernando Belotto: 250–350 words, first person, no arc story, no
 * chronology-first opening. It runs ~209, which he accepted — his standing
 * position is that short is fine.
 *
 * ⚠️ The middle block is deliberately NOT what-I-do-for-you. His argument on
 * 19 Aug: "surely if the website is already selling you on what the business
 * does for you, my about should stay away from about what I do for you." So it
 * is a body of work instead — the shape Frost and Soueidan use. Belotto's page
 * is the one that fills that slot with capability, and it is the only one of
 * the four that could belong to any other engineer.
 *
 * ⚠️ The stat tiles are gone. "Years Coding: 4" was arithmetic off the old 2022
 * story and is wrong — he started in 2021, confirmed 19 Aug — and the coffee
 * count incremented on a setInterval, which is a strange thing to sit beside a
 * paragraph selling meticulous attention to detail.
 *
 * This text also stands alone as LinkedIn's About. His call: same person
 * arriving from two directions.
 *
 * ⚠️ The opening of the middle block was replaced on 19 Aug — his call, "it
 * looks wack and doesn't read like the rest". It ran "I take a concept through
 * the entire product development lifecycle and pay meticulous attention to
 * detail at every stage", which is the Belotto register the rest of the page
 * avoids. What replaced it is his own line from my-story.md, and it moved up
 * to sit with "I work for myself now" so the projects stand on their own.
 */

export interface AboutData {
  /** The professional block. Sections 1 and 2, in order. */
  body: string[];
  /** Section 3 — the human line. One or two sentences, then stop. */
  beyondTheCode: string;
  avatarSrc?: string;
}

export const aboutData: AboutData = {
  avatarSrc: "/headshot.png",
  body: [
    "I'm an Isle of Man based Software Engineer, originally from Cape Town. I taught myself to code in 2021, dropped the marketing degree, and went all in.",
    "Since then, I've spent 4 years in fintech, building an efficient business bank account application process across UK offshore jurisdictions, and most recently at Stonehage Fleming, where I built an investment management platform managing $4bn in assets and trimmed a valuation pipeline from 30 minutes to under a minute.",
    "I work for myself now, building bespoke software for businesses that already know exactly what they need and have nobody to build it. When you're building software that manages serious data for serious clients, precision isn't optional.",
    "I am also the author of open-source project Ralph, an agentic process that takes a product specification and breaks it into chunks of work until it meets the goal, and Athena, an MCP-based personal knowledge vault that helps you make strategic decisions about your life.",
  ],
  beyondTheCode:
    "Beyond the business, I love spending time in nature and competing in endurance events. I make a mean flat white, and I'm currently immersing myself in Spanish culture and learning the language.",
};
