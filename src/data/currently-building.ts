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
    name: "Ralph v2",
    description:
      "Next generation of the autonomous AI developer agent. Multi-repo orchestration, persistent context across sprints, and self-improving spec quality.",
    status: "active",
    tech: ["TypeScript", "Claude API", "Node.js"],
    link: "https://github.com/mattwilson02/ralph",
  },
  {
    name: "Imperium",
    description:
      "Personal knowledge management platform. Daily driver for unified access across Gmail, Drive, Calendar, and messaging — with cost-optimised LLM routing.",
    status: "active",
    tech: ["Python", "Flask", "Docker", "Claude MCP"],
    link: "https://github.com/mattwilson02/imperium",
  },
  {
    name: "This Portfolio",
    description:
      "Built entirely by Ralph from sprint specs. 13 sprints, 7 blog posts, full SEO, and zero manual code.",
    status: "shipped",
    tech: ["Next.js", "TypeScript", "Tailwind CSS"],
    link: "https://github.com/mattwilson02/mattwilson02.github.io",
  },
  {
    name: "Bitcoin Core Contribution",
    description:
      "Long-term goal. Studying the codebase, building C++ competency, identifying approachable first contributions.",
    status: "paused",
    tech: ["C++", "Bitcoin"],
  },
];
