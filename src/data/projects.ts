export interface ProjectData {
  title: string;
  description: string;
  problem: string;
  approach: string;
  results: string;
  tech: string[];
  link: string;
}

export const projectsData: ProjectData[] = [
  {
    title: "Ralph",
    description:
      "Autonomous AI developer agent that reads your codebase and executes full development pipelines.",
    problem:
      "Building software is slow and repetitive — even with AI copilots, developers still manually orchestrate the build-test-fix-ship cycle.",
    approach:
      "Zero-config autonomous sprint runner that reads your codebase, detects your tech stack, and executes full development pipelines: spec → build → verify → audit → ship. Multi-tier LLM routing (Opus for strategy, Sonnet for code). Supports TypeScript, Python, Go, Rust ecosystems.",
    results:
      "Autonomously builds, verifies, and ships features — including creating PRs. Used to build this very website.",
    tech: ["TypeScript", "Node.js", "Claude API", "Git"],
    link: "https://github.com/mattwilson02/ralph",
  },
  {
    title: "Imperium",
    description:
      "AI knowledge management platform unifying personal data across services with cost-optimised LLM routing.",
    problem:
      "Personal knowledge scattered across Gmail, Drive, Calendar, and messaging apps with no unified structure or searchability.",
    approach:
      "Multi-service architecture (Custodes, Sigillite, Cockpit, n8n) with cost-optimised Haiku → Sonnet → Opus LLM routing pipeline. Validates all structured output against governance schemas before committing to Obsidian vault. Claude MCP plugin integrations.",
    results:
      "Deployed on Hetzner, used daily. 600+ tests at 93% coverage. Production-grade with CI/CD, Caddy reverse proxy, cron backups.",
    tech: ["Python", "Flask", "Docker", "n8n", "Anthropic API", "Claude MCP", "Hetzner"],
    link: "https://github.com/mattwilson02/imperium",
  },
  {
    title: "Athena",
    description:
      "AI personal assistant with RAG architecture for intelligent synthesis across a personal knowledge base.",
    problem:
      "Needed intelligent synthesis across a personal knowledge base — not just search, but understanding and contextual answers.",
    approach:
      "RAG architecture with ChromaDB for vector storage and semantic querying, powered by Anthropic Claude API. Full-stack with Svelte frontend.",
    results: "Functional and in active use. End-to-end self-directed product.",
    tech: ["Python", "Flask", "ChromaDB", "Svelte", "Anthropic API"],
    link: "https://github.com/mattwilson02/athena",
  },
];
