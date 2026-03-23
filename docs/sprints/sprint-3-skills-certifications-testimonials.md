# Sprint 3 — Skills, Certifications & Testimonials

## Overview

**Goal:** Add the final three content sections — Skills, Certifications, and Testimonials (placeholder) — completing the full single-page portfolio layout as defined in the product spec.

**Rationale:** The site now tells visitors who Matt is (About), what he's delivered (Experience), and what he builds independently (Projects). What's missing: a scannable skills inventory for recruiters doing keyword matching, professional certifications that add credibility, and a testimonials scaffold ready for real quotes. These are the last content sections before the site is feature-complete.

## What Exists

- **Fully working Sprint 1 + Sprint 2 build:** Nav (sticky, responsive, 4 anchor links: Home, About, Experience, Projects), Hero, About, Experience, Projects, Footer — all with dark/light theming and scroll-triggered Framer Motion animations
- **Established patterns:**
  - `Section` wrapper component (`src/components/section.tsx`) — all sections use it with `id`, consistent `py-20 md:py-28` padding, `max-w-5xl` container
  - Data files in `src/data/*.ts` with exported TypeScript interfaces and const data objects
  - CSS variable theming via `var(--color-*)` — background, foreground, muted, border, accent, accent-hover, card
  - Framer Motion `containerVariants` / `itemVariants` pattern with `whileInView="visible"` and `viewport={{ once: true, margin: "-100px" }}`
  - Named exports, `"use client"` only where Framer Motion or interactivity is used
  - Tech pill/badge style established in hero.tsx and project-card.tsx (small rounded spans with `--color-border` border and `--color-card` background)
- **Page composition in `page.tsx`:** Currently renders Nav → Hero → About → Experience → Projects → Footer — new sections slot between Projects and Footer
- **Nav links:** Home, About, Experience, Projects — a "Skills" link should be added if it fits

## Architectural Decisions

All Sprint 1 and Sprint 2 architectural decisions carry forward. Additional decisions for this sprint:

### 1. Skills Layout — Grouped Tag Clusters
- Skills are grouped by category (Languages, AI/ML, Frontend, Backend, etc.) and displayed as pill/tag clusters within each group
- Reuse the exact same pill styling from the hero tech badges and project card tech tags for visual consistency
- This is a display-only section — no interactivity beyond scroll animation

### 2. Certifications — Compact Sub-Section
- Certifications is a small section that sits directly below Skills, visually connected but with its own `id` and heading
- Only 2 entries — keep the layout minimal. A simple list or compact card pair, not a full grid

### 3. Testimonials — Placeholder Data with Real Structure
- Build the full component with real styling, but use placeholder content
- Data lives in `src/data/testimonials.ts` so real testimonials can be swapped in by editing one file
- Cards should look polished even with placeholder text — this section should feel "ready" not "broken"

### 4. Nav Update Strategy
- Add "Skills" to the nav links array. The nav already handles 4 links cleanly; 5 should still fit
- Do NOT add Certifications or Testimonials to the nav — they are secondary sections that the user scrolls to naturally

## Tasks

### Task 1: Skills Section

**Objective:** Build the Skills section displaying Matt's technical skills grouped by category as tag/pill clusters — scannable at a glance for recruiters and hiring managers.

**Files to create:**

| File | Purpose |
|------|---------|
| `src/data/skills.ts` | Skills data grouped by category |
| `src/components/skills.tsx` | Skills section component |

**Requirements — Data (`skills.ts`):**

Define and export a typed interface and data array. Structure:

```
interface SkillCategory {
  category: string;
  skills: string[];
}
```

Export a `skillCategories` array with these exact groups from the product spec:

- **Languages:** TypeScript, JavaScript, Python
- **AI / ML:** Anthropic API, LLM Integration, RAG Pipelines, ChromaDB, Claude MCP, n8n
- **Frontend:** Next.js 15, React 19, React Native (Expo), Svelte, Tailwind CSS
- **Backend:** NestJS, Node.js, Flask, REST APIs, GraphQL, Prisma ORM
- **Cloud & DevOps:** Azure, Docker, Hetzner VPS, Caddy, CI/CD
- **Auth & Security:** Entra ID, BetterAuth, JWT, OAuth2, Biometric, MFA
- **Testing:** Vitest, Cypress, Jest, Maestro, Supertest

**Requirements — Skills Component (`skills.tsx`):**
- Uses the `Section` wrapper with `id="skills"`
- Heading "Skills" as `<h2>`
- Layout: each category rendered as a labelled group. Category name as a sub-heading or bold label, followed by a flex-wrap row of pill tags
- Pill styling must match the existing tech badge style from hero.tsx and project-card.tsx — small rounded spans with subtle background (`--color-card`) and border (`--color-border`), foreground text
- Responsive: categories should flow naturally. On desktop, consider a 2-column or 3-column grid of category groups. On mobile, single column stack
- Scroll-triggered Framer Motion animation using the established `containerVariants` / `itemVariants` pattern with `whileInView` and `viewport={{ once: true, margin: "-100px" }}`
- Stagger the category groups so they fade in sequentially

**Acceptance Criteria:**
- Skills section renders with `id="skills"`
- All 7 skill categories displayed with correct skills in each
- Pill styling visually matches hero badges and project card tech tags
- Responsive: readable and well-laid-out at all breakpoints
- Framer Motion scroll animation triggers correctly
- Content driven from `skills.ts`, not hardcoded in JSX

---

### Task 2: Certifications Section

**Objective:** Build a compact Certifications section displaying Matt's Azure certifications — adding professional credibility beneath the skills inventory.

**Files to create:**

| File | Purpose |
|------|---------|
| `src/data/certifications.ts` | Certification entries |
| `src/components/certifications.tsx` | Certifications section component |

**Requirements — Data (`certifications.ts`):**

Define and export a typed interface and data array:

```
interface Certification {
  name: string;
  issuer: string;
  date: string;
}
```

Two entries from the product spec:

1. **Microsoft Certified: Azure Developer Associate** — Microsoft, Mar 2025
2. **Microsoft Certified: Azure Fundamentals** — Microsoft, Sep 2024

**Requirements — Certifications Component (`certifications.tsx`):**
- Uses the `Section` wrapper with `id="certifications"`
- Heading "Certifications" as `<h2>`
- Layout: compact — two small cards or a clean list. Each entry shows the certification name (bold), issuer, and date
- Since there are only 2 entries, a simple horizontal row on desktop (2 cards side by side) and vertical stack on mobile works well
- Cards should use `--color-card` background and `--color-border` border, consistent with the project cards
- Consider a small icon or badge indicator (a simple checkmark or shield SVG inline icon) to add visual interest — keep it minimal
- Scroll-triggered Framer Motion animation, same pattern as other sections

**Acceptance Criteria:**
- Certifications section renders with `id="certifications"`
- Both certifications displayed with name, issuer, and date
- Layout is compact and doesn't take up excessive vertical space
- Visually consistent with the rest of the site (card styling, colours, spacing)
- Responsive: stacks on mobile, side-by-side on md+
- Content driven from `certifications.ts`

---

### Task 3: Testimonials Section (Placeholder)

**Objective:** Scaffold a polished Testimonials section with placeholder content — structured so real testimonials can be swapped in by editing a single data file.

**Files to create:**

| File | Purpose |
|------|---------|
| `src/data/testimonials.ts` | Testimonial placeholder entries |
| `src/components/testimonials.tsx` | Testimonials section component |

**Requirements — Data (`testimonials.ts`):**

Define and export a typed interface and data array:

```
interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
}
```

Create 3 placeholder entries:

- Quote text: "Testimonial coming soon." for all three
- Use realistic-sounding placeholder names, roles, and companies (e.g. "Jane Smith", "Engineering Manager", "Acme Corp") — these will be replaced with real testimonials later
- The placeholder data should demonstrate the intended structure clearly

**Requirements — Testimonials Component (`testimonials.tsx`):**
- Uses the `Section` wrapper with `id="testimonials"`
- Heading "What People Say" as `<h2>`
- Layout: responsive grid of testimonial cards — 1 column on mobile, 2 on md, 3 on lg (same grid pattern as projects section)
- Each card displays:
  - A decorative open-quote mark (large, muted, positioned as a visual accent — e.g. a large `"` character or SVG quotation mark in `--color-accent` with reduced opacity)
  - The quote text in slightly larger or italicised body text
  - Below the quote: name (bold), role and company in muted text
- Card styling: `--color-card` background, `--color-border` border, consistent with project cards
- Scroll-triggered Framer Motion animation with staggered cards

**Acceptance Criteria:**
- Testimonials section renders with `id="testimonials"`
- 3 placeholder testimonial cards displayed in responsive grid
- Quote marks add visual interest without being overbearing
- Cards look polished even with placeholder content — the section should feel intentionally designed, not incomplete
- Swapping in real testimonials requires only editing `testimonials.ts`
- Responsive grid: 1→2→3 columns at breakpoints
- Content driven from `testimonials.ts`

---

### Task 4: Page Assembly & Navigation Update

**Objective:** Wire all new sections into the main page in the correct order and add Skills to the navigation.

**Files to modify:**

| File | Change |
|------|--------|
| `src/app/page.tsx` | Add Skills, Certifications, and Testimonials between Projects and Footer |
| `src/components/nav.tsx` | Add "Skills" link to `navLinks` array after Projects |

**Requirements — Page Assembly (`page.tsx`):**
- Section order: Nav → `<main>` → Hero → About → Experience → Projects → Skills → Certifications → Testimonials → Footer
- Import all three new section components
- Keep the file minimal — just composition

**Requirements — Navigation Update (`nav.tsx`):**
- Add `{ label: "Skills", href: "#skills" }` to the `navLinks` array, positioned after Projects
- Total nav links will be: Home, About, Experience, Projects, Skills
- No other changes to nav — existing smooth scroll and mobile menu behaviour applies automatically
- If 5 links feel crowded on mobile, the hamburger menu already handles overflow, so this should be fine

**Acceptance Criteria:**
- All sections render in correct order on the page
- Scrolling flows naturally: Hero → About → Experience → Projects → Skills → Certifications → Testimonials → Footer
- All five nav links (Home, About, Experience, Projects, Skills) scroll to correct sections
- Mobile hamburger menu shows all five links
- `pnpm build` succeeds with zero TypeScript errors and zero ESLint warnings
- Both themes render all new sections correctly
- Page is responsive at all breakpoints (375px, 768px, 1280px)

## Implementation Order

1. **Task 1** — Skills section (independent, can start immediately)
2. **Task 2** — Certifications section (independent, can be built in parallel with Task 1)
3. **Task 3** — Testimonials section (independent, can be built in parallel with Tasks 1 & 2)
4. **Task 4** — Page assembly & nav update (depends on Tasks 1-3 completing)

Tasks 1, 2, and 3 are fully independent and can be built in parallel. Task 4 wires everything together.

## File Count

| Task | New Files | Modified Files | Total New |
|------|-----------|----------------|-----------|
| Task 1 | 2 | 0 | 2 |
| Task 2 | 2 | 0 | 4 |
| Task 3 | 2 | 0 | 6 |
| Task 4 | 0 | 2 | 6 |

**6 new files, 2 modified files.** Well within the 15-file limit.

## Definition of Done

- [ ] `pnpm install && pnpm build` exits 0 with zero TS errors and zero ESLint warnings
- [ ] Skills section renders all 7 categories with correct skills, pill styling matches existing badges
- [ ] Certifications section renders both Azure certifications with name, issuer, and date
- [ ] Testimonials section renders 3 placeholder cards with quote marks, names, roles, and companies
- [ ] All nav links (Home, About, Experience, Projects, Skills) scroll to correct sections
- [ ] Scroll-triggered Framer Motion animations work on all three new sections
- [ ] Content is data-driven: `skills.ts`, `certifications.ts`, `testimonials.ts` — no content hardcoded in JSX
- [ ] All sections use the `Section` wrapper component
- [ ] CSS variable theming applied — both light and dark themes look correct on all new sections
- [ ] Responsive at mobile (375px), tablet (768px), and desktop (1280px)
- [ ] Testimonials data structure makes it trivial to swap in real quotes later
- [ ] Section order on page: Hero → About → Experience → Projects → Skills → Certifications → Testimonials → Footer

## What's Next (Sprint 4 Preview)

With all content sections complete, Sprint 4 focuses on **polish and production readiness**: sitemap.xml generation, OG image placeholder, Lighthouse audit fixes, final accessibility pass, and any visual refinements needed across the full page.
