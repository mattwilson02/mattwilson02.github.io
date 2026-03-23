export interface ExperienceProject {
  name: string;
  techSummary: string;
  highlights: string[];
}

export interface ExperienceEntry {
  company: string;
  role: string;
  period: string;
  projects: ExperienceProject[];
}

export const experienceData: ExperienceEntry[] = [
  {
    company: "Stonehage Fleming · SF Digital",
    role: "Full Stack Engineer",
    period: "Jan 2024 – Mar 2026",
    projects: [
      {
        name: "Investment Management Platform",
        techSummary:
          "Next.js 15, TypeScript, SQL Server, Prisma, Azure DevOps, Cypress",
        highlights: [
          "Sole frontend architect on the primary internal tool for the Global Best Ideas division — client portfolios, valuations, transactions, and financial reporting",
          "Designed Clean Architecture end-to-end: 70 business use cases, 29 database models, 28 Prisma migrations including stored procedures for complex financial calculations",
          "Built 45 REST API endpoints and 18 application pages covering client management, portfolio proposals, transaction processing, fund dashboards, AUM reporting, and batch valuation generation",
          "Delivered automated valuation pipeline integrating external DocGen API, password-protected Excel output, and Azure File Share — replacing a previously manual process",
          "Set up Azure DevOps CI/CD from scratch (dev, UAT, PR validation) and established testing strategy (150 files across Vitest and Cypress)",
        ],
      },
      {
        name: "SF Mobile — iOS & Android Fintech App",
        techSummary:
          "React Native, Expo, TypeScript, TanStack Query, EAS, Maestro",
        highlights: [
          "Lead engineer from inception to deployment — cross-platform app giving wealth management clients real-time access to portfolios, documents, and transactions",
          "Built complete auth/security system: MFA (email OTP, phone OTP, biometric Face ID / Touch ID), device recognition, JWT session management with platform-specific secure credential storage",
          "Delivered full financial feature set: dashboard, holdings (allocation/performance/value tabs with donut chart visualisation), transaction history with search/sort/filter, document management with infinite-scroll and native share-sheet",
          "4-language internationalisation (English, Spanish, French, German) with runtime locale switching, Expo push notifications with deep-linked notification centre",
          "Engineering infrastructure: Jest + RNTL (52 test files), Maestro E2E suites (5 flows per platform), EAS Build profiles (dev/preview/UAT/prod), Kubb code generation from OpenAPI spec",
        ],
      },
      {
        name: "SF Mobile Backend API",
        techSummary: "NestJS, PostgreSQL, Prisma, BetterAuth, Azure Blob, Docker",
        highlights: [
          "Key contributor within team of 3 — owned authentication, API layer, and test infrastructure across ~31,000-line TypeScript codebase with Domain-Driven Design and 8 bounded contexts",
          "Built multi-strategy auth using BetterAuth: email/password, Azure AD OAuth, phone OTP via Twilio, TOTP 2FA — with multi-step onboarding state machine",
          "37+ REST API endpoints with OpenAPI/Swagger docs, Zod validation, Azure Blob Storage integration for signed-URL document workflows across 32 Prisma migrations",
          "43 test files (Vitest + Supertest) with factory-based test data, mock repositories, and E2E testing against real PostgreSQL and Azurite",
        ],
      },
    ],
  },
  {
    company: "AAO Holdings",
    role: "Software Engineer",
    period: "Jun 2022 – Sep 2023",
    projects: [
      {
        name: "Banking & Workflow Platform",
        techSummary:
          "JavaScript, TypeScript, React, GraphQL, Node.js, Docker, Vitest",
        highlights: [
          "Contributed to a full-stack banking application and internal workflow dashboard using React, Node.js, and GraphQL",
          "Implemented multi-step due diligence workflow with complex conditional logic; serverless functions handling live user interactions in production",
          "Designed and built cross-departmental ticket system using state machine pattern — multiple departments with distinct workflow stages, escalation paths, and assignment rules",
        ],
      },
    ],
  },
];
