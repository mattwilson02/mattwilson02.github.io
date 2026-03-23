export interface AboutStat {
  label: string;
  value: string;
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
    "Self-taught. Got into programming after discovering Bitcoin in 2022 — fell down the rabbit hole, started building, and never stopped. 4 years later I'm shipping production software across investment platforms, fintech mobile apps, and AI tooling.",
    "I specialise in TypeScript across the full stack — Next.js, NestJS, React Native — and I've worked end-to-end on everything from frontend architecture to backend APIs to CI/CD pipelines. Currently building Ralph, an autonomous AI developer agent.",
    "Based on the Isle of Man, working remotely. I care most about writing software that works well and solving problems cleanly — the rest follows from that.",
  ],
  beyondTheCode:
    "Runs ultra marathons and rides bikes when not at a keyboard.",
  stats: [
    { label: "Years Experience", value: "4" },
    { label: "Azure Certifications", value: "2" },
    { label: "Projects Shipped", value: "10+" },
  ],
};
