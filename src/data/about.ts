export interface AboutStat {
  label: string;
  value: string;
  ticker?: boolean;
}

export interface AboutData {
  bio: string[];
  beyondTheCode: string;
  stats: AboutStat[];
  avatarSrc?: string;
}

export const aboutData: AboutData = {
  avatarSrc: "/headshot.png",
  bio: [
    "Got into programming after discovering Bitcoin in 2022. Fell down the rabbit hole, started building, and never stopped. 4 years later I've shipped production-ready fintech applications, including an investment management platform handling $4B in AUM.",
    "I specialise in TypeScript across the full stack, and I care about producing code that outlives itself, through thorough test coverage, clean architecture, and high standards at every layer of delivery. The work I'm proudest of tends to be the unglamorous kind: cutting a half-hour valuation process down to a minute, or rebuilding an authentication system in-house because the incumbent couldn't meet EU compliance.",
    "Currently deepening my Azure expertise, working towards Solutions Architect certification after AZ-104.",
  ],
  beyondTheCode:
    "Enthusiastic amateur athlete and wannabe barista: two ultra marathons, a few questionable flat whites, and a helmet-strap tan from hundreds of hours on the road bike.",
  stats: [
    { label: "Years Coding", value: "4" },
    { label: "Location", value: "Isle of Man" },
    { label: "Coffees Consumed", value: "1000", ticker: true },
  ],
};
