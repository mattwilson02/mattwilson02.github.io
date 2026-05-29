export interface SkillCategory {
  category: string;
  skills: string[];
}

export const skillCategories: SkillCategory[] = [
  {
    category: "Languages",
    skills: ["TypeScript", "JavaScript"],
  },
  {
    category: "Frontend",
    skills: ["Next.js 15", "React 19", "React Native (Expo)", "Svelte", "Tailwind CSS"],
  },
  {
    category: "Backend",
    skills: ["NestJS", "Node.js", "GraphQL", "Prisma ORM"],
  },
  {
    category: "Cloud & DevOps",
    skills: ["Azure", "Docker", "CI/CD"],
  },
  {
    category: "Auth & Security",
    skills: ["JWT", "OAuth2", "Biometric", "MFA"],
  },
  {
    category: "Testing",
    skills: ["Vitest", "Cypress", "Jest", "Maestro", "Supertest"],
  },
  {
    category: "AI / Workflow",
    skills: ["Claude Code", "Claude MCP"],
  },
];
