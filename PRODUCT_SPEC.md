# Personal Portfolio Website — Matt Wilson

## Overview

Build a production-ready personal portfolio website for Matt Wilson, a Senior Full Stack & AI Engineer. The site should be clean, professional, and corporate — inspired by [fernandobelotto.com/en](https://fernandobelotto.com/en). It must be fully SEO-optimised, support dark/light mode, and deploy to GitHub Pages.

## Tech Stack

- **Framework:** Next.js 15 (App Router, static export)
- **Styling:** Tailwind CSS v4
- **Font:** Inter (via next/font)
- **Deployment:** GitHub Pages (static export via `next export` / `output: 'export'`)
- **Package manager:** pnpm
- **TypeScript:** strict mode

### GitHub Pages Constraints

- Use `output: 'export'` in next.config — no server-side features (no API routes, no SSR, no middleware)
- Add a `.nojekyll` file to the output directory
- Configure `basePath` and `assetPrefix` if needed for GitHub Pages
- Add a GitHub Actions workflow for automated deployment (`.github/workflows/deploy.yml`)

## Design Direction

### Inspiration

Take strong design cues from [fernandobelotto.com/en](https://fernandobelotto.com/en):

- **Layout:** Clean single-page scroll with distinct sections
- **Typography:** Large, bold hero text (5xl-7xl) with lighter body text. Use Inter throughout
- **Spacing:** Generous whitespace, sections breathe
- **Cards:** Project cards in a responsive grid (1 col mobile, 2 col md, 3 col lg) with subtle hover effects (border highlight, slight scale)
- **Animations:** Subtle scroll-triggered fade-ins. Nothing flashy — professional and smooth. Use Framer Motion
- **Navigation:** Minimal top nav with anchor links (Home, About, Projects) + dark/light mode toggle
- **Overall feel:** Modern, minimal, tech-forward but corporate-clean. Not a "developer fun project" — this is a professional presence

### Colour Palette

- Light mode: White/off-white background, dark text, subtle grey borders, one accent colour (a professional blue like `#2563eb` or similar)
- Dark mode: Deep grey/near-black background (`#0a0a0a` or similar), light text, same accent
- Use CSS variables / Tailwind dark class for theme switching
- Persist theme choice in localStorage, respect system preference as default

### Responsive

- Mobile-first design
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Navigation collapses to hamburger on mobile
- All sections must look good on every breakpoint

## Sections & Content

### 1. Navigation (sticky top)

- Logo/name: "Matt Wilson" (left)
- Links: Home, About, Projects (anchor scroll)
- Dark/light mode toggle button (right)
- Hamburger menu on mobile

### 2. Hero Section

- Large heading: "Matt Wilson"
- Subtitle: Draft a sharp positioning line — NOT generic "Senior Full Stack & AI Engineer". Something that communicates what he actually does, e.g. "I build production AI systems that actually ship" or "End-to-end engineer — architecture to deployment, specialising in AI tooling." Make it punchy, confident, and specific.
- Short tagline (1-2 sentences): reinforce the positioning — self-taught, 4 years shipping production systems, currently building autonomous AI developer tooling
- Tech badge pills: TypeScript, React Native, Next.js, NestJS, Python, AI/ML, Azure, Docker
- Primary CTA: "Get in Touch" (mailto:mattwilsonbusiness25@gmail.com)
- Secondary links: "GitHub" (https://github.com/mattwilson02), "LinkedIn" (https://www.linkedin.com/in/matt-wilson-16a671212/)
- Subtle animated gradient or shimmer effect on the heading text

### 3. About Section

- Heading: "About"
- Professional bio (2-3 paragraphs). Tone: direct, confident, no fluff. Write like someone who ships, not someone who talks about shipping. Draft from these points:
  - Self-taught engineer — got into programming after discovering Bitcoin in 2022, wanted to contribute meaningfully to the community. Still has a goal to commit to Bitcoin Core one day
  - 4 years production experience, full-stack TypeScript specialist. Went from zero to leading full-stack builds on investment platforms and fintech apps
  - Currently building autonomous AI developer tooling (Ralph) and exploring the frontier of agentic systems. Core belief: a developer's most important skill is problem solving and critical thinking — the job is becoming about writing definitive specs and evaluating output, not typing code
  - Driven by adaptation and efficiency — building tools that let engineers focus on the hard problems
  - Based on the Isle of Man, working remotely
- A brief "Beyond the code" line or small section: runs ultra marathons, rides road bikes, cooks. Keep it to 1-2 sentences — humanising, not a lifestyle blog
- Placeholder avatar image (use a simple grey circle with initials "MW" as placeholder — make it a component that's easy to swap for a real image later)
- Key stats or highlights displayed visually (e.g. "4+ Years Experience", "2 Azure Certifications", "600+ Tests Written")

### Copy Style Guide (applies to all sections)

- **Tone:** Direct, confident, slightly dry. No buzzwords, no filler. Say it in one sentence if you can
- **Voice:** First person where it fits ("I build..."), but not every sentence. Mix in declarative statements
- **Avoid:** "Passionate about", "leveraging", "synergy", "cutting-edge", "seasoned professional", exclamation marks
- **Good examples:** "I build production AI systems that actually ship." / "Self-taught. No CS degree. 4 years shipping software that handles real money."
- **Bad examples:** "I'm a passionate developer who loves crafting elegant solutions!" / "Leveraging cutting-edge AI technologies to drive innovation!"

### 4. Experience Section

- Heading: "Experience"
- Timeline or card layout showing work history
- Use the Problem → Approach → Results structure where possible — focus on impact, not just what was built

**Stonehage Fleming · SF Digital** — Full Stack Engineer (Jan 2024 – Mar 2026)

*Investment Management Platform (Next.js 15, TypeScript, SQL Server, Prisma, Azure DevOps, Cypress):*
- Sole frontend architect and lead full-stack engineer on the primary internal tool for the Global Best Ideas division — client portfolios, valuations, transactions, and financial reporting
- Designed Clean Architecture end-to-end: 70 business use cases, 29 database models, 28 Prisma migrations including stored procedures for complex financial calculations
- Built 45 REST API endpoints and 18 application pages covering client management, portfolio proposals, transaction processing, fund dashboards, AUM reporting, and batch valuation generation
- Delivered automated valuation pipeline integrating external DocGen API, password-protected Excel output, and Azure File Share — replacing a previously manual process
- Set up Azure DevOps CI/CD from scratch (dev, UAT, PR validation) and established testing strategy (150 files across Vitest and Cypress)

*SF Mobile — iOS & Android Fintech App (React Native, Expo, TypeScript, TanStack Query, EAS, Maestro):*
- Lead engineer from inception to deployment — cross-platform app giving wealth management clients real-time access to portfolios, documents, and transactions
- Built complete auth/security system: MFA (email OTP, phone OTP, biometric Face ID / Touch ID), device recognition, JWT session management with platform-specific secure credential storage
- Delivered full financial feature set: dashboard, holdings (allocation/performance/value tabs with donut chart visualisation), transaction history with search/sort/filter, document management with infinite-scroll and native share-sheet
- 4-language internationalisation (English, Spanish, French, German) with runtime locale switching, Expo push notifications with deep-linked notification centre
- Engineering infrastructure: Jest + RNTL (52 test files), Maestro E2E suites (5 flows per platform), EAS Build profiles (dev/preview/UAT/prod), Kubb code generation from OpenAPI spec

*SF Mobile Backend API (NestJS, PostgreSQL, Prisma, BetterAuth, Azure Blob, Docker):*
- Key contributor within team of 3 — owned authentication, API layer, and test infrastructure across ~31,000-line TypeScript codebase with Domain-Driven Design and 8 bounded contexts
- Built multi-strategy auth using BetterAuth: email/password, Azure AD OAuth, phone OTP via Twilio, TOTP 2FA — with multi-step onboarding state machine
- 37+ REST API endpoints with OpenAPI/Swagger docs, Zod validation, Azure Blob Storage integration for signed-URL document workflows across 32 Prisma migrations
- 43 test files (Vitest + Supertest) with factory-based test data, mock repositories, and E2E testing against real PostgreSQL and Azurite

**AAO Holdings** — Software Engineer (Jun 2022 – Sep 2023)
- Contributed to a full-stack banking application and internal workflow dashboard using React, Node.js, and GraphQL
- Implemented multi-step due diligence workflow with complex conditional logic; serverless functions handling live user interactions in production
- Designed and built cross-departmental ticket system using state machine pattern — multiple departments with distinct workflow stages, escalation paths, and assignment rules
- Tech: JavaScript, TypeScript, React, GraphQL, Node.js, Docker, Vitest

### 5. Projects Section

- Heading: "Projects"
- Responsive grid of project cards (same style as fernandobelotto.com)
- Each card: title, short description, tech tags, link to GitHub repo
- Hover effect: subtle border colour change + slight scale

**Projects to include (use Problem → Approach → Results structure):**

1. **Ralph** — Autonomous AI Developer Agent
   - **Problem:** Building software is slow and repetitive — even with AI copilots, developers still manually orchestrate the build-test-fix-ship cycle
   - **Approach:** Zero-config autonomous sprint runner that reads your codebase, detects your tech stack, and executes full development pipelines: spec → build → verify → audit → ship. Multi-tier LLM routing (Opus for strategy, Sonnet for code). Supports TypeScript, Python, Go, Rust ecosystems
   - **Results:** Autonomously builds, verifies, and ships features — including creating PRs. Used to build this very website
   - Tech: TypeScript, Node.js, Claude API, Git
   - Link: https://github.com/mattwilson02/ralph

2. **Imperium** — AI Knowledge Management Platform
   - **Problem:** Personal knowledge scattered across Gmail, Drive, Calendar, and messaging apps with no unified structure or searchability
   - **Approach:** Multi-service architecture (Custodes, Sigillite, Cockpit, n8n) with cost-optimised Haiku → Sonnet → Opus LLM routing pipeline. Validates all structured output against governance schemas before committing to Obsidian vault. Claude MCP plugin integrations
   - **Results:** Deployed on Hetzner, used daily. 600+ tests at 93% coverage. Production-grade with CI/CD, Caddy reverse proxy, cron backups
   - Tech: Python, Flask, Docker, n8n, Anthropic API, Claude MCP, Hetzner
   - Link: https://github.com/mattwilson02/imperium (or placeholder)

3. **Athena** — AI Personal Assistant
   - **Problem:** Needed intelligent synthesis across a personal knowledge base — not just search, but understanding and contextual answers
   - **Approach:** RAG architecture with ChromaDB for vector storage and semantic querying, powered by Anthropic Claude API. Full-stack with Svelte frontend
   - **Results:** Functional and in active use. End-to-end self-directed product
   - Tech: Python, Flask, ChromaDB, Svelte, Anthropic API
   - Link: https://github.com/mattwilson02/athena (or placeholder)

### 6. Skills Section

- Heading: "Skills"
- Grouped by category, displayed as tag/pill clusters or a clean grid:
  - **Languages:** TypeScript, JavaScript, Python
  - **AI / ML:** Anthropic API, LLM Integration, RAG Pipelines, ChromaDB, Claude MCP, n8n
  - **Frontend:** Next.js 15, React 19, React Native (Expo), Svelte, Tailwind CSS
  - **Backend:** NestJS, Node.js, Flask, REST APIs, GraphQL, Prisma ORM
  - **Cloud & DevOps:** Azure, Docker, Hetzner VPS, Caddy, CI/CD
  - **Auth & Security:** Entra ID, BetterAuth, JWT, OAuth2, Biometric, MFA
  - **Testing:** Vitest, Cypress, Jest, Maestro, Supertest

### 7. Testimonials Section (placeholder)

- Heading: "What People Say" or "Testimonials"
- Scaffold 2-3 placeholder testimonial cards with:
  - Quote text (use placeholder: "Testimonial coming soon")
  - Name, role, company
  - Small avatar placeholder
- Style: subtle quote marks, card layout, clean typography
- Make it easy to swap in real testimonials later — keep data in a `src/data/testimonials.ts` file

### 8. Certifications Section (small, beneath skills)

- Microsoft Certified: Azure Developer Associate (Mar 2025)
- Microsoft Certified: Azure Fundamentals (Sep 2024)

### 9. Footer

- "Matt Wilson" + short tagline
- Social links: GitHub (https://github.com/mattwilson02), LinkedIn (https://www.linkedin.com/in/matt-wilson-16a671212/), Email (mattwilsonbusiness25@gmail.com)
- "Built with Next.js" or similar subtle credit
- Copyright line

## SEO Requirements

- Proper `<title>` tags per section: "Matt Wilson — Senior Full Stack & AI Engineer"
- Meta description optimised for search
- Open Graph tags (og:title, og:description, og:image, og:url)
- Twitter card meta tags
- Semantic HTML throughout (main, section, article, nav, header, footer)
- Proper heading hierarchy (single h1, h2 per section, etc.)
- `robots.txt` and `sitemap.xml` generated at build time
- Structured data (JSON-LD) for Person schema — include name, jobTitle, url, sameAs (GitHub, LinkedIn), knowsAbout (key skills). Validate with Google Rich Results Test
- Alt text on all images
- Canonical URL tags
- Fast page load — static export, optimised images, minimal JS bundle

## Accessibility

- Keyboard navigable
- Proper ARIA labels
- Skip-to-content link
- Sufficient colour contrast in both themes
- Focus indicators visible

## File Structure

```
mattwilson02.github.io/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Pages deployment
├── public/
│   ├── favicon.ico
│   ├── og-image.png            # Placeholder OG image
│   ├── robots.txt
│   └── .nojekyll
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with metadata
│   │   ├── page.tsx            # Main page composing all sections
│   │   └── globals.css         # Tailwind imports + CSS variables
│   ├── components/
│   │   ├── nav.tsx             # Sticky navigation
│   │   ├── hero.tsx            # Hero section
│   │   ├── about.tsx           # About section
│   │   ├── experience.tsx      # Experience timeline
│   │   ├── projects.tsx        # Projects grid
│   │   ├── skills.tsx          # Skills display
│   │   ├── certifications.tsx  # Certs section
│   │   ├── testimonials.tsx    # Testimonials section
│   │   ├── footer.tsx          # Footer
│   │   ├── theme-toggle.tsx    # Dark/light mode toggle
│   │   ├── avatar.tsx          # Placeholder avatar component
│   │   ├── section.tsx         # Reusable section wrapper
│   │   └── project-card.tsx    # Reusable project card
│   ├── data/
│   │   ├── projects.ts         # Project data
│   │   ├── experience.ts       # Experience data
│   │   ├── skills.ts           # Skills data
│   │   └── testimonials.ts    # Testimonials data
│   └── lib/
│       └── theme.ts            # Theme utilities
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

## Quality Bar

- Zero TypeScript errors in strict mode
- Zero ESLint warnings
- Lighthouse score 95+ on all categories (Performance, Accessibility, Best Practices, SEO)
- Builds successfully with `next build`
- All links work
- Both themes look polished
- Responsive at all breakpoints

## Out of Scope (for now)

- Blog / writing section
- Contact form
- CMS integration
- Analytics
- Custom domain setup
- Real headshot photo (placeholder for now)

## Contact Information (for footer/links only)

- GitHub: https://github.com/mattwilson02
- LinkedIn: https://www.linkedin.com/in/matt-wilson-16a671212/
- Email: mattwilsonbusiness25@gmail.com
