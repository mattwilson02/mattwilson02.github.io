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
    "Self-taught. No CS degree. Got into programming after discovering Bitcoin in 2022 — wanted to contribute meaningfully, not just hold. 4 years later I've shipped production software handling real money across investment platforms and fintech apps. Still have a goal to commit to Bitcoin Core one day.",
    "Full-stack TypeScript specialist. Went from zero to leading end-to-end builds: frontend architecture, backend APIs, cross-platform mobile, CI/CD, testing strategy. Currently building autonomous AI developer tooling (Ralph) and exploring what agentic systems can actually do — not the marketing version.",
    "My view on the job is shifting. The most important skill isn't typing code — it's problem solving and critical thinking. Writing definitive specs, evaluating output, knowing when to push back. Based on the Isle of Man, working remotely.",
  ],
  beyondTheCode:
    "Runs ultra marathons and road bikes when not at a keyboard. Also cooks.",
  stats: [
    { label: "Years Experience", value: "4+" },
    { label: "Azure Certifications", value: "2" },
    { label: "Tests Written", value: "600+" },
  ],
};
