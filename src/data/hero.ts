export interface HeroData {
  name: string;
  subtitle: string;
  tagline: string;
  badges: string[];
  primaryCta: { label: string; href: string };
  secondaryLinks: { label: string; href: string }[];
  resumeLink: { label: string; href: string };
}

export const heroData: HeroData = {
  name: "Matt Wilson",
  subtitle: "Full Stack Engineer",
  tagline:
    "4 years shipping production software in regulated finance — investment platforms, fintech mobile apps, and the cloud infrastructure behind them.",
  badges: ["TypeScript", "Next.js", "NestJS", "React Native", "Azure"],
  primaryCta: {
    label: "Book a Call",
    href: "https://calendly.com/wilson-mjaw/discovery",
  },
  secondaryLinks: [
    {
      label: "GitHub",
      href: "https://github.com/mattwilson02",
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/matt-wilson-16a671212/",
    },
  ],
  resumeLink: {
    label: "Resume",
    href: "/matt-wilson-resume.pdf",
  },
};
