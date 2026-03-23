# Sprint 15 — Resume Page, Print Styles & Footer Navigation

## Overview

**Goal:** Add an HTML resume page at `/resume` for recruiter consumption, implement print stylesheets so the resume and blog posts produce clean printed/PDF output, enhance the footer with site-wide navigation links, and create SEO-indexable blog tag pages.

**Rationale:** The site has 10 routes (home, blog listing, 7 blog posts, uses page) and is polished for on-screen viewing. But three gaps hurt recruiter conversion and SEO depth:

1. **No HTML resume.** The only resume is a placeholder PDF in `public/`. Recruiters frequently view portfolios on their phone or in a browser — an HTML `/resume` page is immediately viewable, searchable, printable, and creates another high-value indexable page. It also solves the placeholder PDF problem by generating a real, content-rich page that can be printed to PDF.

2. **No print styles.** If someone prints the resume page or a blog post (or "Save as PDF" from the browser), they get the full site chrome — nav, footer, scroll-to-top button, reading progress bar, and dark mode colours on paper. A print stylesheet hides non-content elements and optimises typography for paper, making the resume page double as a print-ready CV.

3. **Footer has no site navigation.** The footer shows social links (GitHub, LinkedIn, Email) but zero internal navigation. On blog pages and the uses page, the footer is the last thing visitors see — and it offers no path to other parts of the site. Adding Blog, Uses, and Resume links to the footer creates persistent wayfinding across all pages.

4. **Blog tags are client-side only.** Tag filtering on `/blog` is client-side `useState` — there are no `/blog/tag/[tag]` routes. Each tag page is an indexable URL that Google can crawl, creating 14+ new pages from existing content. This is the highest-leverage SEO improvement available with zero new content.

## What Exists

- **Home page (`src/app/page.tsx`):** Hero → About → Experience → Projects → Skills → Certifications → LatestPosts → CurrentlyBuilding → Contact → Footer → ScrollToTop
- **Blog infrastructure (Sprints 8-14):**
  - `src/data/blog.ts` — `BlogPost` interface with `slug`, `title`, `date`, `excerpt`, `tags`, `readingTime`, `content`. 8 posts sorted newest-first
  - `src/app/blog/page.tsx` — client component with search + tag filtering. Tags extracted: AI, Career, DevOps, Developer Tools, Docker, Engineering, Learning, Mobile, Opinion, Python, RAG, React Native, Testing, TypeScript (14 unique tags)
  - `src/app/blog/[slug]/page.tsx` — server component with `generateStaticParams`, `generateMetadata`, JSON-LD, breadcrumbs, reading progress, TOC, share, related posts, post navigation
  - `src/app/blog/layout.tsx` — wraps blog pages with `Nav` (showBlogLink) and `Footer`
  - `src/components/tag-filter.tsx` — client-side tag pills with active state and `aria-pressed`
  - `src/components/blog-card.tsx` — card component with title, date, calculated reading time, excerpt, tag pills
- **Footer (`src/components/footer.tsx`):** Three-section layout — name+tagline left, social icon links centre, credit+copyright right. Uses `md:flex-row md:justify-between` responsive layout. **No internal site navigation links**
- **Resume:** `public/matt-wilson-resume.pdf` is a placeholder PDF. Hero and Contact sections link to it with `download` attribute. `src/data/hero.ts` has `resumeLink: { label: "Resume", href: "/matt-wilson-resume.pdf" }`. `src/data/contact.ts` has similar
- **Experience data (`src/data/experience.ts`):** 2 companies (Stonehage Fleming with 3 sub-projects, AAO Holdings), typed as `ExperienceEntry[]` with company, role, period, and projects array
- **Skills data (`src/data/skills.ts`):** 7 skill categories with typed `SkillCategory[]` interface
- **Certifications data (`src/data/certifications.ts`):** 2 Azure certifications with typed interface
- **Nav (`src/components/nav.tsx`):** 7 home links (Home, About, Experience, Projects, Skills, Contact, Blog), 7 blog links with absolute paths. `showBlogLink` prop toggles between anchor and absolute paths
- **Uses page:** `/uses` route with layout, data-driven from `src/data/uses.ts`
- **`scripts/generate-feeds.ts`:** Prebuild script generating `sitemap.xml` (10 URLs: home, uses, /blog, 7 posts) and `feed.xml` (8 items)
- **Globals CSS (`src/app/globals.css`):** CSS variables for theming, `.prose` styles for blog content, `.hljs-*` syntax highlighting rules, `.text-shimmer` animation, reduced motion media query. **No `@media print` rules**
- **Established patterns:**
  - `Section` wrapper (`src/components/section.tsx`): `id`, `py-20 md:py-28`, `max-w-5xl`, `px-6`
  - Data files in `src/data/*.ts` with exported TypeScript interfaces and const data objects
  - CSS variable theming via `var(--color-*)` in `globals.css`
  - Framer Motion `containerVariants` / `itemVariants` with `whileInView="visible"` and `viewport={{ once: true, margin: "-100px" }}`
  - `useReducedMotion()` hook in all animated components
  - Named exports, `"use client"` only where Framer Motion or interactivity is used
  - Card styling: `rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-6`
  - Tech pill styling: `rounded-full border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-1 text-xs font-medium`
  - Dynamic imports for below-fold sections using `next/dynamic` with `.then(m => ({ default: m.Name }))` pattern
  - Blog layout (`blog/layout.tsx`) wraps pages with `Nav` (showBlogLink) and `Footer`
  - Breadcrumbs component with JSON-LD `BreadcrumbList` schema

## Architectural Decisions

All previous sprint architectural decisions carry forward. Additional decisions for this sprint:

### 1. Resume Page — Reuses Existing Data Files, Not a New Data Source
- The resume content is already defined across `experience.ts`, `skills.ts`, `certifications.ts`, and `about.ts` — the same data that powers the home page sections
- The `/resume` page imports from these existing data files and renders them in a print-optimised, single-page layout. No new data file needed
- This means the resume is always in sync with the portfolio — edit `experience.ts` once, both the home page Experience section and the resume update
- The page adds a small amount of resume-specific data (a summary/objective line, contact details header) that lives directly in the page or in a small `src/data/resume.ts` config file

### 2. Resume Layout — Clean HTML, Not a Component Reuse
- The resume page does NOT reuse the `Experience`, `Skills`, or `Certifications` section components — those are designed for a scroll-based portfolio with animations, cards, and generous whitespace
- Instead, the resume page renders the same data in a dense, traditional CV layout: tight spacing, no animations, no cards, no hover effects. Think "one-page PDF" layout
- The page is a server component — no `"use client"`, no Framer Motion. Pure HTML + CSS
- It uses a `resume/layout.tsx` that renders only `Nav` and a minimal footer (or no footer) — the resume page is its own context

### 3. Print Styles — `@media print` in `globals.css`
- A single `@media print` block in `globals.css` handles all print styling across the site
- Print rules: hide nav, footer, scroll-to-top, reading progress bar, theme toggle, copy buttons, share buttons, TOC toggle on mobile. Force light-mode colours (black text on white background). Remove box shadows and decorative borders
- The resume page gets additional print-specific styling: tight margins, no page-break in the middle of a section, proper font sizing for paper
- Blog posts print cleanly: article content only, code blocks preserved with syntax colours adapted for paper (lighter backgrounds, darker text)

### 4. Blog Tag Pages — Static Routes via `generateStaticParams`
- Create `/blog/tag/[tag]` route that generates a static page per tag at build time
- Each tag page shows a filtered listing of posts matching that tag, using the existing `BlogCard` component
- Tags are extracted from `blogPosts` at build time — adding a new post with a new tag automatically creates a new tag page
- Tag pages get proper SEO metadata (`title`, `description`, OG tags) and breadcrumbs (Home → Blog → Tag: {name})
- The tag filter pills on `/blog` remain as client-side state for interactive browsing. The tag pages are for SEO and direct linking — they serve different purposes
- Tag pills on blog cards and the tag filter component link to `/blog/tag/[tag]` pages, creating internal links that search engines can follow

### 5. Footer Navigation — Minimal Site Links Section
- Add a row of internal site links above the existing social links: Blog, Uses, Resume
- These are text links (not icons), styled in muted text with hover transition — matching the existing footer aesthetic
- On the home page, these provide discovery of the non-section routes. On blog/uses pages, they provide cross-navigation between content areas
- Keep the footer compact — one additional row, not a full sitemap grid

### 6. Sitemap Expansion — Tag Pages and Resume
- The `scripts/generate-feeds.ts` prebuild script needs to include `/resume` and all `/blog/tag/[tag]` pages
- With 14 unique tags, this adds 15 new URLs to the sitemap (1 resume + 14 tag pages), bringing the total from 10 to 25
- Tag pages get `priority: 0.5`, `changefreq: weekly`. Resume gets `priority: 0.8`, `changefreq: monthly`

## Tasks

### Task 1: HTML Resume Page

**Objective:** Build a `/resume` route that renders Matt's full CV in a clean, dense, print-optimised HTML layout — reusing data from existing data files so the resume stays in sync with the portfolio.

**Files to create:**

| File | Purpose |
|------|---------|
| `src/data/resume.ts` | Resume-specific config: summary line, contact header details, section ordering |
| `src/app/resume/layout.tsx` | Resume page layout with Nav and minimal footer |
| `src/app/resume/page.tsx` | Resume page rendering experience, skills, certifications from shared data |

**Files to modify:**

| File | Change |
|------|--------|
| `scripts/generate-feeds.ts` | Add `/resume` to sitemap generation |

**Requirements — Data (`resume.ts`):**

A small config file — NOT duplicating content from other data files. Define and export:

```
interface ResumeConfig {
  name: string;
  title: string;
  summary: string;
  email: string;
  github: string;
  linkedin: string;
  location: string;
}
```

Values:
- `name`: "Matt Wilson"
- `title`: "Senior Full Stack & AI Engineer"
- `summary`: A 2-3 sentence professional summary. Draft from the established copy style: "Full-stack TypeScript engineer with 4 years of production experience building investment platforms, fintech mobile apps, and autonomous AI developer tooling. Self-taught, no CS degree. Currently building tools that let engineers focus on hard problems instead of repetitive implementation." — direct, confident, no buzzwords
- `email`: "mattwilsonbusiness25@gmail.com"
- `github`: "github.com/mattwilson02"
- `linkedin`: "linkedin.com/in/matt-wilson-16a671212"
- `location`: "Isle of Man (Remote)"

**Requirements — Resume Layout (`resume/layout.tsx`):**
- Follow the same pattern as `blog/layout.tsx`
- Render `Nav` with `showBlogLink={true}` (reuses the absolute-path nav for non-home pages)
- Render `<main id="main-content">{children}</main>` then `Footer`
- Export metadata: `title: "Resume — Matt Wilson"`, `description: "Matt Wilson's professional resume — Senior Full Stack & AI Engineer with 4 years of production experience in TypeScript, React Native, Next.js, and AI systems."`

**Requirements — Resume Page (`resume/page.tsx`):**
- Server component — no `"use client"`, no Framer Motion. Pure HTML rendering for maximum print compatibility
- Import data from existing files: `experienceData` from `@/data/experience`, `skillCategories` from `@/data/skills`, `certifications` from `@/data/certifications`, and `resumeConfig` from `@/data/resume`
- Render a traditional CV layout with dense spacing, designed to fit cleanly on 1-2 printed pages

**Page structure (top to bottom):**

1. **Header:** Name (large, bold), title (muted), contact info row (email, GitHub, LinkedIn, location) — all on one or two lines, compact
2. **Summary:** The 2-3 sentence professional summary from `resume.ts`
3. **Experience:** Imported from `experienceData`. Render each entry with company name (bold), role, and period on one line. Sub-projects with their highlights as compact bullet lists. Tech summary in muted text per project. Use the same content as the home page Experience section but in tighter layout — no timeline indicators, no cards, just clean headings and bullets
4. **Skills:** Imported from `skillCategories`. Render as a compact grid: category name followed by comma-separated skills on the same line. Not pills — just text. Aim for 2-3 columns on desktop to save vertical space
5. **Certifications:** Imported from `certifications`. Simple list: certification name — issuer, date. One line per cert
6. **Education:** A single line: "Self-taught — no formal CS education" (or omit this section entirely; the builder should judge whether it adds value or is better left unsaid on a resume)

**Styling:**
- Container: `max-w-4xl mx-auto px-6 py-16 md:py-20` — slightly narrower than other pages for a document feel
- Use `var(--color-*)` CSS variables for theming (works in both light and dark modes on screen)
- Section headings: `text-lg font-bold uppercase tracking-wide text-[var(--color-foreground)] border-b border-[var(--color-border)] pb-1 mb-3` — traditional resume section dividers
- Body text: `text-sm` — denser than the portfolio sections
- Bullet points: small, compact `list-disc` with `pl-4 text-sm leading-relaxed`
- Contact info: `text-sm text-[var(--color-muted)]` with links that are functional on screen but render as plain text in print
- A "Print / Save as PDF" button fixed or positioned at the top-right: small ghost button that calls `window.print()`. Hidden in print via `@media print`. This button needs `"use client"` — extract it as a tiny `PrintButton` component inline or as a separate import. The page itself remains a server component with the button as a client child
- Add a `print:` Tailwind variant or a `.print-resume` class for resume-specific print overrides (tighter margins, smaller text, no colour backgrounds)

**Requirements — Sitemap Update (`scripts/generate-feeds.ts`):**
- Add `/resume` to the sitemap URL list
- Position: after `/uses`, before `/blog`
- Priority: `0.8`, changefreq: `monthly`

**Acceptance Criteria:**
- `/resume` route renders a clean, traditional CV layout
- Content is pulled from existing data files (`experience.ts`, `skills.ts`, `certifications.ts`) — no content duplication
- The page looks professional on screen in both light and dark modes
- The page prints cleanly to paper/PDF (verified after Task 2 adds print styles)
- "Print / Save as PDF" button triggers the browser print dialog
- Nav and footer are present on screen but hidden in print
- `sitemap.xml` includes `/resume` after rebuild
- Content driven from `resume.ts` + shared data files
- `pnpm build` succeeds with zero TS errors and zero ESLint warnings

---

### Task 2: Print Stylesheet

**Objective:** Add `@media print` styles to `globals.css` so the resume page prints as a clean CV and blog posts print as readable articles — hiding site chrome and optimising typography for paper.

**Files to modify:**

| File | Change |
|------|--------|
| `src/app/globals.css` | Add comprehensive `@media print` block |

**Requirements — Global Print Rules (`globals.css`):**

Add a `@media print` block at the end of `globals.css` with the following rules:

**Elements to hide in print:**
- `nav` — the sticky navigation
- `footer` — the site footer
- The scroll-to-top button (target by component class or `[aria-label="Scroll to top"]`)
- The reading progress bar (fixed position element at top)
- The theme toggle button
- Code block copy buttons (the "Copy" overlay)
- Share post section
- Blog search and tag filter controls
- Post navigation (previous/next links)
- The "← Back to Blog" bottom link
- Any element with a `print:hidden` utility class (for opt-in hiding)
- The "Print / Save as PDF" button on the resume page

**Colour overrides for print:**
- Force light-mode colours regardless of the active theme:
  - `--color-background: #ffffff`
  - `--color-foreground: #000000`
  - `--color-muted: #4b5563`
  - `--color-border: #d1d5db`
  - `--color-card: #f9fafb`
  - `--color-accent: #1d4ed8` (slightly darker for print contrast)
- Remove the `.dark` class overrides — print always uses light colours
- Set `background: white; color: black` on `body`

**Typography for print:**
- Base font size: `11pt` (standard for printed documents)
- Line height: `1.4` (tighter than screen for density)
- Remove all `text-shimmer` animations
- Remove all `box-shadow` properties
- Links: show as regular text colour (no accent), add URL after link text for external links via `a[href^="http"]::after { content: " (" attr(href) ")"; font-size: 9pt; color: #6b7280; }` — but only for links inside `.prose` (blog content) or the resume, not nav/footer links

**Resume-specific print rules:**
- The resume page container should use tighter margins: `margin: 0; padding: 0.5in` (or similar — optimise for A4/Letter)
- Page breaks: `break-inside: avoid` on experience entries and skill category groups — don't split a job role across pages
- Section headings: `break-after: avoid` — keep headings attached to their content
- Overall: the resume should print as a clean 1-2 page document

**Blog post print rules:**
- The article content (`.prose` container) should be the primary printed content
- Table of contents (both mobile and desktop): hidden in print
- Related posts section: hidden in print
- Breadcrumbs: hidden in print (or keep as a subtle header — builder's discretion)
- Code blocks: keep syntax highlighting but ensure the background is very light (`#f8f9fa` or similar) for print. Reduce `font-size` to `9pt` for code to prevent overflow
- `overflow-x: auto` on code blocks should become `overflow-x: visible; white-space: pre-wrap` in print — allow code to wrap rather than clip

**Acceptance Criteria:**
- Printing the resume page (`/resume`) produces a clean 1-2 page CV with no nav, footer, or site chrome
- Print colours are always light-mode (black text on white background) regardless of the user's active theme
- Printing a blog post shows the article content with syntax-highlighted code blocks, without nav, footer, TOC, share buttons, or navigation elements
- Links in printed blog content show their URLs in parentheses
- No decorative elements (shadows, shimmer animation, hover effects) appear in print
- Code blocks wrap properly in print — no horizontal clipping
- `pnpm build` succeeds with zero TS errors and zero ESLint warnings

---

### Task 3: Footer Navigation Enhancement

**Objective:** Add internal site navigation links to the footer — Blog, Uses, Resume — so every page on the site has clear paths to all content areas, improving discoverability and reducing dead-end pages.

**Files to modify:**

| File | Change |
|------|--------|
| `src/components/footer.tsx` | Add a row of internal navigation links above the existing social links |

**Requirements — Footer Update (`footer.tsx`):**
- Add a new row of text links between the name/tagline section and the social icon links (or above the entire existing footer content)
- Links to add:
  - "Blog" → `/blog`
  - "Uses" → `/uses`
  - "Resume" → `/resume`
- Styling: `text-xs text-[var(--color-muted)] transition-colors hover:text-[var(--color-foreground)]` — matching the existing footer text style
- Layout: horizontal row with `gap-4` or `gap-6`, centred. Use a `<nav aria-label="Footer navigation">` wrapper for semantics
- These are internal links — no `target="_blank"` or `rel="noopener noreferrer"`
- The links should be visually distinct from the social icon links (which are for external destinations). Text links vs icon links already creates this distinction
- On mobile: the links should stack or wrap naturally within the existing footer flex layout. The footer already uses `flex-col md:flex-row`, so a new row of links can sit between the name and the social icons
- Keep the footer compact — this is a single row of 3 small text links, not a footer mega-menu

**Acceptance Criteria:**
- Footer shows "Blog", "Uses", "Resume" text links on all pages (home, blog, uses, resume, 404)
- Links navigate to the correct routes
- Links are styled consistently with existing footer text (muted, small, hover transition)
- Footer remains compact — the new links don't add significant vertical space
- The footer layout is still responsive: stacks properly on mobile, row layout on desktop
- `<nav aria-label="Footer navigation">` wraps the links for accessibility
- `pnpm build` succeeds with zero TS errors

---

### Task 4: Blog Tag Pages

**Objective:** Create statically generated `/blog/tag/[tag]` routes — one per unique tag — so each tag has an indexable URL that search engines can crawl, multiplying the site's page count from existing content.

**Files to create:**

| File | Purpose |
|------|---------|
| `src/app/blog/tag/[tag]/page.tsx` | Tag-specific blog listing page with `generateStaticParams` |

**Files to modify:**

| File | Change |
|------|--------|
| `src/components/blog-card.tsx` | Make tag pills clickable, linking to `/blog/tag/[tag]` |
| `src/app/blog/[slug]/page.tsx` | Make tag pills on post pages clickable, linking to `/blog/tag/[tag]` |
| `scripts/generate-feeds.ts` | Add all `/blog/tag/[tag]` URLs to sitemap |

**Requirements — Tag Page (`blog/tag/[tag]/page.tsx`):**
- Server component — no interactivity needed
- `generateStaticParams`: extract all unique tags from `blogPosts`, return as `{ tag: string }[]`. URL-encode tags that contain special characters or spaces (e.g. "React Native" → "React%20Native" or use slugified versions). The simplest approach: use the raw tag string as the param since Next.js handles URL encoding
- `generateMetadata`: per-tag SEO metadata
  - Title: `"${tag} — Blog — Matt Wilson"` (e.g. "TypeScript — Blog — Matt Wilson")
  - Description: `"Blog posts about ${tag} by Matt Wilson."` (or a more descriptive variant)
  - OG tags with tag name
- Page content:
  - Breadcrumbs: `[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: tag }]` using the existing `Breadcrumbs` component
  - Heading: the tag name as `<h1>` with the standard heading style (`text-3xl font-bold tracking-tight md:text-4xl`)
  - Post count: `"${count} post${count !== 1 ? 's' : ''}"` in muted text below the heading
  - Posts filtered to those matching the tag, rendered as `BlogCard` components in the same 2-column grid as `/blog`
  - A "← All posts" link below the grid, linking to `/blog` — styled like the "← Back to Blog" link pattern
- Use the same `max-w-5xl mx-auto px-6 py-20 md:py-28` container as the blog listing page
- If the tag doesn't match any posts (e.g. URL-manipulated to an invalid tag), call `notFound()` from `next/navigation`
- The page inherits `blog/layout.tsx` automatically (it's inside the `blog/` directory) — Nav and Footer are already handled

**Requirements — Blog Card Tag Links (`blog-card.tsx`):**
- Currently, tag pills on blog cards are plain `<span>` elements. Convert them to `<Link>` elements (from `next/link`) pointing to `/blog/tag/${tag}`
- Wrap each tag in a Next.js `<Link>` component: `<Link href={/blog/tag/${encodeURIComponent(tag)}} ...>`
- Add hover styling to the pills to indicate they're interactive: `hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]` (matching the tag filter active style but on hover)
- The click on a tag pill should navigate to the tag page — this means `event.stopPropagation()` may be needed if the card itself is a link (check the current implementation: if the entire card is wrapped in `<Link>`, tag clicks need to prevent the card click)
- Accessible: add `aria-label="View posts tagged ${tag}"` to each tag link

**Requirements — Blog Post Page Tag Links (`blog/[slug]/page.tsx`):**
- The tag pills on individual post pages (lines 100-109) are also plain `<span>` elements
- Convert them to `<Link>` elements pointing to `/blog/tag/${tag}`, same as the blog card
- Same styling additions: hover transition to accent colour
- These are inside an `<article>` and not inside another `<Link>`, so no event propagation issues

**Requirements — Sitemap Update (`scripts/generate-feeds.ts`):**
- Extract unique tags from `blogPosts` and add `/blog/tag/${tag}` URLs to the sitemap
- Each tag page: `priority: 0.5`, `changefreq: weekly`, `lastmod` set to the most recent post date for that tag
- URL-encode tag names in the sitemap: `encodeURIComponent(tag)` for tags with spaces (e.g. "React Native" → `React%20Native` or use `encodeURIComponent`)
- Position: after individual blog post URLs
- This adds 14 new URLs to the sitemap (one per unique tag)

**Acceptance Criteria:**
- `/blog/tag/TypeScript` (and all other tags) renders a filtered listing of matching posts
- Each tag page has unique SEO metadata (title, description, OG tags)
- Breadcrumbs show: Home → Blog → {Tag Name}
- `generateStaticParams` generates pages for all 14 unique tags at build time
- Invalid tags return the 404 page
- Tag pills on blog cards are clickable links to tag pages
- Tag pills on blog post pages are clickable links to tag pages
- `sitemap.xml` includes all 14 tag page URLs after rebuild (total ~25 URLs)
- Tag pages inherit the blog layout (Nav + Footer)
- The blog listing page still works with client-side tag filtering (both mechanisms coexist)
- `pnpm build` succeeds with zero TS errors and zero ESLint warnings
- Static export generates `out/blog/tag/*/index.html` for each tag

---

### Task 5: Build Verification & Integration

**Objective:** Verify the complete site builds cleanly with all Sprint 15 changes, confirm all new routes and features work end-to-end, and ensure no regressions.

**Files to modify:** None expected — this is a verification task. Fix issues in relevant files if found.

**Requirements — Build Verification Checklist:**

The builder must verify all of the following after completing Tasks 1-4:

- [ ] `pnpm build` exits 0 with zero TypeScript errors and zero ESLint warnings
- [ ] `out/` directory contains all expected files:
  - Previous: `index.html`, `404.html`, `sitemap.xml`, `feed.xml`, `og-image.png`, `robots.txt`, `.nojekyll`, `favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png`, `apple-touch-icon.png`, `site.webmanifest`, `matt-wilson-resume.pdf`, `headshot.png`, `blog/index.html`, `blog/*/index.html` for all 8 posts, `uses/index.html`
  - New: `resume/index.html`, `blog/tag/*/index.html` for all 14 tags
- [ ] `/resume` page renders a clean, traditional CV layout with experience, skills, and certifications
- [ ] Resume content is sourced from existing data files (not duplicated)
- [ ] "Print / Save as PDF" button on resume page triggers the browser print dialog
- [ ] Printing the resume page produces a clean 1-2 page document without nav, footer, or site chrome
- [ ] Print colours are light-mode (black on white) regardless of active theme
- [ ] Printing a blog post shows article content cleanly — no nav, footer, TOC, share buttons
- [ ] Code blocks in printed blog posts wrap text (no horizontal clipping)
- [ ] Footer shows "Blog", "Uses", "Resume" navigation links on all pages
- [ ] Footer links navigate to correct routes
- [ ] `/blog/tag/TypeScript` (and other tag URLs) render filtered post listings
- [ ] Tag pages have proper SEO metadata and breadcrumbs
- [ ] Tag pills on blog cards and post pages are clickable links to tag pages
- [ ] `sitemap.xml` contains ~25 URLs: home, uses, resume, /blog, 8 posts, 14 tag pages
- [ ] All existing features still work: shimmer animation, availability badge, nav scroll spy, theme toggle, mobile hamburger, blog search, client-side tag filter, code copy, reading progress, TOC, share buttons, related posts, post navigation, breadcrumbs, RSS autodiscovery, syntax highlighting, analytics
- [ ] Both light and dark themes render all new pages and features correctly
- [ ] Responsive at mobile (375px), tablet (768px), and desktop (1280px)

**Acceptance Criteria:**
- All verification checklist items pass
- No regressions to existing functionality
- The site remains production-ready

## Implementation Order

1. **Task 1** — Resume page (creates the `/resume` route that Tasks 2 and 3 reference)
2. **Task 2** — Print stylesheet (depends on Task 1 existing to verify resume print output)
3. **Task 3** — Footer navigation (independent — can be built in parallel with Task 2)
4. **Task 4** — Blog tag pages (independent — can be built in parallel with Tasks 2 and 3)
5. **Task 5** — Build verification (depends on Tasks 1-4 completing)

Task 1 should be completed first since Tasks 2 and 3 reference the resume page. Tasks 2, 3, and 4 are independent of each other and can be built in parallel once Task 1 is done. Task 5 is the final integration check.

## File Count

| Task | New Files | Modified Files | Total New |
|------|-----------|----------------|-----------|
| Task 1 | 3 | 1 | 3 |
| Task 2 | 0 | 1 | 3 |
| Task 3 | 0 | 1 | 3 |
| Task 4 | 1 | 3 | 4 |
| Task 5 | 0 | 0 | 4 |

**4 new files, 6 modified files (minimal overlap between tasks).** Well within the 15-file limit.

**New files:**
1. `src/data/resume.ts`
2. `src/app/resume/layout.tsx`
3. `src/app/resume/page.tsx`
4. `src/app/blog/tag/[tag]/page.tsx`

**Modified files:**
1. `scripts/generate-feeds.ts` (Tasks 1, 4 — add /resume and tag page URLs to sitemap)
2. `src/app/globals.css` (Task 2 — add `@media print` block)
3. `src/components/footer.tsx` (Task 3 — add site navigation links)
4. `src/components/blog-card.tsx` (Task 4 — make tag pills clickable)
5. `src/app/blog/[slug]/page.tsx` (Task 4 — make tag pills clickable)

**Unique files touched:** 10 total (4 new + 6 modified). Lean sprint.

## Definition of Done

- [ ] `pnpm install && pnpm build` exits 0 with zero TS errors and zero ESLint warnings
- [ ] `/resume` page renders a clean, traditional CV layout reusing data from `experience.ts`, `skills.ts`, `certifications.ts`
- [ ] Resume content matches the portfolio — no duplication or divergence
- [ ] "Print / Save as PDF" button on resume page works
- [ ] `@media print` styles hide nav, footer, scroll-to-top, reading progress, copy buttons, share buttons, TOC, tag filter, post navigation, and other non-content elements
- [ ] Print output uses light-mode colours regardless of active theme
- [ ] Resume prints as a clean 1-2 page document
- [ ] Blog posts print as readable articles with wrapped code blocks
- [ ] Footer shows "Blog", "Uses", "Resume" navigation links with correct routing
- [ ] Footer links are accessible (`<nav aria-label="Footer navigation">`)
- [ ] `/blog/tag/[tag]` pages render for all 14 unique tags
- [ ] Tag pages have unique SEO metadata (title, description, OG tags)
- [ ] Tag pages show breadcrumbs: Home → Blog → {Tag Name}
- [ ] Invalid tag URLs return 404
- [ ] Tag pills on blog cards and post pages are clickable links to tag pages
- [ ] `sitemap.xml` contains ~25 URLs including /resume and 14 tag pages
- [ ] `generateStaticParams` correctly generates all tag pages at build time
- [ ] Both light and dark themes render all new pages correctly
- [ ] Responsive at mobile (375px), tablet (768px), and desktop (1280px)
- [ ] No regressions to existing features (nav, theme, blog search, client-side tag filter, TOC, code copy, analytics, RSS)
- [ ] Static export generates all expected files in `out/`

## What's Next (Sprint 16 Preview)

Potential future work: custom domain setup with DNS configuration, real testimonials to restore the section with genuine quotes, keyboard shortcut navigation (`j`/`k` for next/previous post, `/` to focus search), blog post pagination as post count grows beyond 10, per-post OG images generated at build time, or a dark-mode-aware code block theme toggle.
