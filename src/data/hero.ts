export interface HeroData {
  name: string;
  subtitle: string;
  tagline: string;
  badges: string[];
  primaryCta: { label: string; href: string };
  secondaryLinks: { label: string; href: string }[];
  resumeLink: { label: string; href: string };
  availability: {
    status: "available" | "open" | "unavailable";
    message: string;
  };
}

export const heroData: HeroData = {
  name: "Matt Wilson",
  subtitle: "I build production AI systems that actually ship.",
  tagline:
    "Self-taught. No CS degree. 4 years shipping software that handles real money — from fintech platforms to autonomous AI developer tooling.",
  badges: [
    "TypeScript",
    "React Native",
    "Next.js",
    "NestJS",
    "Python",
    "AI/ML",
    "Azure",
    "Docker",
  ],
  primaryCta: {
    label: "Get in Touch",
    href: "mailto:mattwilsonbusiness25@gmail.com",
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
  availability: {
    status: "open",
    message: "Open to opportunities",
  },
};
