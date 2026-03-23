# Sprint 4 — Polish & Production Readiness

## Overview

**Goal:** Harden the site for production: fill missing static assets (sitemap, OG image), fix scroll UX issues from the sticky nav, add active nav link highlighting, improve accessibility (reduced motion, dark mode focus rings), and add a 404 page. After this sprint the site is launch-ready.

**Rationale:** All content sections are built and functional. But several production gaps remain: robots.txt references a sitemap.xml that doesn't exist, layout.tsx points to an og-image.png that's missing from `public/`, anchor links scroll behind the sticky nav, there's no visual indicator of which section is active in the nav, Framer Motion animations ignore `prefers-reduced-motion`, and there's no 404 page for GitHub Pages. These are the details that separate "works locally" from "ready to ship."

## What Exists

- **Full single-page portfolio:** Nav (5 links: Home, About, Experience, Projects, Skills), Hero, About, Experience, Projects, Skills, Certifications, Testimonials, Footer — all with dark/light theming and scroll-triggered Framer Motion animations
- **Established patterns:**
  - `Section` wrapper (`src/components/section.tsx`): `id`, `py-20 md:py-28`, `max-w-5xl`, `px-6`
  - Data files in `src/data/*.ts` with typed interfaces
  - CSS variables via `var(--color-*)` in `globals.css`
  - Framer Motion `containerVariants` / `itemVariants` with `whileInView="visible"` and `viewport={{ once: true, margin: "-100px" }}`
  - Named exports, `"use client"` only where needed
  - Tech pill style: `rounded-full border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-1 text-xs font-medium`
- **Static assets in `public/`:** `.nojekyll`, `robots.txt`, `favicon.ico` — but NO `og-image.png` and NO `sitemap.xml`
- **SEO metadata in `layout.tsx`:** References `/og-image.png` (missing) and robots.txt references `sitemap.xml` (missing)
- **Sticky nav height:** Approximately 64px (py-4 + content). Anchor links scroll content behind the nav
- **Nav links:** No active state highlighting — all links use the same `text-[var(--color-muted)]` colour regardless of scroll position
- **Animations:** No `prefers-reduced-motion` handling — all Framer Motion animations play regardless of user preference
- **No 404 page:** GitHub Pages will show its default 404

## Architectural Decisions

All previous sprint architectural decisions carry forward. Additional decisions for this sprint:

### 1. Sitemap as a Static File in `public/`
- Since this is a single-page static site with one URL, a hand-written `public/sitemap.xml` is simpler and more reliable than Next.js's `sitemap.ts` (which has edge cases with `output: 'export'`)
- Single `<url>` entry pointing to `https://mattwilson02.github.io/`
- This matches what `robots.txt` already references

### 2. OG Image as a Static Asset
- Next.js dynamic OG image generation (`ImageResponse`) requires server features and is incompatible with `output: 'export'`
- Create a static `public/og-image.png` at 1200x630px — the standard OG image dimensions
- The builder should generate this programmatically (e.g. using a canvas script, or a simple SVG-to-PNG approach) with Matt's name, title, and the accent colour. It does not need to be complex — clean text on a branded background

### 3. Scroll Spy via Intersection Observer
- Active nav link highlighting requires knowing which section is in the viewport
- Use the Intersection Observer API in `nav.tsx` — observe all section IDs, track the currently visible one, highlight the corresponding nav link
- This is a lightweight, performant approach that doesn't require scroll position calculations

### 4. Reduced Motion via CSS and Framer Motion Config
- Add a `@media (prefers-reduced-motion: reduce)` block in `globals.css` to disable `scroll-behavior: smooth`
- Framer Motion respects the `useReducedMotion` hook — components should conditionally disable animations when the user prefers reduced motion

### 5. 404 Page via Next.js `not-found.tsx`
- Next.js static export generates `404.html` from `src/app/not-found.tsx`
- GitHub Pages automatically serves `404.html` for unmatched routes

## Tasks

### Task 1: Missing Static Assets — Sitemap & OG Image

**Objective:** Create the sitemap.xml and og-image.png that are already referenced by existing code but don't exist, closing the SEO gaps.

**Files to create:**

| File | Purpose |
|------|---------|
| `public/sitemap.xml` | XML sitemap with single URL entry |
| `public/og-image.png` | 1200x630px Open Graph image placeholder |

**Requirements — Sitemap (`public/sitemap.xml`):**
- Valid XML sitemap format per the sitemaps.org protocol
- Single `<url>` entry:
  - `<loc>`: `https://mattwilson02.github.io/`
  - `<lastmod>`: current date in YYYY-MM-DD format
  - `<changefreq>`: `monthly`
  - `<priority>`: `1.0`
- Must be served at `/sitemap.xml` in the build output (placing it in `public/` achieves this automatically)
- Must match the URL referenced in `public/robots.txt`

**Requirements — OG Image (`public/og-image.png`):**
- Dimensions: 1200x630px (standard OG image size matching the metadata in `layout.tsx`)
- Content: "Matt Wilson" as large text, "Senior Full Stack & AI Engineer" as subtitle, on a clean background using the site's accent colour (`#2563eb`) or a dark background (`#0a0a0a`)
- The builder can generate this using any approach (Node canvas script, SVG conversion, ImageMagick, etc.) — the output just needs to be a valid PNG at the correct dimensions
- This replaces the missing file that `layout.tsx` already references in both OpenGraph and Twitter card metadata

**Acceptance Criteria:**
- `public/sitemap.xml` is valid XML and accessible at `/sitemap.xml` in the build output
- `public/og-image.png` exists, is a valid PNG, and is 1200x630px
- No changes needed to `layout.tsx` or `robots.txt` — they already reference these paths correctly
- `pnpm build` still succeeds

---

### Task 2: Scroll UX — Sticky Nav Offset & Active Link Highlighting

**Objective:** Fix the scroll offset issue where anchor links scroll content behind the sticky nav, and add active link highlighting so users can see which section they're viewing.

**Files to modify:**

| File | Change |
|------|--------|
| `src/app/globals.css` | Add `scroll-padding-top` to `html` and `scroll-margin-top` to sections |
| `src/components/nav.tsx` | Add scroll spy via Intersection Observer; highlight active nav link |

**Requirements — Scroll Offset (`globals.css`):**
- Add `scroll-padding-top: 5rem` (80px) to the `html` rule — this accounts for the sticky nav height (~64px) plus breathing room
- This single CSS property fixes the anchor link offset for all sections globally, including smooth scroll and browser back/forward navigation

**Requirements — Active Nav Link (`nav.tsx`):**
- Use the Intersection Observer API to track which section is currently in the viewport
- Observe all section IDs that correspond to nav links: `home`, `about`, `experience`, `projects`, `skills`
- The active link should use `text-[var(--color-foreground)]` (or `text-[var(--color-accent)]`) instead of the default `text-[var(--color-muted)]`
- Only one link should be active at a time — use the topmost visible section as the active one
- The active state should apply in both desktop nav links and mobile menu links
- `rootMargin` on the observer should account for the sticky nav height (e.g. `-80px 0px -60% 0px` to trigger when a section crosses the top third of the viewport)
- The "Home" link should be active when no other section is in view (i.e. at the top of the page)

**Acceptance Criteria:**
- Clicking any nav link scrolls the section heading into view below the nav, not behind it
- The currently visible section's nav link is visually highlighted
- Active state updates as the user scrolls through sections
- Active highlighting works in both desktop and mobile nav
- No layout shift or performance issues from the observer

---

### Task 3: Accessibility Hardening

**Objective:** Add `prefers-reduced-motion` support, improve focus ring visibility in dark mode, and ensure the `scroll-behavior` respects motion preferences.

**Files to modify:**

| File | Change |
|------|--------|
| `src/app/globals.css` | Add reduced motion media query; improve focus ring offset colours |
| `src/components/hero.tsx` | Respect reduced motion preference |
| `src/components/about.tsx` | Respect reduced motion preference |
| `src/components/experience.tsx` | Respect reduced motion preference |
| `src/components/projects.tsx` | Respect reduced motion preference |
| `src/components/skills.tsx` | Respect reduced motion preference |
| `src/components/certifications.tsx` | Respect reduced motion preference |
| `src/components/testimonials.tsx` | Respect reduced motion preference |

**Requirements — Reduced Motion (`globals.css`):**
- Add a `@media (prefers-reduced-motion: reduce)` block that sets `scroll-behavior: auto` on `html` (overriding the `smooth` value)
- This prevents smooth scrolling for users who have indicated they prefer reduced motion

**Requirements — Framer Motion Reduced Motion (all animated components):**
- Each component that uses Framer Motion should conditionally set `initial`, `animate`, and `whileInView` to `undefined` (or use `transition: { duration: 0 }`) when the user prefers reduced motion
- Framer Motion provides a `useReducedMotion()` hook from `framer-motion` — use it to detect the preference
- When reduced motion is preferred, content should render immediately without any fade/slide animation
- This is a mechanical change across all 7 animated components — the pattern is identical in each:
  1. Import `useReducedMotion` from `framer-motion`
  2. Call `const prefersReducedMotion = useReducedMotion()`
  3. Conditionally pass animation props: if reduced motion, set `initial` to `false` (renders in final state immediately)

**Requirements — Focus Ring Dark Mode (`globals.css`):**
- The `focus-visible:ring-offset-2` used on CTAs and buttons uses the default ring-offset colour (white), which is invisible in dark mode against the dark background
- Add a CSS rule that sets `--tw-ring-offset-color` to `var(--color-background)` on all focusable elements, so the ring offset adapts to the current theme
- This ensures focus rings are visible in both light and dark modes

**Acceptance Criteria:**
- With `prefers-reduced-motion: reduce` enabled in OS settings, no Framer Motion animations play — content renders in its final position immediately
- Smooth scrolling is disabled when reduced motion is preferred
- Focus rings on buttons and links are clearly visible in both light and dark modes
- No functional regressions — all sections still render correctly with animations disabled

---

### Task 4: 404 Page

**Objective:** Add a styled 404 page so users who navigate to non-existent routes see a branded error page instead of the GitHub Pages default.

**Files to create:**

| File | Purpose |
|------|---------|
| `src/app/not-found.tsx` | Custom 404 page matching the site's design |

**Requirements:**
- Next.js static export automatically generates `404.html` from `not-found.tsx` — GitHub Pages serves this for unmatched routes
- The page should match the site's visual style: same font (Inter), same CSS variables, same dark/light theme support
- Content:
  - Large "404" heading
  - A short message: "This page doesn't exist." or similar — direct, not cute
  - A "Back to Home" link styled as the primary CTA button (accent background, same style as hero CTA), linking to `/`
- Layout: centred on the page, vertically and horizontally
- The page should import and use the site's global styles (it inherits them from `layout.tsx` automatically)
- Keep it simple — no animations, no illustrations, no extra components
- Must be a client component (`"use client"`) only if it needs interactivity (it shouldn't — keep it as a server component)

**Acceptance Criteria:**
- `pnpm build` generates `out/404.html`
- The 404 page renders with correct theming (respects dark/light mode)
- "Back to Home" link navigates to the site root
- Page looks clean and branded — not a broken or default error page
- Responsive at all breakpoints

---

### Task 5: Final Build Verification & Lighthouse Prep

**Objective:** Ensure the complete site builds cleanly and address any remaining issues that would hurt Lighthouse scores.

**Files to modify:**

| File | Change |
|------|--------|
| `src/app/layout.tsx` | Add `theme-color` meta tag for mobile browsers |
| `src/components/footer.tsx` | Ensure all links have accessible names |

**Requirements — Theme Color Meta (`layout.tsx`):**
- Add `themeColor` to the metadata export — this sets the browser chrome colour on mobile devices
- Use an array with media queries to support both themes:
  - Light: `#ffffff` with `media: "(prefers-color-scheme: light)"`
  - Dark: `#0a0a0a` with `media: "(prefers-color-scheme: dark)"`
- This is a Lighthouse "Best Practices" requirement and improves the mobile browser experience

**Requirements — Link Accessibility Audit (`footer.tsx`):**
- Verify all social links in the footer have descriptive `aria-label` attributes (e.g. "GitHub profile", "LinkedIn profile", "Send email")
- If any SVG icons lack `aria-hidden="true"`, add it — icons next to text are decorative and should be hidden from screen readers
- This is a mechanical check — the footer likely already has these from Sprint 1, but verify and fix any gaps

**Requirements — Build Verification:**
- `pnpm build` must exit 0 with zero TypeScript errors and zero ESLint warnings
- The `out/` directory must contain: `index.html`, `404.html`, `sitemap.xml`, `og-image.png`, `robots.txt`, `.nojekyll`, `favicon.ico`
- All anchor links on the page must point to valid section IDs
- Both light and dark themes must render correctly across all sections

**Acceptance Criteria:**
- `pnpm build` exits 0 — zero TS errors, zero ESLint warnings
- `out/` directory contains all expected files
- Mobile browser shows themed chrome colour
- All footer links pass accessibility audit
- Site is ready for Lighthouse 95+ across all categories (Performance, Accessibility, Best Practices, SEO)

## Implementation Order

1. **Task 1** — Static assets (independent, no code dependencies)
2. **Task 2** — Scroll UX (independent of Task 1, modifies globals.css and nav.tsx)
3. **Task 3** — Accessibility (can be built in parallel with Tasks 1 & 2, touches globals.css and all animated components)
4. **Task 4** — 404 page (independent, single new file)
5. **Task 5** — Final verification (depends on Tasks 1-4 completing, ensures everything works together)

Tasks 1, 2, 3, and 4 are independent and can be built in parallel. Task 5 is the final integration check.

**Note on Task 3 and Task 2 both modifying `globals.css`:** The changes are to different parts of the file (scroll-padding-top vs reduced-motion media query vs focus ring offset), so they don't conflict. If built sequentially, Task 2 should go first since Task 5 validates the final state.

## File Count

| Task | New Files | Modified Files | Total New |
|------|-----------|----------------|-----------|
| Task 1 | 2 | 0 | 2 |
| Task 2 | 0 | 2 | 2 |
| Task 3 | 0 | 8 | 2 |
| Task 4 | 1 | 0 | 3 |
| Task 5 | 0 | 2 | 3 |

**3 new files, 12 modified files.** Well within the 15-file limit.

## Definition of Done

- [ ] `pnpm install && pnpm build` exits 0 with zero TS errors and zero ESLint warnings
- [ ] `public/sitemap.xml` exists and is valid XML with correct URL
- [ ] `public/og-image.png` exists at 1200x630px — no more missing asset references
- [ ] Anchor links scroll sections into view below the sticky nav, not behind it
- [ ] Active nav link is visually highlighted based on scroll position
- [ ] `prefers-reduced-motion: reduce` disables all Framer Motion animations and smooth scrolling
- [ ] Focus rings are visible in both light and dark modes
- [ ] 404 page renders at `out/404.html` with correct theming and a "Back to Home" link
- [ ] `theme-color` meta tag present for mobile browser chrome
- [ ] `out/` directory contains: `index.html`, `404.html`, `sitemap.xml`, `og-image.png`, `robots.txt`, `.nojekyll`, `favicon.ico`
- [ ] Both light and dark themes render correctly across all sections
- [ ] Page is responsive at mobile (375px), tablet (768px), and desktop (1280px)
- [ ] Site targets Lighthouse 95+ across all categories

## What's Next

The site is feature-complete and production-ready after this sprint. Future work (not scoped) could include: real testimonials, a blog section, analytics integration, custom domain setup, or a real headshot photo replacing the avatar placeholder.
