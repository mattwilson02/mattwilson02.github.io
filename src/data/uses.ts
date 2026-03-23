export interface UsesTool {
  name: string;
  description: string;
  link?: string;
}

export interface UsesCategory {
  category: string;
  items: UsesTool[];
}

export const usesCategories: UsesCategory[] = [
  {
    category: "Editor & IDE",
    items: [
      {
        name: "VS Code",
        description:
          "Primary editor. Vim keybindings, minimal extensions, integrated terminal for everything.",
        link: "https://code.visualstudio.com",
      },
      {
        name: "Claude Code",
        description:
          "AI pair programmer. Used it to build Ralph and this portfolio. The future of development is conversational.",
        link: "https://claude.ai/claude-code",
      },
      {
        name: "Cursor",
        description:
          "AI-native editor for when I want inline completions alongside chat. Switches between this and VS Code depending on the task.",
        link: "https://cursor.sh",
      },
    ],
  },
  {
    category: "Terminal & CLI",
    items: [
      {
        name: "iTerm2",
        description:
          "Terminal emulator on macOS. Split panes, profiles per project, search that actually works.",
        link: "https://iterm2.com",
      },
      {
        name: "Zsh + Oh My Zsh",
        description:
          "Shell with git aliases and autocompletion. Nothing fancy — I don't spend time on shell customisation.",
        link: "https://ohmyz.sh",
      },
      {
        name: "pnpm",
        description:
          "Package manager for all TypeScript projects. Fast, disk-efficient, strict by default.",
        link: "https://pnpm.io",
      },
    ],
  },
  {
    category: "Languages & Frameworks",
    items: [
      {
        name: "TypeScript",
        description:
          "Default choice for everything. Strict mode always on. If I'm writing JavaScript, something has gone wrong.",
        link: "https://www.typescriptlang.org",
      },
      {
        name: "Next.js",
        description:
          "React framework for web apps. Static export for this site, full-stack for client projects.",
        link: "https://nextjs.org",
      },
      {
        name: "React Native (Expo)",
        description:
          "Cross-platform mobile. EAS Build for deployment. Maestro for E2E testing.",
        link: "https://expo.dev",
      },
      {
        name: "Python",
        description:
          "AI/ML work, scripting, backend services. Flask for APIs, not Django — I prefer assembling parts over batteries-included.",
        link: "https://www.python.org",
      },
      {
        name: "NestJS",
        description:
          "Enterprise-grade Node.js backend framework. Domain-driven design with decorators and dependency injection.",
        link: "https://nestjs.com",
      },
    ],
  },
  {
    category: "AI & LLMs",
    items: [
      {
        name: "Claude API (Anthropic)",
        description:
          "Primary LLM for all AI projects. Opus for strategy, Sonnet for code generation, Haiku for classification.",
        link: "https://www.anthropic.com",
      },
      {
        name: "ChromaDB",
        description:
          "Vector database for RAG pipelines. Simple, embeddable, good enough for personal-scale projects.",
        link: "https://www.trychroma.com",
      },
      {
        name: "n8n",
        description:
          "Workflow automation for connecting services. Self-hosted on Hetzner alongside Imperium.",
        link: "https://n8n.io",
      },
    ],
  },
  {
    category: "Infrastructure & DevOps",
    items: [
      {
        name: "Docker + Docker Compose",
        description:
          "Container orchestration for all deployable projects. Health checks, volume management, restart policies.",
        link: "https://www.docker.com",
      },
      {
        name: "Hetzner VPS",
        description:
          "Hosting for personal projects. Single server, Docker Compose, Caddy reverse proxy. Simple and cheap.",
        link: "https://www.hetzner.com",
      },
      {
        name: "Caddy",
        description:
          "Reverse proxy with automatic HTTPS. Replaced nginx and never looked back.",
        link: "https://caddyserver.com",
      },
      {
        name: "Azure DevOps",
        description:
          "CI/CD for client work at Stonehage Fleming. Pipelines, boards, repos.",
        link: "https://azure.microsoft.com/en-us/products/devops",
      },
      {
        name: "GitHub Actions",
        description:
          "CI/CD for personal projects. This site deploys via Actions on push to main.",
        link: "https://github.com/features/actions",
      },
    ],
  },
  {
    category: "Testing",
    items: [
      {
        name: "Vitest",
        description:
          "Unit and integration testing for all TypeScript projects. Fast, native ESM, compatible with Jest API.",
        link: "https://vitest.dev",
      },
      {
        name: "Cypress",
        description:
          "E2E testing for web apps. Reliable, good DX, snapshot testing when needed.",
        link: "https://www.cypress.io",
      },
      {
        name: "Maestro",
        description:
          "E2E testing for React Native. Simpler than Detox, YAML-based flows, runs on real devices.",
        link: "https://maestro.mobile.dev",
      },
    ],
  },
  {
    category: "Hardware",
    items: [
      {
        name: "MacBook Pro M3",
        description:
          "Primary development machine. 16GB RAM is enough for everything except large Docker builds.",
      },
      {
        name: "27\" Monitor",
        description:
          "Single external monitor. Ultrawide tempting but one big screen keeps me focused.",
      },
    ],
  },
];
