# Sprint 5 — Contact Section, Hero Enhancement & UX Polish

## Overview

**Goal:** Add a dedicated Contact section to drive visitor engagement, implement the hero text shimmer animation from the product spec, add a scroll-to-top button for long-page UX, and improve initial load performance with dynamic imports for below-fold sections.

**Rationale:** The site is feature-complete but missing two things that make a portfolio effective at converting visitors: a dedicated call-to-action section near the bottom of the page, and the animated hero text effect specified in the product spec ("Subtle animated gradient or shimmer effect on the heading text") that was never implemented. The hero is the first impression — it should have visual punch. The contact section is the last impression — it should make it effortless to reach out. A scroll-to-top button and lazy-loaded below-fold sections round out the UX for a long single-page site.

## What Exists

- **Full single-page portfolio:** Nav (5 links), Hero, About, Experience, Projects, Skills, Certifications, Testimonials, Footer — all with dark/light theming and scroll-triggered Framer Motion animations
- **Established patterns:**
  - `Section` wrapper (`src/components/section.tsx`): accepts `id`, `className`, `children` — renders `<section>` with `py-20 md:py-28`, `max-w-5xl`, `px-6`
  - Data files in `src/data/*.ts` with exported TypeScript interfaces and const data objects
  - CSS variable theming via `var(--color-*)` defined in `globals.css` (background, foreground, muted, border, accent, accent-hover, card)
  - Framer Motion `containerVariants` / `itemVariants` with `whileInView="visible"` and `viewport={{ once: true, margin: "-100px" }}`
  - `useReducedMotion()` hook in all animated components for accessibility
  - Named exports, `"use client"` only where Framer Motion or interactivity is used
  - Tech pill styling: `rounded-full border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-1 text-xs font-medium`
  - CTA button styling: accent background (`bg-[var(--color-accent)]`), white text, `hover:bg-[var(--color-accent-hover)]`, focus ring
  - Ghost/outline button styling: `border border-[var(--color-border)]`, foreground text, `hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]`
- **Hero section (`src/components/hero.tsx`):** Renders name at `text-5xl md:text-6xl lg:text-7xl font-bold`, subtitle, tagline, tech badges, and CTAs. Uses Framer Motion `animate` (on mount, not `whileInView`). **No gradient or shimmer effect on the heading text** — the product spec calls for this but it was not implemented
- **Page composition (`src/app/page.tsx`):** Statically imports all 8 section components — no dynamic imports or code splitting
- **Nav links:** Home, About, Experience, Projects, Skills — no Contact link
- **Contact info scattered:** "Get in Touch" mailto CTA in hero, email/GitHub/LinkedIn icons in footer — but no dedicated Contact section between Testimonials and Footer
- **No scroll-to-top button** — the page is long (8 sections) and users must scroll manually back to the top

## Architectural Decisions

All previous sprint architectural decisions carry forward. Additional decisions for this sprint:

### 1. Contact Section — CTA-Focused, Not a Form
- Since the site uses `output: 'export'` (static, no server features), a traditional contact form is not viable without a third-party service
- Instead, build a visually prominent CTA section with a clear heading, a short motivating line, and direct action links (email, GitHub, LinkedIn)
- This section serves as the "closing pitch" — positioned after Testimonials and before Footer, it's the last thing visitors see before leaving

### 2. Hero Shimmer — CSS Animation, Not Framer Motion
- The product spec calls for "Subtle animated gradient or shimmer effect on the heading text"
- Implement this as a CSS `background-clip: text` gradient animation using `@keyframes` in `globals.css`
- CSS is preferred over Framer Motion here because: (a) it runs on the compositor thread (no JS overhead), (b) it loops infinitely without re-renders, (c) it's trivially disabled via `prefers-reduced-motion`
- The shimmer should be subtle — a slow-moving gradient highlight that adds visual interest without being distracting

### 3. Scroll-to-Top — Appears on Scroll, Smooth Return
- A small fixed button in the bottom-right corner that appears after the user scrolls past the hero section
- Uses the same accent colour and styling conventions as other interactive elements
- Client component with scroll listener (same pattern as the `isScrolled` state in `nav.tsx`)
- Respects `prefers-reduced-motion` — uses `window.scrollTo` with `behavior: 'smooth'` only when motion is allowed

### 4. Dynamic Imports for Below-Fold Sections
- Sections below the fold (About, Experience, Projects, Skills, Certifications, Testimonials, Contact) are not visible on initial load
- Use Next.js `dynamic()` with `{ ssr: false }` is not appropriate for static export — instead use `next/dynamic` with default SSR which works with `output: 'export'`
- This reduces the initial JS bundle by deferring Framer Motion initialisation for sections the user hasn't scrolled to yet
- Hero and Nav remain statically imported since they're above the fold

## Tasks

### Task 1: Contact Section

**Objective:** Build a visually prominent Contact section positioned as the final content section before the footer — giving visitors a clear, compelling call to action after reading the full portfolio.

**Files to create:**

| File | Purpose |
|------|---------|
| `src/data/contact.ts` | Contact section content data |
| `src/components/contact.tsx` | Contact section component |

**Requirements — Data (`contact.ts`):**

Define and export a typed interface and data object containing:

- `heading`: string — "Get in Touch"
- `description`: string — A short, direct motivating line. Draft in the established copy style: no buzzwords, confident, specific. Example directions: "I'm always interested in hearing about new opportunities, collaborations, or interesting problems to solve." or "Building something ambitious? I'm open to opportunities where I can ship production AI systems and solve hard engineering problems." Keep it to 1-2 sentences max
- `email`: `{ label: string; href: string }` — "mattwilsonbusiness25@gmail.com", mailto link
- `socialLinks`: Array of `{ label: string; href: string; icon: "github" | "linkedin" }` — GitHub and LinkedIn with the existing URLs from the product spec

**Requirements — Contact Component (`contact.tsx`):**
- Uses the `Section` wrapper with `id="contact"`
- Layout: centred text, visually distinct from surrounding sections. Consider a subtle background differentiation — use `var(--color-card)` as the section background to make it stand out, or add a top border accent line using `var(--color-accent)`
- Heading "Get in Touch" as `<h2>`, rendered large (`text-3xl md:text-4xl font-bold tracking-tight` — same as other section headings)
- Description text centred below heading, max-width constrained (`max-w-xl mx-auto`), using `var(--color-muted)`
- Email CTA: primary accent button (same style as hero CTA — `bg-[var(--color-accent)]`, white text, hover/focus states). Render the email address visibly so users know what they're clicking — either as the button label itself or as text below the button
- Social links: render GitHub and LinkedIn as ghost/outline buttons (same style as hero secondary links) or as icon links (same style as footer social icons). Position below the email CTA
- Scroll-triggered Framer Motion animation using the established `containerVariants` / `itemVariants` pattern
- Respect `useReducedMotion()` as all other sections do
- The social link icons can be inline SVGs — reuse the same GitHub and LinkedIn SVG paths from `footer.tsx`

**Acceptance Criteria:**
- Contact section renders with `id="contact"`
- Email link opens the user's mail client with the correct address
- GitHub and LinkedIn links open in new tabs with `rel="noopener noreferrer"`
- Section is visually distinct — feels like a "closing pitch", not just another content section
- Responsive at all breakpoints — centred layout works on mobile and desktop
- Copy tone matches the style guide
- Content driven from `contact.ts`, not hardcoded in JSX

---

### Task 2: Hero Text Shimmer Animation

**Objective:** Implement the "subtle animated gradient or shimmer effect on the heading text" called for in the product spec — adding visual punch to the hero's first impression.

**Files to modify:**

| File | Change |
|------|--------|
| `src/app/globals.css` | Add shimmer keyframes animation and utility class |
| `src/components/hero.tsx` | Apply shimmer class to the heading `<h1>` |

**Requirements — CSS Shimmer Animation (`globals.css`):**
- Define a `@keyframes shimmer` animation that slowly moves a gradient highlight across the text
- The gradient should use `var(--color-foreground)` as the base text colour and `var(--color-accent)` as the shimmer highlight — ensuring it works in both light and dark modes
- Animation should be slow and subtle — `8s` or longer duration, `linear`, `infinite` — this is a professional site, not a landing page for a gaming product
- Use `background-clip: text` / `-webkit-background-clip: text` with `color: transparent` to make the gradient visible through the text
- The gradient should be a wide `background-size` (e.g. `200% 100%`) that translates horizontally via `background-position` in the keyframes
- Create a utility class (e.g. `.text-shimmer`) that encapsulates all the shimmer properties
- **Reduced motion:** Inside the existing `@media (prefers-reduced-motion: reduce)` block, add a rule that sets `.text-shimmer` to `animation: none` and restores solid `color: var(--color-foreground)` — the text should render as normal static text when motion is reduced

**Requirements — Hero Update (`hero.tsx`):**
- Add the shimmer class to the `<motion.h1>` element's `className`
- No other changes to the hero component — the animation is purely CSS-driven
- The shimmer should be visible immediately (no delay waiting for Framer Motion entrance animation to complete) — it runs independently as a CSS animation

**Acceptance Criteria:**
- Hero heading text displays a subtle, slow-moving gradient shimmer effect
- The shimmer uses the accent colour as the highlight against the foreground colour
- Animation loops infinitely and smoothly
- Both light and dark modes show the shimmer correctly
- With `prefers-reduced-motion: reduce`, the heading renders as plain static text with no animation
- The effect is subtle — a visitor should notice it adds visual interest, not that it's distracting
- No JavaScript overhead — the animation runs entirely in CSS

---

### Task 3: Scroll-to-Top Button

**Objective:** Add a fixed scroll-to-top button that appears after the user scrolls past the hero section — providing quick navigation back to the top on a long single-page site.

**Files to create:**

| File | Purpose |
|------|---------|
| `src/components/scroll-to-top.tsx` | Fixed scroll-to-top button component |

**Requirements — Component (`scroll-to-top.tsx`):**
- Client component (`"use client"`) — needs scroll event listener and click handler
- Fixed position: bottom-right corner (`fixed bottom-6 right-6` or similar), high z-index (`z-40` — below the nav's `z-50`)
- Visibility: hidden by default, appears when `window.scrollY` exceeds a threshold (~500px or roughly the hero section height). Use the same scroll listener pattern as `nav.tsx` (`useEffect` with `passive: true` scroll event)
- Appearance: small circular button (`w-10 h-10` or similar) with an upward arrow icon (simple inline SVG chevron-up)
- Styling: `bg-[var(--color-accent)]` background, white icon, rounded-full, subtle shadow for depth. Match the accent button style used elsewhere
- Hover: `hover:bg-[var(--color-accent-hover)]` — same as hero CTA
- Transition: fade in/out when appearing/disappearing. Use CSS `opacity` + `transition-opacity` + `pointer-events-none` when hidden (or Framer Motion `AnimatePresence` for a smoother effect)
- Click behaviour: scrolls to top of page. Use `window.scrollTo({ top: 0, behavior: 'smooth' })`. If `prefersReducedMotion`, use `behavior: 'auto'` instead
- Accessibility: `aria-label="Scroll to top"`, visible focus ring (`focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2`)
- Respect `useReducedMotion()` for both the button's appear/disappear transition and the scroll behaviour

**Acceptance Criteria:**
- Button is not visible when the page loads (hero is in view)
- Button appears after scrolling past the hero section
- Clicking the button scrolls smoothly to the top of the page
- Button disappears when back at the top
- Looks correct in both light and dark modes
- Accessible: has aria-label, visible focus ring, keyboard activatable
- Reduced motion: button appears/disappears instantly (no transition), scroll is instant
- Does not overlap with or obstruct other content on mobile

---

### Task 4: Performance — Dynamic Imports for Below-Fold Sections

**Objective:** Reduce the initial JavaScript bundle by dynamically importing below-fold section components, deferring Framer Motion initialisation until sections are needed.

**Files to modify:**

| File | Change |
|------|--------|
| `src/app/page.tsx` | Convert static imports to dynamic imports for below-fold sections; add Contact and ScrollToTop |

**Requirements — Dynamic Imports (`page.tsx`):**
- Keep `Nav` and `Hero` as static imports — they are above the fold and must render immediately
- Convert the following to `next/dynamic` imports: `About`, `Experience`, `Projects`, `Skills`, `Certifications`, `Testimonials`, `Contact`
- Use `next/dynamic` with default settings (SSR enabled, which is compatible with `output: 'export'`)
- Import syntax: `const About = dynamic(() => import("@/components/about").then(m => ({ default: m.About })))` — this handles named exports correctly with `next/dynamic`
- Do NOT add loading skeletons or spinners — the sections render server-side in the static export, so there's no visible loading state. The benefit is JS bundle splitting, not visual loading states
- Add the new `Contact` section between `Testimonials` and `Footer` in the page composition
- Add the `ScrollToTop` component — this should be a static import (it's small and needs to be available immediately) placed after `Footer` (outside `<main>`)
- `Footer` should remain a static import — it's the page's semantic footer and is lightweight

**Requirements — Page Composition Order:**
```
Nav → <main> → Hero → About → Experience → Projects → Skills → Certifications → Testimonials → Contact → </main> → Footer → ScrollToTop
```

**Acceptance Criteria:**
- `pnpm build` succeeds with zero TS errors and zero ESLint warnings
- The build output shows multiple JS chunks (verify via build output log — look for multiple `.js` files in the chunk output)
- All sections still render correctly in both themes
- Page scrolls naturally through all sections including the new Contact section
- ScrollToTop button renders and functions correctly
- No visual regressions — the page looks and behaves identically to before, just with better bundle splitting

---

### Task 5: Navigation Update — Add Contact Link

**Objective:** Add "Contact" to the navigation so visitors can jump directly to the contact section from anywhere on the page.

**Files to modify:**

| File | Change |
|------|--------|
| `src/components/nav.tsx` | Add "Contact" link to `navLinks` array |

**Requirements:**
- Add `{ label: "Contact", href: "#contact", id: "contact" }` to the `navLinks` array, positioned as the last item (after Skills)
- Total nav links will be: Home, About, Experience, Projects, Skills, Contact
- No other changes to `nav.tsx` — the existing scroll spy Intersection Observer will automatically pick up the new section ID since it iterates over `navLinks`
- The active link highlighting, mobile hamburger menu, and smooth scroll all apply automatically
- Verify that 6 links still fit cleanly in the desktop nav. The current nav uses `gap-6` between links — if 6 links feel tight, the builder can reduce to `gap-4` or `gap-5`. The hamburger menu handles mobile regardless

**Acceptance Criteria:**
- "Contact" appears as the last nav link on desktop and in the mobile menu
- Clicking "Contact" scrolls to the Contact section
- Scroll spy highlights "Contact" when the Contact section is in view
- 6 nav links display without overflow or visual crowding on desktop (at `md` breakpoint and above)
- Mobile hamburger menu shows all 6 links

## Implementation Order

1. **Task 1** — Contact section (independent, new component + data file)
2. **Task 2** — Hero shimmer (independent, CSS + minor hero.tsx change)
3. **Task 3** — Scroll-to-top button (independent, new component)
4. **Task 4** — Page assembly with dynamic imports (depends on Tasks 1 & 3 for new components)
5. **Task 5** — Nav update (depends on Task 1 for the `#contact` anchor target)

Tasks 1, 2, and 3 are fully independent and can be built in parallel. Tasks 4 and 5 depend on the new components existing but are independent of each other.

## File Count

| Task | New Files | Modified Files | Total New |
|------|-----------|----------------|-----------|
| Task 1 | 2 | 0 | 2 |
| Task 2 | 0 | 2 | 2 |
| Task 3 | 1 | 0 | 3 |
| Task 4 | 0 | 1 | 3 |
| Task 5 | 0 | 1 | 3 |

**3 new files, 4 modified files.** Well within the 15-file limit. Lean and focused.

## Definition of Done

- [ ] `pnpm install && pnpm build` exits 0 with zero TS errors and zero ESLint warnings
- [ ] Contact section renders with `id="contact"` — email CTA, GitHub link, LinkedIn link all functional
- [ ] Hero heading text displays subtle gradient shimmer animation in both themes
- [ ] Shimmer animation disabled when `prefers-reduced-motion: reduce` is set
- [ ] Scroll-to-top button appears after scrolling past the hero, scrolls to top on click
- [ ] Scroll-to-top button hidden at page top, accessible (aria-label, focus ring, keyboard)
- [ ] Below-fold sections are dynamically imported (build output shows multiple JS chunks)
- [ ] All 6 nav links (Home, About, Experience, Projects, Skills, Contact) scroll to correct sections
- [ ] Scroll spy highlights the correct active link including Contact
- [ ] Mobile hamburger menu shows all 6 links
- [ ] Section order: Hero → About → Experience → Projects → Skills → Certifications → Testimonials → Contact → Footer
- [ ] Both light and dark themes render correctly across all sections including new Contact section
- [ ] Responsive at mobile (375px), tablet (768px), and desktop (1280px)
- [ ] Copy tone in Contact section matches the style guide: direct, confident, no buzzwords
- [ ] Content driven from `contact.ts`, not hardcoded in JSX

## What's Next (Sprint 6 Preview)

Potential future work: downloadable resume/CV (static PDF in `public/`), blog/writing section, analytics integration, real testimonials to replace placeholders, custom domain setup, or a real headshot photo replacing the avatar placeholder.
