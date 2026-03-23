export interface SkillCategory {
  category: string;
  skills: string[];
}

export const skillCategories: SkillCategory[] = [
  {
    category: "Languages",
    skills: ["TypeScript", "JavaScript", "Python"],
  },
  {
    category: "AI / ML",
    skills: [
      "Anthropic API",
      "LLM Integration",
      "RAG Pipelines",
      "ChromaDB",
      "Claude MCP",
      "n8n",
    ],
  },
  {
    category: "Frontend",
    skills: [
      "Next.js 15",
      "React 19",
      "React Native (Expo)",
      "Svelte",
      "Tailwind CSS",
    ],
  },
  {
    category: "Backend",
    skills: ["NestJS", "Node.js", "Flask", "REST APIs", "GraphQL", "Prisma ORM"],
  },
  {
    category: "Cloud & DevOps",
    skills: ["Azure", "Docker", "Hetzner VPS", "Caddy", "CI/CD"],
  },
  {
    category: "Auth & Security",
    skills: ["Entra ID", "BetterAuth", "JWT", "OAuth2", "Biometric", "MFA"],
  },
  {
    category: "Testing",
    skills: ["Vitest", "Cypress", "Jest", "Maestro", "Supertest"],
  },
];
