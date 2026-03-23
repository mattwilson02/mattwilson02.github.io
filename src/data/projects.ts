export interface ProjectLink {
  label: string;
  href: string;
}

export interface ProjectData {
  title: string;
  description: string;
  problem: string;
  approach: string;
  results: string;
  tech: string[];
  links: ProjectLink[];
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
    links: [
      { label: "GitHub", href: "https://github.com/mattwilson02/ralph-cli" },
      { label: "npm", href: "https://www.npmjs.com/package/ralph-agent" },
    ],
  },
  {
    title: "LeaseLink",
    description:
      "Full-stack property management platform — web dashboard for managers, mobile app for tenants. Built entirely with Ralph.",
    problem:
      "Property managers juggle spreadsheets, emails, and disconnected tools. Tenants have no transparent access to leases, payments, or maintenance status.",
    approach:
      "Turborepo monorepo with NestJS API (Domain-Driven Design, 11 bounded contexts), Next.js manager dashboard, and Expo React Native tenant app. Stripe payments, Expo push notifications, e-signatures, and Azure Blob document storage.",
    results:
      "Full platform with lease lifecycle management, automated rent collection, maintenance workflows, and multi-factor tenant onboarding. Built end-to-end by Ralph autonomously.",
    tech: ["TypeScript", "NestJS", "Next.js", "React Native", "Prisma", "PostgreSQL", "Stripe"],
    links: [
      { label: "GitHub", href: "https://github.com/mattwilson02/leaselink" },
    ],
  },
  {
    title: "Imperium",
    description:
      "AI knowledge management platform for businesses, with cost-optimised LLM routing and automated data ingestion.",
    problem:
      "Business knowledge scattered across Gmail, Drive, Calendar, and messaging apps with no unified structure or searchability.",
    approach:
      "Multi-service architecture (Custodes, Sigillite, Cockpit, n8n) with cost-optimised Haiku → Sonnet → Opus LLM routing pipeline. Validates all structured output against governance schemas before committing to Obsidian vault. Claude MCP plugin integrations.",
    results:
      "Deployed on Hetzner, used daily. 600+ tests at 93% coverage. Production-grade with CI/CD, Caddy reverse proxy, cron backups.",
    tech: ["Python", "Flask", "Docker", "n8n", "Anthropic API", "Claude MCP", "Hetzner"],
    links: [],
  },
  {
    title: "Athena",
    description:
      "Personal AI built on a living knowledge graph that reasons across your goals, relationships, finances, and decisions.",
    problem:
      "Generic AI assistants have no real context about you. They can't catch contradictions, track commitments, or give advice informed by your actual life.",
    approach:
      "Knowledge graph (180+ nodes, 7 domains) with conflict detection, adaptive response modes, permanence-scored retrieval, and accountability tracking. ChromaDB vector search with NetworkX graph traversal. Svelte 5 frontend with streaming chat and force-directed graph visualisation.",
    results: "In active daily use. Solo-built end-to-end, currently mid-Epoch 6 with Ralph handling remaining sprint work.",
    tech: ["Python", "Flask", "NetworkX", "ChromaDB", "Svelte", "Claude API"],
    links: [],
  },
];
