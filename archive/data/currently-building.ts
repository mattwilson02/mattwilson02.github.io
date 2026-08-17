export type ProjectStatus = "active" | "paused" | "shipped";

export interface CurrentProject {
  name: string;
  description: string;
  status: ProjectStatus;
  tech: string[];
  link?: string;
}

export const currentProjects: CurrentProject[] = [
  {
    name: "Ralph CLI",
    description:
      "Autonomous AI developer agent. Zero-config sprint runner that reads your codebase, writes specs, builds, verifies, and ships, including opening PRs.",
    status: "active",
    tech: ["TypeScript", "Claude API", "Node.js"],
    link: "https://github.com/mattwilson02/ralph-cli",
  },
  {
    name: "Tamp",
    description:
      "Gamified social learning platform for coffee craft. Animated POV brewing guides, attempt tracking with peer-review scoring, and a barista rank progression system.",
    status: "active",
    tech: ["React Native", "Expo", "NestJS", "PostgreSQL", "Prisma", "TypeScript"],
    link: "https://github.com/mattwilson02/tamp",
  },
  {
    name: "This Portfolio",
    description:
      "Built by Ralph from sprint specs. Full SEO and zero manual code.",
    status: "shipped",
    tech: ["Next.js", "TypeScript", "Tailwind CSS"],
    link: "https://github.com/mattwilson02/mattwilson02.github.io",
  },
];
