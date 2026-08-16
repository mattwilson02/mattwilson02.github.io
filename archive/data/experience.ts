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
    role: "Full Stack Developer",
    period: "Jan 2024 – Mar 2026",
    projects: [
      {
        name: "Investment Management Platform",
        techSummary:
          "Next.js 15, TypeScript, SQL Server, Prisma, Azure DevOps, Cypress",
        highlights: [
          "Replaced the manual Excel-and-email process the London team used to track clients, transactions and valuations across a fund holding roughly $4B in AUM, cutting valuation production from over thirty minutes to about one minute, removing hours of daily data entry and measurably improving record accuracy",
          "Sole frontend engineer on the primary internal tool for the Global Best Ideas division: client portfolios, valuations, transactions, and financial reporting",
          "Worked contract-first rather than waiting on endpoints: agreed the data contract with the backend engineer up front, built against a mock API, then enforced the generated OpenAPI types against my implementation. The first integration against the real API produced zero errors, and both halves shipped the same day",
          "Designed Clean Architecture end-to-end: 70 business use cases, 29 database models, 28 Prisma migrations including stored procedures for complex financial calculations",
          "Built 45 REST API endpoints and 18 application pages covering client management, portfolio proposals, transaction processing, fund dashboards, AUM reporting, and batch valuation generation",
          "Delivered the automated valuation pipeline integrating an external DocGen API, password-protected Excel output, and Azure File Share, built around the storage I was given rather than the storage I asked for",
          "Set up Azure DevOps CI/CD from scratch (dev, UAT, PR validation) and established the testing strategy (150 files across Vitest and Cypress)",
          "Led the shared component library's migration to compound components: 15 components solo in a week, taking components carrying 10+ conditional props down to single-responsibility atoms at 90% coverage, which cut the styling regressions reaching production",
        ],
      },
      {
        name: "SF Mobile: iOS & Android Fintech App",
        techSummary:
          "React Native, Expo, TypeScript, TanStack Query, EAS, Maestro",
        highlights: [
          "Owned end to end from inception to deployment, roughly 95% solo. A cross-platform app giving wealth management clients real-time access to portfolios, documents, and transactions, delivered in six months",
          "Built the complete auth/security system: MFA (email OTP, phone OTP, biometric Face ID / Touch ID), device recognition, JWT session management with platform-specific secure credential storage, finding and closing real biometric vulnerabilities on physical test devices before release",
          "Delivered the full financial feature set: dashboard, holdings (allocation/performance/value tabs with donut chart visualisation), transaction history with search/sort/filter, document management with infinite-scroll and native share-sheet",
          "4-language internationalisation (English, Spanish, French, German) with runtime locale switching, Expo push notifications with deep-linked notification centre",
          "Engineering infrastructure: Jest + RNTL (52 test files), Maestro E2E suites (5 flows per platform), EAS Build profiles (dev/preview/UAT/prod), Kubb code generation from OpenAPI spec",
        ],
      },
      {
        name: "SF Mobile Backend API",
        techSummary: "NestJS, PostgreSQL, Prisma, BetterAuth, Azure Blob, Docker",
        highlights: [
          "Identified that our third-party auth provider hosted data in the US and could not satisfy EU requirements for our client base. Proposed and built a self-hosted replacement on BetterAuth, delivered in under a sprint because the domain-driven design let me swap the provider behind an existing repository contract instead of rewriting every consumer",
          "Built and owned the service roughly 95% solo: authentication, the API layer, and test infrastructure across a ~31,000-line TypeScript codebase with Domain-Driven Design and 8 bounded contexts",
          "Kept delivery on schedule against a blocked infrastructure backlog by emulating Azure Blob Storage locally with Azurite in Docker Compose, building the document workflow against the real SDK so it moved onto provisioned resources with no code change",
          "Ended two years of recurring CI failures in a single conversation: our container registry pipeline broke every few months on manually rotated credentials. Rather than escalate as others had, I approached the cloud team directly and proposed Workload Identity Federation as a mutual win. Implemented in forty minutes, and the failure never recurred",
          "Built multi-strategy auth using BetterAuth: email/password, Azure AD OAuth, phone OTP via Twilio, TOTP 2FA, with a multi-step onboarding state machine",
          "37+ REST API endpoints with OpenAPI/Swagger docs, Zod validation, Azure Blob Storage integration for signed-URL document workflows across 32 Prisma migrations",
          "43 test files (Vitest + Supertest) with factory-based test data, mock repositories, and E2E testing against real PostgreSQL and Azurite",
        ],
      },
    ],
  },
  {
    company: "AAO Holdings",
    role: "Junior → Intermediate Software Developer",
    period: "Jun 2022 – Sep 2023",
    projects: [
      {
        name: "Banking & Workflow Platform",
        techSummary:
          "JavaScript, TypeScript, React, GraphQL, Node.js, Docker, Vitest",
        highlights: [
          "Implemented a four-part customer onboarding flow in collaboration with a senior engineer, handling complex conditional state across regulated banking KYC steps",
          "Moved myself across the stack rather than waiting on others: identified that depending on senior engineers for GraphQL integration was slowing my delivery, asked to be taught it directly, and within a week was integrating endpoints independently and unblocking teammates, going on to build backend endpoints and unit tests alongside frontend work",
          "Contributed to the design and build of a cross-departmental ticket system using a state machine pattern: distinct workflow stages, escalation paths, and assignment rules per department",
          "Built custom reusable components including a MultiSelect, reducing dependency on NativeBase and improving application performance",
          "Owned internationalisation configuration across a multi-language React Native banking application",
        ],
      },
    ],
  },
];
