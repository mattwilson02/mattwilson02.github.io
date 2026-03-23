# Sprint 6 — Integration Fixes, Resume Download & Availability Signal

## Overview

**Goal:** Wire up the Sprint 5 components that were built but never connected to the page, add a downloadable resume/CV for recruiters, and surface an availability status indicator in the hero so visitors immediately know Matt is open to opportunities.

**Rationale:** Sprint 5 created `contact.tsx`, `scroll-to-top.tsx`, and the `.text-shimmer` CSS animation — but none are actually rendered. The Contact section isn't in `page.tsx`, the ScrollToTop button isn't mounted, the hero `<h1>` doesn't use the shimmer class, the nav is still missing a Contact link, and all imports remain static. These are functional gaps, not cosmetic — the Contact section is the site's closing pitch and it's invisible. Beyond fixing these, a downloadable resume is the single highest-value addition for recruiter conversion (they need a PDF to attach to their ATS), and a small availability badge in the hero immediately signals intent to visitors scanning the page.

## What Exists

- **Full single-page portfolio:** Nav (5 links: Home, About, Experience, Projects, Skills), Hero, About, Experience, Projects, Skills, Certifications, Testimonials, Footer — all with dark/light theming and scroll-triggered Framer Motion animations
- **Sprint 5 components built but NOT wired:**
  - `src/components/contact.tsx` — fully styled Contact section with email CTA and social links, uses `Section` wrapper with `id="contact"`, Framer Motion animations, `useReducedMotion()`. **Not imported or rendered in `page.tsx`**
  - `src/components/scroll-to-top.tsx` — fixed-position button appearing after 500px scroll, chevron-up SVG, respects reduced motion. **Not imported or rendered in `page.tsx`**
  - `src/data/contact.ts` — typed `ContactData` with heading, description, email, and social links. **Exists but unused**
  - `.text-shimmer` CSS class in `globals.css` (lines 66-90) — `@keyframes shimmer` animation with `background-clip: text`, 10s linear infinite, proper `prefers-reduced-motion` fallback. **Defined but not applied to any element**
- **Nav (`src/components/nav.tsx`):** 5 links array (Home, About, Experience, Projects, Skills) — **no Contact link**
- **Page (`src/app/page.tsx`):** All 8 section imports are static — **no dynamic imports, no Contact, no ScrollToTop**
- **Hero (`src/components/hero.tsx`):** `<motion.h1>` has `className="text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl"` — **no `.text-shimmer` class**
- **Hero data (`src/data/hero.ts`):** `HeroData` interface with name, subtitle, tagline, badges, primaryCta, secondaryLinks — **no availability status field, no resume download link**
- **Contact data (`src/data/contact.ts`):** `ContactData` with heading, description, email, socialLinks — **no resume download link**
- **Established patterns:**
  - `Section` wrapper (`src/components/section.tsx`): `id`, `py-20 md:py-28`, `max-w-5xl`, `px-6`
  - Data files in `src/data/*.ts` with exported TypeScript interfaces and const data objects
  - CSS variables via `var(--color-*)` in `globals.css`
  - Framer Motion `containerVariants` / `itemVariants` with `whileInView="visible"` and `viewport={{ once: true, margin: "-100px" }}`
  - `useReducedMotion()` hook in all animated components
  - Named exports, `"use client"` only where Framer Motion or interactivity is used
  - Tech pill style: `rounded-full border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-1 text-xs font-medium`
  - Primary CTA: `bg-[var(--color-accent)] text-white`, ghost/outline secondary links
  - Contact section uses distinct styling: `border-t-2 border-[var(--color-accent)] bg-[var(--color-card)]`

## Architectural Decisions

All previous sprint architectural decisions carry forward. Additional decisions for this sprint:

### 1. Sprint 5 Wiring — Minimal Surgical Changes
- The components themselves are complete and well-built. The only work is connecting them: adding imports to `page.tsx`, adding a class to `hero.tsx`, and adding a nav link to `nav.tsx`
- Dynamic imports use `next/dynamic` with default SSR (compatible with `output: 'export'`). Named exports require the `.then(m => ({ default: m.ComponentName }))` pattern
- Hero and Nav remain static imports (above the fold). Footer and ScrollToTop remain static (lightweight). Below-fold sections become dynamic

### 2. Resume — Static PDF in `public/` with Data-Driven Download Links
- A static `public/matt-wilson-resume.pdf` placeholder. The builder should generate a minimal valid PDF (even just a single page saying "Resume placeholder — replace with real PDF") so the download link works end-to-end
- Download links added to both the hero CTA area (as a secondary ghost link alongside GitHub/LinkedIn) and the Contact section (as a secondary action below the email CTA)
- The resume path is defined in the data files (`hero.ts` and `contact.ts`) so it's trivial to update
- The `<a>` tag uses the `download` attribute to trigger a file download rather than in-browser navigation

### 3. Availability Badge — Small, Data-Driven, Non-Intrusive
- A small pill/badge in the hero section above the name or near the subtitle, showing availability status (e.g. a green dot + "Open to opportunities" or "Available for hire")
- Data-driven: a new `availability` field in `hero.ts` with `status` ("available" | "employed" | "unavailable") and `message` string
- The badge renders conditionally — if status is "unavailable", it simply doesn't render. This keeps the hero clean when Matt isn't actively looking
- Styling uses a subtle green dot for "available" (a small `bg-green-500` circle before the text), consistent with the pill style but with a green accent instead of neutral

### 4. Nav Link Count — 6 Links Is the Ceiling
- Adding Contact brings the nav to 6 links: Home, About, Experience, Projects, Skills, Contact
- The desktop nav uses `gap-6` between items. If 6 links feel tight, the builder should reduce to `gap-5`. The mobile hamburger menu handles any count gracefully
- No further nav links should be added in future sprints without removing existing ones

## Tasks

### Task 1: Sprint 5 Component Integration

**Objective:** Wire the 5 unconnected Sprint 5 pieces into the live site — hero shimmer, Contact section, ScrollToTop button, Contact nav link, and dynamic imports for below-fold sections.

**Files to modify:**

| File | Change |
|------|--------|
| `src/components/hero.tsx` | Add `text-shimmer` class to the `<motion.h1>` element |
| `src/components/nav.tsx` | Add Contact link to `navLinks` array |
| `src/app/page.tsx` | Add Contact + ScrollToTop, convert below-fold sections to dynamic imports |

**Requirements — Hero Shimmer (`hero.tsx`):**
- Add `text-shimmer` to the `<motion.h1>` element's `className` string
- The existing class is `"text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl"` — append `text-shimmer` to it
- No other changes to the hero component. The shimmer CSS is already defined in `globals.css` with reduced motion fallback
- The shimmer runs as a pure CSS animation independent of Framer Motion

**Requirements — Nav Contact Link (`nav.tsx`):**
- Add `{ label: "Contact", href: "#contact", id: "contact" }` as the last item in the `navLinks` array (after Skills)
- No other changes needed — the existing Intersection Observer, scroll spy, mobile menu, and link styling all derive from this array automatically
- The desktop nav gap may need reducing from `gap-6` to `gap-5` if 6 links feel tight. The builder should visually verify at the `md` breakpoint (768px)

**Requirements — Page Assembly (`page.tsx`):**
- Keep `Nav`, `Hero`, `Footer`, and `ScrollToTop` as static imports (above-fold or lightweight)
- Convert `About`, `Experience`, `Projects`, `Skills`, `Certifications`, `Testimonials`, and `Contact` to `next/dynamic` imports
- Dynamic import syntax for named exports: `const About = dynamic(() => import("@/components/about").then(m => ({ default: m.About })))`
- Import `dynamic` from `"next/dynamic"` at the top of the file
- Add `Contact` between `Testimonials` and `</main>`
- Add `ScrollToTop` after `Footer`, outside `<main>` (it's a fixed-position overlay, not page content)
- No loading skeletons needed — sections render server-side in the static export

**Requirements — Final Section Order:**
```
Nav → <main> → Hero → About → Experience → Projects → Skills → Certifications → Testimonials → Contact → </main> → Footer → ScrollToTop
```

**Acceptance Criteria:**
- Hero heading text displays the shimmer gradient animation
- Shimmer is disabled with `prefers-reduced-motion: reduce`
- Contact section is visible on the page between Testimonials and Footer
- Contact email CTA, GitHub, and LinkedIn links all work
- ScrollToTop button appears after scrolling past the hero
- ScrollToTop button scrolls to top on click and disappears
- "Contact" appears in both desktop nav and mobile hamburger menu
- Scroll spy highlights "Contact" when the Contact section is in view
- Build output shows multiple JS chunks (dynamic import splitting)
- `pnpm build` succeeds with zero TS errors and zero ESLint warnings

---

### Task 2: Resume/CV Download

**Objective:** Add a downloadable resume PDF and surface download links in the hero and contact sections — the single highest-value addition for recruiter conversion.

**Files to create:**

| File | Purpose |
|------|---------|
| `public/matt-wilson-resume.pdf` | Placeholder PDF file for the resume download |

**Files to modify:**

| File | Change |
|------|--------|
| `src/data/hero.ts` | Add `resumeLink` field to `HeroData` interface and data |
| `src/data/contact.ts` | Add `resumeLink` field to `ContactData` interface and data |
| `src/components/hero.tsx` | Render resume download link in CTA area |
| `src/components/contact.tsx` | Render resume download link below email CTA |

**Requirements — Placeholder PDF (`public/matt-wilson-resume.pdf`):**
- Generate a minimal valid PDF file. It can be a single page with text like "Matt Wilson — Resume" and "Replace this placeholder with your actual resume PDF"
- The builder can use any approach to generate this (Node script with a PDF library, a minimal hand-crafted PDF, etc.) — it just needs to be a valid, downloadable PDF
- This file lives in `public/` so it's served at `/matt-wilson-resume.pdf`

**Requirements — Hero Data Update (`hero.ts`):**
- Add a `resumeLink` field to the `HeroData` interface: `resumeLink: { label: string; href: string }`
- Set value: `{ label: "Resume", href: "/matt-wilson-resume.pdf" }`
- This follows the same pattern as `secondaryLinks`

**Requirements — Contact Data Update (`contact.ts`):**
- Add a `resumeLink` field to the `ContactData` interface: `resumeLink: { label: string; href: string }`
- Set value: `{ label: "Download Resume", href: "/matt-wilson-resume.pdf" }`

**Requirements — Hero Resume Link (`hero.tsx`):**
- Render the resume download link in the CTAs area (`motion.div` with `flex-wrap items-center gap-3 pt-2`), positioned after the existing secondary links (GitHub, LinkedIn)
- Use the same ghost/outline button styling as the GitHub and LinkedIn links: `rounded-md border border-[var(--color-border)] px-5 py-2.5 text-sm font-semibold text-[var(--color-foreground)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]`
- Add the `download` attribute to the `<a>` tag so clicking triggers a file download
- Add a small download icon (inline SVG — a downward arrow or download tray icon, 16-18px) before the label text for visual clarity
- No `target="_blank"` needed — the `download` attribute handles it

**Requirements — Contact Resume Link (`contact.tsx`):**
- Render the resume download link below the social links row, visually separated (add `mt-6` or similar spacing)
- Style as a ghost/outline button matching the social link buttons
- Include the `download` attribute and a small download icon SVG matching the hero
- Text: "Download Resume" (from data file)

**Acceptance Criteria:**
- `/matt-wilson-resume.pdf` is served from the build output and downloads when clicked
- Hero section shows a "Resume" ghost button after GitHub and LinkedIn links
- Contact section shows a "Download Resume" ghost button below social links
- Both download links trigger a file download (not in-browser PDF viewing)
- Download icon is visible on both links
- Links use data from `hero.ts` and `contact.ts` respectively — not hardcoded
- `pnpm build` succeeds with zero TS errors and zero ESLint warnings

---

### Task 3: Availability Status Badge

**Objective:** Add a small, data-driven availability indicator in the hero section so visitors (especially recruiters) immediately know Matt's current status.

**Files to modify:**

| File | Change |
|------|--------|
| `src/data/hero.ts` | Add `availability` field to `HeroData` interface and data |
| `src/components/hero.tsx` | Render availability badge above the name |

**Requirements — Hero Data Update (`hero.ts`):**
- Add an `availability` field to the `HeroData` interface:
  ```
  availability: {
    status: "available" | "open" | "unavailable";
    message: string;
  }
  ```
- Set value: `{ status: "open", message: "Open to opportunities" }`
- The `status` field drives the visual indicator: `"available"` and `"open"` show a green dot, `"unavailable"` hides the badge entirely

**Requirements — Availability Badge (`hero.tsx`):**
- Render a small pill/badge as the first child inside the Framer Motion container, positioned above the `<h1>` name
- Layout: a `flex items-center gap-2` container with:
  - A small green circle indicator (`w-2 h-2 rounded-full bg-green-500`) — add a subtle pulse animation via Tailwind's `animate-pulse` class on a slightly larger ring behind the dot for visual interest
  - The message text in small, muted styling: `text-sm text-[var(--color-muted)]`
- The badge should be wrapped in its own `<motion.div variants={itemVariants}>` so it participates in the staggered entrance animation
- Conditional rendering: if `heroData.availability.status === "unavailable"`, do not render the badge at all. The hero should look clean and complete without it
- The pill itself should use the established pill style but simpler — no background or border needed, just the dot + text. Keep it understated
- The pulse animation on the green dot should be disabled when `prefersReducedMotion` is true — conditionally apply `animate-pulse` only when motion is allowed

**Acceptance Criteria:**
- A green pulsing dot with "Open to opportunities" text appears above the hero heading
- The badge participates in the hero's staggered entrance animation
- Setting `status: "unavailable"` in `hero.ts` causes the badge to not render
- The green dot pulse animation is disabled with `prefers-reduced-motion: reduce`
- The badge looks clean and professional — it should feel like a status indicator, not a flashy banner
- Content is driven from `hero.ts`, not hardcoded in JSX
- Responsive: looks correct at all breakpoints

---

### Task 4: Build Verification & Final Audit

**Objective:** Verify the complete site builds cleanly with all Sprint 6 changes integrated, confirm all Sprint 5 + Sprint 6 features work end-to-end, and ensure production readiness.

**Files to modify:**

| File | Change |
|------|--------|
| `src/app/layout.tsx` | Update JSON-LD schema to include `seeks` field for job-seeking signal (optional SEO enhancement) |

**Requirements — JSON-LD Enhancement (`layout.tsx`):**
- In the existing `jsonLd` Person schema object, add a `seeks` field to signal availability to search engines:
  ```
  "seeks": {
    "@type": "Demand",
    "description": "Full-stack engineering and AI development opportunities"
  }
  ```
- This is a minor SEO enhancement that complements the visual availability badge — structured data that Google can use in rich results
- Only add this if it doesn't cause TypeScript issues — the JSON-LD object is typed as a plain object literal, so adding a field should work

**Requirements — Build Verification Checklist:**
The builder must verify all of the following after completing Tasks 1-3:

- [ ] `pnpm build` exits 0 with zero TypeScript errors and zero ESLint warnings
- [ ] `out/` directory contains: `index.html`, `404.html`, `sitemap.xml`, `og-image.png`, `robots.txt`, `.nojekyll`, `favicon.ico`, `matt-wilson-resume.pdf`
- [ ] Hero heading displays shimmer gradient animation
- [ ] Availability badge shows green dot + "Open to opportunities" above hero heading
- [ ] Resume download links appear in hero (after GitHub/LinkedIn) and contact section
- [ ] Clicking resume links downloads the PDF file
- [ ] Contact section renders between Testimonials and Footer with email CTA and social links
- [ ] ScrollToTop button appears after scrolling, works on click
- [ ] All 6 nav links (Home, About, Experience, Projects, Skills, Contact) scroll to correct sections
- [ ] Scroll spy highlights correct active link including Contact
- [ ] Mobile hamburger menu shows all 6 links
- [ ] Both light and dark themes render correctly across all sections
- [ ] `prefers-reduced-motion: reduce` disables: shimmer animation, Framer Motion animations, smooth scrolling, availability dot pulse
- [ ] Page is responsive at mobile (375px), tablet (768px), and desktop (1280px)

**Acceptance Criteria:**
- All verification checklist items pass
- JSON-LD schema includes the `seeks` field
- The site is production-ready with all Sprint 5 + Sprint 6 features functional

## Implementation Order

1. **Task 1** — Sprint 5 integration (must be first — wires the foundation that Tasks 2 and 3 build on)
2. **Task 2** — Resume download (depends on Task 1 for the updated `page.tsx` structure)
3. **Task 3** — Availability badge (depends on Task 1 for the shimmer class being on the hero, to verify visual harmony)
4. **Task 4** — Build verification (depends on Tasks 1-3 completing)

Tasks 2 and 3 can be built in parallel once Task 1 is complete — they modify the same files (`hero.tsx`, `hero.ts`) but different parts of them, so the builder should apply them sequentially to avoid conflicts. Task 4 is the final integration check.

## File Count

| Task | New Files | Modified Files | Total New |
|------|-----------|----------------|-----------|
| Task 1 | 0 | 3 | 0 |
| Task 2 | 1 | 4 | 1 |
| Task 3 | 0 | 2 | 1 |
| Task 4 | 0 | 1 | 1 |

**1 new file, 10 modified files (some modified by multiple tasks).** Well within the 15-file limit. This is a tight, integration-focused sprint.

**Unique files touched:** `hero.tsx`, `hero.ts`, `nav.tsx`, `page.tsx`, `contact.tsx`, `contact.ts`, `layout.tsx` + 1 new PDF file = 8 total files.

## Definition of Done

- [ ] `pnpm install && pnpm build` exits 0 with zero TS errors and zero ESLint warnings
- [ ] Hero heading displays subtle gradient shimmer animation in both themes
- [ ] Shimmer disabled when `prefers-reduced-motion: reduce` is set
- [ ] Availability badge shows green pulsing dot + "Open to opportunities" above hero heading
- [ ] Availability badge hidden when `status` is set to `"unavailable"` in data
- [ ] Contact section renders with `id="contact"` between Testimonials and Footer
- [ ] Contact email CTA, GitHub, LinkedIn links all functional
- [ ] ScrollToTop button appears after scrolling past hero, scrolls to top on click
- [ ] Resume PDF downloads from both hero and contact section links
- [ ] `public/matt-wilson-resume.pdf` exists and is a valid PDF
- [ ] All 6 nav links (Home, About, Experience, Projects, Skills, Contact) scroll to correct sections
- [ ] Scroll spy highlights correct active link including Contact
- [ ] Mobile hamburger menu shows all 6 links without overflow
- [ ] Below-fold sections use dynamic imports (build output shows multiple JS chunks)
- [ ] JSON-LD Person schema includes `seeks` field
- [ ] Both light and dark themes render correctly across all sections
- [ ] `prefers-reduced-motion: reduce` disables all animations (shimmer, Framer Motion, smooth scroll, pulse)
- [ ] Responsive at mobile (375px), tablet (768px), and desktop (1280px)
- [ ] Section order: Hero → About → Experience → Projects → Skills → Certifications → Testimonials → Contact → Footer

## What's Next (Sprint 7 Preview)

Potential future work: blog/writing section, real testimonials to replace placeholders, analytics integration (Plausible or similar privacy-respecting option), custom domain setup, real headshot photo replacing the avatar placeholder, or a "Currently building" live status section.
