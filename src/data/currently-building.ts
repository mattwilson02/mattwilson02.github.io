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
      "Autonomous AI developer agent. Zero-config sprint runner that reads your codebase, writes specs, builds, verifies, and ships — including opening PRs.",
    status: "active",
    tech: ["TypeScript", "Claude API", "Node.js"],
    link: "https://github.com/mattwilson02/ralph-cli",
  },
  {
    name: "Imperium",
    description:
      "AI knowledge management platform for businesses. Multi-service architecture with cost-optimised LLM routing, automated ingestion from Gmail, Drive, and Calendar.",
    status: "active",
    tech: ["Python", "Flask", "Docker", "Claude MCP"],
  },
  {
    name: "Athena",
    description:
      "AI personal assistant using RAG architecture with ChromaDB for vector storage and semantic querying across a knowledge base.",
    status: "active",
    tech: ["Python", "Flask", "ChromaDB", "Svelte", "Anthropic API"],
  },
  {
    name: "This Portfolio",
    description:
      "Built entirely by Ralph from sprint specs. Full SEO and zero manual code.",
    status: "shipped",
    tech: ["Next.js", "TypeScript", "Tailwind CSS"],
    link: "https://github.com/mattwilson02/mattwilson02.github.io",
  },
];
