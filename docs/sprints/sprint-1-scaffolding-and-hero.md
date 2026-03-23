# Sprint 1 — Project Scaffolding, Navigation, Hero & Footer

## Overview

**Goal:** Bootstrap the Next.js 15 project from scratch and deliver a deployable single-page skeleton with navigation, hero section, footer, and dark/light theme support. This establishes the foundation — toolchain, file structure, design tokens, reusable patterns — that every future sprint builds on.

**Rationale:** Nothing exists yet. Before building content-heavy sections (Experience, Projects, Skills), we need a working build pipeline, GitHub Pages deployment, theme infrastructure, and the two highest-impact visual sections (hero + nav). A visitor landing on the site after this sprint should see a polished, responsive, theme-togglable page with Matt's positioning front and centre.

## What Exists

- `PRODUCT_SPEC.md` — full product specification
- Empty repo with a single commit on `main`
- No source code, no config files, no dependencies

## Architectural Decisions

These decisions apply to this sprint AND all future sprints. Builders must follow them.

### 1. Next.js 15 Static Export for GitHub Pages
- `output: 'export'` in `next.config.ts` — no server features anywhere
- All components are client components only where state is needed (theme toggle, mobile nav). Default to server components / no directive where possible
- `public/.nojekyll` must exist so GitHub Pages serves `_next/` correctly

### 2. Tailwind CSS v4 with CSS Variables for Theming
- Theme colours defined as CSS custom properties in `globals.css` (e.g. `--color-background`, `--color-foreground`, `--color-accent`)
- Dark mode via Tailwind's `class` strategy — a `.dark` class on `<html>`
- Accent colour: `#2563eb` (Tailwind `blue-600`)
- All colour references use the CSS variable tokens, never raw hex in components

### 3. Data-Driven Content
- Section content lives in `src/data/*.ts` files as typed arrays/objects
- Components import data and render it — no content hardcoded in JSX
- This enables future CMS migration and keeps components reusable

### 4. Component Conventions
- One component per file in `src/components/`
- Named exports (not default exports)
- Props interfaces defined inline or co-located
- `section.tsx` provides a reusable wrapper with consistent id, padding, and max-width — all page sections use it

### 5. Font: Inter via `next/font`
- Loaded in `layout.tsx` using `next/font/google`
- Applied to `<body>` via className

### 6. Deployment
- GitHub Actions workflow at `.github/workflows/deploy.yml`
- Triggers on push to `main`
- Runs `pnpm install` → `pnpm build` → deploys `out/` to GitHub Pages

## Tasks

### Task 1: Project Initialisation & Configuration

**Objective:** Set up the Next.js 15 project with all config files, dependencies, and build tooling so that `pnpm build` produces a valid static export.

**Files to create:**

| File | Purpose |
|------|---------|
| `package.json` | Dependencies: next@15, react@19, react-dom@19, tailwindcss@4, @tailwindcss/postcss, framer-motion, typescript, @types/react, @types/node, eslint, eslint-config-next. Scripts: dev, build, start, lint |
| `next.config.ts` | `output: 'export'`, `images: { unoptimized: true }` (required for static export) |
| `tsconfig.json` | Strict mode, path alias `@/*` → `src/*`, Next.js defaults |
| `postcss.config.mjs` | PostCSS config with `@tailwindcss/postcss` plugin (Tailwind v4 requirement) |
| `.github/workflows/deploy.yml` | GitHub Actions: checkout → setup pnpm → install → build → deploy `out/` to Pages |
| `public/.nojekyll` | Empty file — prevents Jekyll processing on GitHub Pages |

**Requirements:**
- `pnpm build` must succeed with zero errors on a clean install
- TypeScript strict mode enabled
- ESLint config extends `next/core-web-vitals` and `next/typescript`
- Node engine >= 20 specified in `package.json`
- The deploy workflow must use `actions/configure-pages`, `actions/upload-pages-artifact`, and `actions/deploy-pages`

**Acceptance Criteria:**
- `pnpm install && pnpm build` exits 0
- `out/` directory contains `index.html` and `_next/` assets
- TypeScript reports zero errors
- ESLint reports zero warnings

---

### Task 2: Global Styles, Theme Infrastructure & Root Layout

**Objective:** Establish the visual foundation — CSS variables, dark/light theme switching, Inter font, and the root layout that wraps every page.

**Files to create:**

| File | Purpose |
|------|---------|
| `src/app/globals.css` | Tailwind v4 imports (`@import "tailwindcss"`), CSS custom properties for light/dark themes, base body styles, smooth scroll |
| `src/app/layout.tsx` | Root layout: html lang, Inter font, metadata (title, description, OG tags, Twitter card, JSON-LD Person schema), skip-to-content link, ThemeProvider script |
| `src/lib/theme.ts` | Theme utility: inline script string to inject into `<head>` that reads localStorage / system preference and sets `.dark` class on `<html>` before paint (avoids flash of wrong theme) |

**Requirements — Theme System:**
- On first visit: respect `prefers-color-scheme` system preference
- On subsequent visits: use localStorage value (`theme` key) if set
- Theme script runs synchronously in `<head>` to prevent flash of unstyled content (FOUC)
- Toggling theme updates both the DOM class and localStorage

**Requirements — SEO Metadata (in layout.tsx):**
- `<title>`: "Matt Wilson — Senior Full Stack & AI Engineer"
- Meta description: concise, keyword-rich (full-stack, AI, TypeScript)
- Open Graph: og:title, og:description, og:type ("website"), og:url, og:image (point to `/og-image.png` placeholder)
- Twitter card: summary_large_image
- JSON-LD Person schema: name, jobTitle, url, sameAs (GitHub, LinkedIn), knowsAbout array
- Canonical URL: `https://mattwilson02.github.io`
- `<html lang="en">`

**Requirements — Accessibility:**
- Skip-to-content link as first focusable element, visually hidden until focused
- `<main id="main-content">` wraps page content

**CSS Variables to define (minimum set):**
```
--color-background (light: #ffffff, dark: #0a0a0a)
--color-foreground (light: #171717, dark: #ededed)
--color-muted (light: #737373, dark: #a3a3a3)
--color-border (light: #e5e5e5, dark: #262626)
--color-accent (both: #2563eb)
--color-accent-hover (both: #1d4ed8)
--color-card (light: #f9fafb, dark: #111111)
```

**Acceptance Criteria:**
- Page renders with Inter font
- No flash of wrong theme on load
- HTML source contains valid JSON-LD, OG tags, and meta description
- Skip-to-content link is present and functional via keyboard
- Both light and dark themes display correct colours

---

### Task 3: Sticky Navigation with Mobile Hamburger

**Objective:** Build the sticky top navigation bar with anchor links, dark/light toggle, and a responsive hamburger menu for mobile.

**Files to create:**

| File | Purpose |
|------|---------|
| `src/components/nav.tsx` | Sticky nav: logo/name left, anchor links centre/right, theme toggle right. Mobile hamburger with slide-down menu |
| `src/components/theme-toggle.tsx` | Button that toggles `.dark` on `<html>` and persists to localStorage. Sun/moon icon swap. Accessible label |

**Requirements — Navigation:**
- Sticky (`position: sticky`, `top: 0`, with backdrop blur and semi-transparent background)
- Left: "Matt Wilson" text link (scrolls to top)
- Links: Home (#home), About (#about), Projects (#projects) — these sections don't exist yet, but the anchors should be wired. Smooth scroll behaviour
- Right: Theme toggle button
- On scroll, nav should have a subtle bottom border or shadow to separate from content
- `<nav>` element with proper `aria-label="Main navigation"`

**Requirements — Mobile (below md breakpoint):**
- Links collapse behind a hamburger icon button
- Hamburger toggles an overlay or slide-down panel with the nav links
- Clicking a link closes the mobile menu
- `aria-expanded` on hamburger button
- Focus trap not required for v1, but menu should close on Escape key

**Requirements — Theme Toggle:**
- Renders sun icon in dark mode, moon icon in light mode (use simple inline SVGs, no icon library)
- `aria-label="Toggle dark mode"` / `"Toggle light mode"` based on state
- Calls the theme utility from `src/lib/theme.ts` or directly manipulates `document.documentElement.classList`

**Acceptance Criteria:**
- Nav sticks to top on scroll
- All anchor links scroll smoothly (even if target sections don't exist yet — no errors)
- Theme toggles correctly, persists across page reload
- Mobile menu opens/closes, links work
- Keyboard accessible: all interactive elements focusable, Escape closes mobile menu

---

### Task 4: Hero Section

**Objective:** Build the hero — the first thing visitors see. Large name, sharp positioning line, tech badges, and CTA links.

**Files to create:**

| File | Purpose |
|------|---------|
| `src/components/hero.tsx` | Hero section component |
| `src/components/section.tsx` | Reusable section wrapper (id, padding, max-width container) |
| `src/data/hero.ts` | Hero content data: name, subtitle, tagline, tech badges, CTA links |

**Requirements — Content (defined in `hero.ts`):**
- Name: "Matt Wilson"
- Subtitle: Draft a sharp, specific positioning line per the copy style guide. Not generic. Example directions: "I build production AI systems that actually ship" or "End-to-end engineer — from architecture to deployment, specialising in AI tooling"
- Tagline: 1-2 sentences reinforcing positioning. Self-taught, 4 years shipping production systems, currently building autonomous AI developer tooling
- Tech badges: TypeScript, React Native, Next.js, NestJS, Python, AI/ML, Azure, Docker
- Primary CTA: { label: "Get in Touch", href: "mailto:mattwilsonbusiness25@gmail.com" }
- Secondary links: GitHub (https://github.com/mattwilson02), LinkedIn (https://www.linkedin.com/in/matt-wilson-16a671212/)

**Requirements — Visual:**
- Name rendered at text-5xl (mobile) to text-7xl (desktop), font-bold
- Subtitle at text-xl to text-2xl, using `--color-muted`
- Tech badges as pill-shaped spans with subtle background and border
- CTAs as styled links/buttons — primary has accent background, secondary are ghost/outline style
- Subtle entrance animation using Framer Motion (fade-up on mount, staggered children). Keep it understated
- Section uses the `section.tsx` wrapper with `id="home"`
- Vertically centred or near-centred on viewport (min-height ~80-90vh on desktop)

**Requirements — `section.tsx` Wrapper:**
- Accepts: `id`, `className`, `children`
- Renders: `<section id={id} className={...}>` with max-width container (max-w-5xl or 6xl), horizontal padding, vertical padding (py-20 to py-32)
- All future sections will use this wrapper

**Acceptance Criteria:**
- Hero displays correctly on mobile, tablet, and desktop
- All links point to correct destinations and open appropriately (mailto for email, new tab for GitHub/LinkedIn)
- Framer Motion animation plays on page load
- Content is driven from `hero.ts` data file, not hardcoded in JSX
- Section wrapper is reusable and exported for other sections

---

### Task 5: Footer & Page Assembly

**Objective:** Build the footer and wire all components together on the main page so the site is complete and deployable.

**Files to create:**

| File | Purpose |
|------|---------|
| `src/components/footer.tsx` | Footer with name, tagline, social links, copyright |
| `src/app/page.tsx` | Main page composing Nav + Hero + Footer. Future sprints add sections here |

**Requirements — Footer:**
- "Matt Wilson" + short tagline
- Social links row: GitHub, LinkedIn, Email — use simple inline SVG icons (no icon library)
- Links open in new tab (except mailto) with `rel="noopener noreferrer"`
- "Built with Next.js" subtle credit line
- Copyright: "© 2026 Matt Wilson. All rights reserved."
- Semantic `<footer>` element
- Visually separated from content (top border or background change)

**Requirements — Page Assembly (`page.tsx`):**
- Import and render: `Nav` → `<main id="main-content">` containing `Hero` → `Footer`
- Clean, minimal — just composition
- This is the single entry point; future sprints add section components between Hero and Footer

**Requirements — Static Assets:**
- `public/robots.txt` — allow all crawlers, reference sitemap at `https://mattwilson02.github.io/sitemap.xml`
- `public/favicon.ico` — placeholder (can be a simple 1x1 transparent ico or any minimal placeholder)

**Acceptance Criteria:**
- Full page renders: Nav → Hero → Footer
- Footer links all work correctly
- `pnpm build` succeeds, `out/index.html` contains complete page
- `robots.txt` accessible at `/robots.txt` in build output
- Page is responsive across all breakpoints
- Both themes render the full page correctly
- Lighthouse audit: aim for 95+ across all categories (Performance, A11y, Best Practices, SEO)

## Implementation Order

1. **Task 1** — Project init & config (everything else depends on this)
2. **Task 2** — Global styles, theme, layout (foundation for all components)
3. **Task 3** — Navigation + theme toggle (needs theme infra from Task 2)
4. **Task 4** — Hero + section wrapper (needs layout from Task 2)
5. **Task 5** — Footer + page assembly (composes Tasks 3 & 4)

Tasks 3 and 4 can be built in parallel once Task 2 is complete.

## File Count

| Task | New Files | Total |
|------|-----------|-------|
| Task 1 | 6 | 6 |
| Task 2 | 3 | 9 |
| Task 3 | 2 | 11 |
| Task 4 | 3 | 14 |
| Task 5 | 4 | 18 |

**Note:** 18 files total, but 4 are zero-content or trivial config files (`.nojekyll`, `robots.txt`, `favicon.ico`, `postcss.config.mjs`). Core source files: 14. This is tight against the 15-file limit but appropriate for a scaffolding sprint where config files are unavoidable. If the builder needs to reduce, `robots.txt` and `favicon.ico` can be deferred.

## Definition of Done

- [ ] `pnpm install && pnpm build` exits 0 with zero TS errors and zero ESLint warnings
- [ ] Static export in `out/` contains complete `index.html` with all sections
- [ ] Dark/light theme toggles correctly and persists across reload
- [ ] Navigation is sticky, mobile hamburger works, all anchor links scroll smoothly
- [ ] Hero section displays name, positioning line, tech badges, and CTAs
- [ ] Footer displays social links, copyright, and credit
- [ ] Page is responsive at mobile (375px), tablet (768px), and desktop (1280px)
- [ ] SEO metadata present: title, meta description, OG tags, Twitter card, JSON-LD
- [ ] Skip-to-content link functional
- [ ] GitHub Actions deploy workflow file exists and is syntactically valid
- [ ] All interactive elements keyboard accessible

## What's Next (Sprint 2 Preview)

Sprint 2 will add the content-heavy sections: **About**, **Experience**, and **Projects** — leveraging the `section.tsx` wrapper and data-file pattern established here.
