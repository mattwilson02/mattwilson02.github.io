# Sprint 2 — About, Experience & Projects

## Overview

**Goal:** Add the three content-heavy sections — About, Experience, and Projects — transforming the site from a hero-only landing page into a complete portfolio that communicates Matt's background, track record, and what he builds.

**Rationale:** The hero draws people in; these sections close the deal. A recruiter, hiring manager, or collaborator landing on the site needs to quickly understand: who Matt is (About), what he's delivered professionally (Experience), and what he builds independently (Projects). These are the highest-value sections remaining and they all follow the same data-file + section-wrapper pattern established in Sprint 1.

## What Exists

- **Fully working Sprint 1 build:** Nav (sticky, responsive, hamburger), Hero (animated, data-driven), Footer, dark/light theme with FOUC prevention
- **Established patterns:** `Section` wrapper component (`src/components/section.tsx`), data files in `src/data/*.ts` with typed interfaces, CSS variable theming, Framer Motion entrance animations, named exports, client components only where state is needed
- **Nav links already wired:** Home (`#home`), About (`#about`), Projects (`#projects`) — these anchors exist in `nav.tsx` but their target sections don't yet
- **Page composition in `page.tsx`:** Currently renders `Nav → Hero → Footer` — new sections slot between Hero and Footer

## Architectural Decisions

All Sprint 1 architectural decisions carry forward. Additional decisions for this sprint:

### 1. Scroll-Triggered Animations via Framer Motion `whileInView`
- Sprint 1 used `animate` (plays on mount) for the hero. Content sections below the fold should use `whileInView` with `once: true` so animations trigger when the user scrolls to them
- Use the same fade-up pattern as the hero (opacity 0→1, y 16→0, staggered children) for visual consistency
- Each section component is a client component (`"use client"`) only if it uses Framer Motion. If a section has no animation or interactivity, keep it as a server component

### 2. Experience and About Are Anchor Sections, Not Nav Items for Experience
- The nav already has Home, About, and Projects links. Experience sits between About and Projects visually but does not need its own nav link — the page scrolls naturally through it. Adding an "Experience" nav link is optional and should only be done if it doesn't crowd the nav. The builder should add it to the `navLinks` array in `nav.tsx` if it fits cleanly
- About uses `id="about"`, Experience uses `id="experience"`, Projects uses `id="projects"`

### 3. Project Card as a Reusable Component
- `project-card.tsx` is a standalone component that receives typed props — not coupled to the projects section
- This enables reuse if project cards appear elsewhere in future sprints

### 4. Content Follows the Product Spec Copy Style Guide
- Direct, confident, slightly dry tone. No buzzwords
- First person where it fits, mixed with declarative statements
- The product spec contains exact content for Experience roles and Project descriptions — use it verbatim as the data source, adapting only for formatting

## Tasks

### Task 1: About Section

**Objective:** Build the About section with professional bio, placeholder avatar, and key stats — giving visitors a quick read on who Matt is.

**Files to create:**

| File | Purpose |
|------|---------|
| `src/data/about.ts` | About section content: bio paragraphs, stats, beyond-the-code line |
| `src/components/about.tsx` | About section component |
| `src/components/avatar.tsx` | Placeholder avatar (grey circle with "MW" initials) |

**Requirements — Data (`about.ts`):**

Define and export a typed interface and data object containing:

- `bio`: Array of 2-3 paragraph strings. Draft from these product spec points:
  - Self-taught engineer — got into programming after discovering Bitcoin in 2022, wanted to contribute meaningfully to the community. Still has a goal to commit to Bitcoin Core one day
  - 4 years production experience, full-stack TypeScript specialist. Went from zero to leading full-stack builds on investment platforms and fintech apps
  - Currently building autonomous AI developer tooling (Ralph) and exploring the frontier of agentic systems. Core belief: a developer's most important skill is problem solving and critical thinking — the job is becoming about writing definitive specs and evaluating output, not typing code
  - Driven by adaptation and efficiency — building tools that let engineers focus on the hard problems
  - Based on the Isle of Man, working remotely
- `beyondTheCode`: A 1-2 sentence string. Runs ultra marathons, rides road bikes, cooks. Humanising, not a lifestyle blog
- `stats`: Array of `{ label: string; value: string }` — include "4+ Years Experience", "2 Azure Certifications", "600+ Tests Written"

**Follow the copy style guide:** Direct, confident, slightly dry. No buzzwords. "Self-taught. No CS degree. 4 years shipping software that handles real money." is the benchmark tone.

**Requirements — Avatar (`avatar.tsx`):**
- Renders a circular grey placeholder with "MW" initials centred
- Size prop (default ~80-96px) so it can scale
- Uses CSS variable colours (`--color-card` background, `--color-muted` text or similar)
- Easy to swap for a real `<Image>` later — the component should accept an optional `src` prop and render either the placeholder or a real image

**Requirements — About Component (`about.tsx`):**
- Uses the `Section` wrapper with `id="about"`
- Layout: heading "About" as `<h2>`, then a two-column layout on desktop (avatar + stats on one side, bio on the other). Single column on mobile with avatar centred above bio
- Bio paragraphs rendered from the data array
- Stats displayed visually — could be a row of highlight cards, a compact grid, or inline bold numbers. Keep it clean and scannable
- "Beyond the code" line at the bottom, visually distinct (slightly muted, smaller text)
- Scroll-triggered Framer Motion fade-in animation using `whileInView` with `once: true`

**Acceptance Criteria:**
- About section renders with correct anchor `id="about"`
- Nav "About" link scrolls to this section
- Avatar placeholder displays "MW" in a circle
- Bio reads well — tone matches the copy style guide
- Stats are scannable at a glance
- Responsive: single column on mobile, two-column on md+
- Animation triggers on scroll, plays once
- Content driven from `about.ts`, not hardcoded in JSX

---

### Task 2: Experience Section

**Objective:** Build the Experience section showing Matt's work history in a timeline or card layout, using the Problem → Approach → Results structure from the product spec.

**Files to create:**

| File | Purpose |
|------|---------|
| `src/data/experience.ts` | Experience entries: roles, companies, dates, descriptions, tech |
| `src/components/experience.tsx` | Experience section component with timeline/card layout |

**Requirements — Data (`experience.ts`):**

Define and export a typed interface and data array. Each entry needs:

- `company`: string (e.g. "Stonehage Fleming · SF Digital")
- `role`: string (e.g. "Full Stack Engineer")
- `period`: string (e.g. "Jan 2024 – Mar 2026")
- `projects`: Array of sub-project objects, each with:
  - `name`: string (e.g. "Investment Management Platform")
  - `techSummary`: string — parenthetical tech list from the product spec
  - `highlights`: string[] — bullet point descriptions

Use the EXACT content from the product spec's Experience section. Two companies:

1. **Stonehage Fleming · SF Digital** — Full Stack Engineer (Jan 2024 – Mar 2026)
   - Three sub-projects: Investment Management Platform, SF Mobile (iOS & Android), SF Mobile Backend API
   - Each has 4-5 bullet highlights as listed in the product spec

2. **AAO Holdings** — Software Engineer (Jun 2022 – Sep 2023)
   - Single project block with the 3 bullet highlights from the product spec
   - Tech line: JavaScript, TypeScript, React, GraphQL, Node.js, Docker, Vitest

**Requirements — Experience Component (`experience.tsx`):**
- Uses the `Section` wrapper with `id="experience"`
- Heading "Experience" as `<h2>`
- Layout: vertical timeline or stacked card layout. Each role is a distinct visual block showing company, role, period, then sub-projects with their highlights
- Timeline indicator: a vertical line or subtle left-border connecting entries (desktop). On mobile, stack simply without the timeline line if it doesn't work visually
- Sub-projects within a role should be visually grouped but distinguishable (e.g. project name as a sub-heading, tech summary in muted text, highlights as a clean bullet list)
- Tech summary displayed as muted parenthetical text or as small pills beneath each project name
- Scroll-triggered Framer Motion animation — stagger the role entries so they fade in one after another as the user scrolls

**Acceptance Criteria:**
- Experience section renders with `id="experience"`
- Both roles displayed with all sub-projects and highlights matching the product spec content
- Timeline/card layout is visually clean and scannable
- Responsive: readable on mobile without horizontal overflow
- Tech stacks visible for each sub-project
- Framer Motion scroll animation works
- Content driven from `experience.ts`

---

### Task 3: Projects Section with Project Cards

**Objective:** Build the Projects section as a responsive grid of project cards, each showing title, description, tech tags, and a GitHub link — matching the fernandobelotto.com card grid style.

**Files to create:**

| File | Purpose |
|------|---------|
| `src/data/projects.ts` | Project entries: title, description, problem/approach/results, tech, link |
| `src/components/project-card.tsx` | Reusable project card component |
| `src/components/projects.tsx` | Projects section component with responsive grid |

**Requirements — Data (`projects.ts`):**

Define and export a typed interface and data array. Each project needs:

- `title`: string
- `description`: string — short (1 sentence) summary for the card
- `problem`: string
- `approach`: string
- `results`: string
- `tech`: string[] — technology tags
- `link`: string — GitHub URL

Three projects from the product spec:

1. **Ralph** — Autonomous AI Developer Agent
   - Problem, Approach, Results as specified in the product spec
   - Tech: TypeScript, Node.js, Claude API, Git
   - Link: https://github.com/mattwilson02/ralph

2. **Imperium** — AI Knowledge Management Platform
   - Problem, Approach, Results as specified in the product spec
   - Tech: Python, Flask, Docker, n8n, Anthropic API, Claude MCP, Hetzner
   - Link: https://github.com/mattwilson02/imperium

3. **Athena** — AI Personal Assistant
   - Problem, Approach, Results as specified in the product spec
   - Tech: Python, Flask, ChromaDB, Svelte, Anthropic API
   - Link: https://github.com/mattwilson02/athena

**Requirements — Project Card (`project-card.tsx`):**
- Accepts typed props matching a single project entry
- Card displays: title (as a bold heading), short description, tech tags as pills (same pill style as hero badges — `--color-border` border, `--color-card` background), and a "View on GitHub" link
- The Problem → Approach → Results content can either be shown on the card directly (if space permits) or revealed on hover/expand. Recommendation: show `description` on the card face with the P→A→R detail visible below it, keeping cards informative but not overwhelming
- Hover effect: subtle border colour change to accent (`--color-accent`) and slight scale (scale-[1.02]) with smooth transition
- Card background uses `--color-card`, border uses `--color-border`
- The GitHub link should be the primary action — either the card itself is clickable or there's an explicit link/button
- Accessible: card links have descriptive text, not just "View"

**Requirements — Projects Section (`projects.tsx`):**
- Uses the `Section` wrapper with `id="projects"`
- Heading "Projects" as `<h2>`
- Responsive grid: 1 column on mobile, 2 columns on md, 3 columns on lg
- Cards should have equal height within each row (CSS grid handles this naturally)
- Scroll-triggered Framer Motion animation — stagger the cards

**Acceptance Criteria:**
- Projects section renders with `id="projects"`
- Nav "Projects" link scrolls to this section
- 3 project cards displayed in responsive grid
- Cards show title, description, tech pills, and GitHub link
- Hover effect works (border colour + scale)
- All GitHub links point to correct URLs and open in new tab
- Tech pills match the visual style of hero section badges
- Responsive: 1→2→3 column grid at breakpoints
- Content driven from `projects.ts`

---

### Task 4: Page Assembly & Navigation Update

**Objective:** Wire all new sections into the main page and update navigation to include Experience.

**Files to modify:**

| File | Change |
|------|--------|
| `src/app/page.tsx` | Add About, Experience, and Projects between Hero and Footer |
| `src/components/nav.tsx` | Add "Experience" link to `navLinks` array between About and Projects |

**Requirements — Page Assembly (`page.tsx`):**
- Section order: Nav → `<main>` → Hero → About → Experience → Projects → Footer
- Import all three new section components
- Keep the file minimal — just composition, no logic

**Requirements — Navigation Update (`nav.tsx`):**
- Add `{ label: "Experience", href: "#experience" }` to the `navLinks` array, positioned between About and Projects
- No other changes to nav — the existing smooth scroll and mobile menu behaviour applies automatically

**Acceptance Criteria:**
- All sections render in correct order on the page
- Scrolling flows naturally: Hero → About → Experience → Projects → Footer
- All four nav links (Home, About, Experience, Projects) scroll to their correct sections
- Mobile hamburger menu shows all four links
- `pnpm build` succeeds with zero TypeScript errors and zero ESLint warnings
- Both themes render all new sections correctly
- Page is responsive at all breakpoints (375px, 768px, 1280px)

## Implementation Order

1. **Task 1** — About section (independent, can start immediately)
2. **Task 2** — Experience section (independent, can be built in parallel with Task 1)
3. **Task 3** — Projects section (independent, can be built in parallel with Tasks 1 & 2)
4. **Task 4** — Page assembly & nav update (depends on Tasks 1-3 completing)

Tasks 1, 2, and 3 are fully independent and can be built in parallel. Task 4 wires everything together.

## File Count

| Task | New Files | Modified Files | Total New |
|------|-----------|----------------|-----------|
| Task 1 | 3 | 0 | 3 |
| Task 2 | 2 | 0 | 5 |
| Task 3 | 3 | 0 | 8 |
| Task 4 | 0 | 2 | 8 |

**8 new files, 2 modified files.** Well within the 15-file limit.

## Definition of Done

- [ ] `pnpm install && pnpm build` exits 0 with zero TS errors and zero ESLint warnings
- [ ] About section renders with bio, avatar placeholder, stats, and "beyond the code" line
- [ ] Experience section renders both roles with all sub-projects and highlights
- [ ] Projects section renders 3 cards in a responsive grid with hover effects
- [ ] All nav links (Home, About, Experience, Projects) scroll to correct sections
- [ ] Scroll-triggered Framer Motion animations work on all three new sections
- [ ] Content is data-driven: `about.ts`, `experience.ts`, `projects.ts` — no content hardcoded in JSX
- [ ] All sections use the `Section` wrapper component
- [ ] CSS variable theming applied — both light and dark themes look correct
- [ ] Responsive at mobile (375px), tablet (768px), and desktop (1280px)
- [ ] Project card hover effects work (border accent + subtle scale)
- [ ] All external links open in new tab with `rel="noopener noreferrer"`
- [ ] Copy tone matches the style guide: direct, confident, no buzzwords

## What's Next (Sprint 3 Preview)

Sprint 3 will add the remaining sections: **Skills**, **Certifications**, and **Testimonials** (placeholder) — completing the full single-page portfolio layout.
