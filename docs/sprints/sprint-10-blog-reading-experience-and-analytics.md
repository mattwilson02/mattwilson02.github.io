# Sprint 10 — Blog Reading Experience & Analytics

## Overview

**Goal:** Elevate the blog reading experience with a reading progress indicator, copy-to-clipboard on code blocks, and a table of contents for post navigation — then add privacy-respecting analytics so Matt can see if anyone is actually visiting the site.

**Rationale:** The blog exists (Sprint 8) and is discoverable (Sprint 9), but the reading experience is bare. Code blocks — central to a technical engineering blog — have no copy button, which is table-stakes for any developer blog. Longer posts have no table of contents, forcing readers to scroll blindly. There's no reading progress indicator, so readers don't know how far through a post they are. These are small, focused improvements that compound into a significantly more polished reading experience. Beyond the blog, the site has zero visibility into traffic — Matt has no idea if anyone is visiting, which pages they read, or whether the blog is worth continuing to invest in. Plausible analytics solves this without cookies, GDPR banners, or privacy concerns.

## What Exists

- **Blog infrastructure (Sprints 8-9):**
  - `src/data/blog.ts` — `BlogPost` interface with `slug`, `title`, `date`, `excerpt`, `tags`, `readingTime`, `content` (Markdown string). 3 posts sorted newest-first
  - `src/app/blog/[slug]/page.tsx` — individual post pages: `generateStaticParams`, `generateMetadata`, `ReactMarkdown` rendering in a `.prose` container, JSON-LD BlogPosting, "Back to Blog" links, `RelatedPosts` component. Server component (no `"use client"`)
  - `src/app/blog/page.tsx` — listing page with tag filtering (`"use client"`)
  - `src/app/blog/layout.tsx` — wraps blog pages with `Nav` (showBlogLink) and `Footer`
  - `src/components/blog-card.tsx` — reusable card component
  - `src/components/related-posts.tsx` — tag-overlap related post suggestions
  - `src/components/tag-filter.tsx` — interactive tag filter pills
  - `react-markdown` ^10.1.0 installed
- **Blog post page structure (`blog/[slug]/page.tsx`):**
  - Server component — renders `<div className="py-20 md:py-28">` → "Back to Blog" link → `<article>` → `<h1>` + metadata line + `<hr>` + `.prose` div with `<ReactMarkdown>` → `<RelatedPosts>` → bottom "Back to Blog" link
  - Markdown content is rendered as plain HTML via `react-markdown` with no custom component overrides — `<pre><code>` blocks render with default styling from `.prose` CSS
  - No reading progress bar, no table of contents, no code copy buttons
- **Prose styles (`globals.css` lines 107-212):**
  - `.prose pre` — card background, border, rounded, overflow-x auto, monospace font
  - `.prose code` — inline code with background and border
  - `.prose pre code` — resets inline code styles inside pre blocks
  - `.prose h2` — 1.5rem bold, margins for spacing
  - `.prose h3` — 1.25rem semibold, margins for spacing
- **Root layout (`src/app/layout.tsx`):** Sets up `<html>`, `<head>`, Inter font, theme script, JSON-LD Person schema, skip-to-content link. **No analytics script**
- **Static export (`output: 'export'`):** All pages are static HTML. Analytics must be a client-side script, not server-side
- **Established patterns:**
  - CSS variables via `var(--color-*)` in `globals.css`
  - `"use client"` only where interactivity is needed
  - Named exports from components
  - Framer Motion with `useReducedMotion()` for animated components
  - `max-w-5xl mx-auto px-6` container, `py-20 md:py-28` vertical padding
  - Card styling: `rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-6`

## Architectural Decisions

All previous sprint architectural decisions carry forward. Additional decisions for this sprint:

### 1. Code Copy Button via Custom `react-markdown` Component Override
- `react-markdown` supports a `components` prop to override default HTML element rendering
- Override the `pre` element to wrap each code block in a container with a "Copy" button positioned absolutely in the top-right corner
- This is the standard approach — no additional dependencies needed. The copy button uses `navigator.clipboard.writeText()` and provides visual feedback ("Copied!" text or checkmark icon)
- The override component must be a client component (needs click handler and state), so it lives in its own file and is passed to `ReactMarkdown` via the `components` prop
- This requires the blog post page to become a composition of server and client components — the page itself remains a server component, but it renders a client component for the Markdown content

### 2. Reading Progress Bar — Thin CSS-Driven Bar at Page Top
- A thin horizontal bar fixed at the top of the viewport (below the nav) that fills from left to right as the user scrolls through the article
- Implemented as a client component with a scroll event listener that calculates `scrollY / (documentHeight - viewportHeight)` as a percentage
- Uses `var(--color-accent)` for the bar colour, 3px height — visible but not distracting
- Only rendered on blog post pages (not the listing page or home page)
- Respects `prefers-reduced-motion` — the bar still shows but uses `transition: none` instead of smooth width transitions

### 3. Table of Contents — Extracted from Markdown Headings
- Extract `h2` and `h3` headings from the Markdown content string using a simple regex (not runtime DOM parsing)
- Generate IDs for each heading (slugify the text) and render them as anchor links in a sidebar or top-of-article TOC
- On desktop (lg+): render as a sticky sidebar to the right of the article content
- On mobile: render as a collapsible "On this page" section between the article metadata and the content
- The heading IDs must be applied to the actual rendered `<h2>` and `<h3>` elements — this is done via the same `react-markdown` `components` override, adding `id` attributes to headings
- TOC links use smooth scroll anchor navigation with the existing `scroll-padding-top: 5rem` from `globals.css`

### 4. Analytics — Plausible Script in Root Layout
- Plausible is a privacy-respecting analytics service: no cookies, no personal data, GDPR/CCPA compliant out of the box, no consent banner needed
- Self-hosted or cloud — for simplicity, use the Plausible cloud script (`https://plausible.io/js/script.js`) with `data-domain="mattwilson02.github.io"`
- Add the script tag to `layout.tsx` `<head>` — this covers all pages (home + blog) in one place
- The script is lightweight (~1KB) and loads asynchronously — no performance impact
- Make the Plausible domain configurable via a constant at the top of layout.tsx so it's easy to change if Matt sets up a custom domain later
- For local development, Plausible ignores `localhost` by default — no special handling needed

### 5. Blog Post Page Restructure — Server/Client Composition
- The blog post page (`blog/[slug]/page.tsx`) is currently a server component. To add the code copy button, reading progress bar, and TOC, it needs client-side interactivity
- Rather than making the entire page a client component (which would lose the SEO benefits of server rendering), split it:
  - The page file remains a server component (keeps `generateStaticParams`, `generateMetadata`, JSON-LD)
  - It renders a `<BlogPostContent>` client component that handles the Markdown rendering with code copy, TOC interaction, and reading progress
- This is the Next.js App Router composition pattern — server components can render client components as children

## Tasks

### Task 1: Code Block Copy Button

**Objective:** Add a "Copy" button to every code block in blog posts so readers can copy code snippets with one click — table-stakes for a developer blog.

**Files to create:**

| File | Purpose |
|------|---------|
| `src/components/code-block.tsx` | Client component: `<pre>` wrapper with copy-to-clipboard button |
| `src/components/blog-post-content.tsx` | Client component: wraps `ReactMarkdown` with custom component overrides |

**Files to modify:**

| File | Change |
|------|--------|
| `src/app/blog/[slug]/page.tsx` | Replace inline `<ReactMarkdown>` with `<BlogPostContent>` component |

**Requirements — CodeBlock Component (`code-block.tsx`):**
- Client component (`"use client"`)
- Wraps the default `<pre>` rendering from `react-markdown`
- Renders a container `<div>` with `position: relative` around the `<pre>` element
- Positions a "Copy" button absolutely in the top-right corner of the code block (`absolute top-2 right-2`)
- Button styling: small, muted background (`bg-[var(--color-border)]` or `bg-[var(--color-card)]`), rounded, `px-2 py-1 text-xs`, visible on hover or always visible (builder's discretion — always visible is more accessible)
- Click handler:
  1. Extracts the text content from the `<pre>` element's children (the `<code>` element's text content)
  2. Calls `navigator.clipboard.writeText(text)`
  3. Changes button text from "Copy" to "Copied!" (or swaps icon from clipboard to checkmark)
  4. Resets back to "Copy" after 2 seconds via `setTimeout`
- Uses `useState` for the copied state
- The `<pre>` itself retains all existing `.prose pre` styling — the container only adds relative positioning
- Accessible: button has `aria-label="Copy code to clipboard"`

**Requirements — BlogPostContent Component (`blog-post-content.tsx`):**
- Client component (`"use client"`)
- Props: `content: string` (the Markdown string)
- Renders `<ReactMarkdown>` with a `components` prop overriding `pre` to use the `CodeBlock` component
- This component replaces the inline `<ReactMarkdown>` call in the blog post page
- Import `ReactMarkdown` from `react-markdown` and `CodeBlock` from `./code-block`
- Wrap in the same `.prose max-w-3xl` container that currently wraps the `<ReactMarkdown>` in the blog post page

**Requirements — Blog Post Page Update (`blog/[slug]/page.tsx`):**
- Replace `<div className="prose max-w-3xl"><ReactMarkdown>{post.content}</ReactMarkdown></div>` with `<BlogPostContent content={post.content} />`
- Remove the `ReactMarkdown` import (it moves to `blog-post-content.tsx`)
- The page remains a server component — `BlogPostContent` is a client component rendered as a child
- All other page structure (JSON-LD, metadata line, "Back to Blog" links, `RelatedPosts`) remains unchanged

**Acceptance Criteria:**
- Every `<pre>` code block in blog posts has a visible "Copy" button
- Clicking "Copy" copies the code text to the clipboard
- Button shows "Copied!" feedback for 2 seconds then resets
- Copy button is accessible (aria-label, keyboard focusable)
- Code block styling unchanged — the button is an overlay, not a layout change
- Both light and dark themes display the button correctly
- `pnpm build` succeeds with zero TS errors and zero ESLint warnings

---

### Task 2: Reading Progress Bar

**Objective:** Add a thin progress bar fixed at the top of the viewport on blog post pages, showing how far through the article the reader has scrolled.

**Files to create:**

| File | Purpose |
|------|---------|
| `src/components/reading-progress.tsx` | Client component: fixed progress bar driven by scroll position |

**Files to modify:**

| File | Change |
|------|--------|
| `src/app/blog/[slug]/page.tsx` | Add `<ReadingProgress />` at the top of the page output |

**Requirements — ReadingProgress Component (`reading-progress.tsx`):**
- Client component (`"use client"`)
- Renders a thin bar fixed at the very top of the viewport: `fixed top-0 left-0 z-[60]` (above the nav's `z-50`)
- Height: `h-[3px]` — visible but not distracting
- Width: calculated from scroll progress as a percentage (0% at top, 100% at bottom)
- Colour: `bg-[var(--color-accent)]` — matches the site's accent blue
- Scroll calculation:
  1. Listen to `scroll` event on `window` (passive listener)
  2. Progress = `window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)`
  3. Clamp between 0 and 1
  4. Apply as `style={{ width: \`${progress * 100}%\` }}`
- Smooth visual update: add `transition-[width] duration-150 ease-out` for a smooth feel. Disable the transition when `prefersReducedMotion` is true (use `useReducedMotion()` from Framer Motion)
- The bar should start at 0% width and reach 100% when the user hits the bottom of the page
- Clean up the scroll event listener in the `useEffect` return

**Requirements — Blog Post Page Update (`blog/[slug]/page.tsx`):**
- Import `ReadingProgress` and render it as the first child inside the outermost `<div>`, before the `<script>` tag
- Since `ReadingProgress` is a client component and the page is a server component, this follows the same composition pattern as `BlogPostContent`

**Acceptance Criteria:**
- A thin blue bar appears at the very top of the viewport on blog post pages
- The bar fills from left to right as the user scrolls down
- At the top of the page, the bar is empty (0%). At the bottom, it's full (100%)
- The bar is visible above the navigation
- Reduced motion: bar still shows progress but without the smooth width transition
- The bar does NOT appear on the blog listing page or the home page — only on individual post pages
- Both light and dark themes display the bar correctly (accent colour works in both)
- No performance issues from the scroll listener (passive event listener)
- `pnpm build` succeeds with zero TS errors

---

### Task 3: Table of Contents

**Objective:** Add a table of contents to blog posts — sticky sidebar on desktop, collapsible section on mobile — so readers can navigate long articles and see the post structure at a glance.

**Files to create:**

| File | Purpose |
|------|---------|
| `src/components/table-of-contents.tsx` | Client component: TOC with heading links, sticky on desktop |
| `src/lib/extract-headings.ts` | Utility: extract h2/h3 headings from Markdown string and generate slug IDs |

**Files to modify:**

| File | Change |
|------|--------|
| `src/components/blog-post-content.tsx` | Add heading ID injection via `react-markdown` component overrides for `h2` and `h3` |
| `src/app/blog/[slug]/page.tsx` | Restructure layout to accommodate TOC sidebar on desktop |

**Requirements — Heading Extraction (`lib/extract-headings.ts`):**
- Export a function `extractHeadings(markdown: string): TocHeading[]` where:
  ```
  interface TocHeading {
    level: 2 | 3;
    text: string;
    id: string;
  }
  ```
- Parse the Markdown string using a regex to find lines starting with `## ` (h2) and `### ` (h3)
- Generate `id` by slugifying the heading text: lowercase, replace spaces with hyphens, remove non-alphanumeric characters except hyphens
- Export the `TocHeading` interface for use by the TOC component
- This is a pure utility function — no React, no `"use client"`, importable by both server and client components

**Requirements — TableOfContents Component (`table-of-contents.tsx`):**
- Client component (`"use client"`) — needs click handling and optional active heading tracking
- Props: `headings: TocHeading[]`
- Desktop layout (lg+): rendered in a sticky sidebar (`sticky top-24` to sit below the nav) to the right of the article content. The sidebar should be visually light — no card background, just a small "On this page" label and an indented list of links
- Mobile layout (below lg): rendered as a collapsible section between the article metadata (`<hr>`) and the content. Toggle button: "On this page" with a chevron icon. Default state: collapsed. Uses `useState` for open/close
- Each heading rendered as an `<a href="#${heading.id}">` anchor link
- `h2` headings at the left margin, `h3` headings indented (`pl-4`) — creating a visual hierarchy
- Link styling: `text-sm text-[var(--color-muted)]` with `hover:text-[var(--color-foreground)]`
- Optional active heading tracking: use Intersection Observer to watch heading elements and highlight the currently visible heading in the TOC. Active link uses `text-[var(--color-foreground)] font-medium`. If this adds too much complexity, the builder can skip active tracking and just render static links — the value is in the navigation, not the highlighting
- Smooth scroll to headings handled by the existing `scroll-behavior: smooth` and `scroll-padding-top: 5rem` in `globals.css`

**Requirements — BlogPostContent Update (`blog-post-content.tsx`):**
- Add `h2` and `h3` overrides to the `components` prop of `<ReactMarkdown>`:
  - Each override renders the heading element with an `id` attribute generated by slugifying the heading text (same algorithm as `extractHeadings`)
  - This ensures the TOC anchor links point to valid element IDs
  - The slugify function should be imported from `extract-headings.ts` or duplicated inline (builder's choice — sharing is preferred to avoid drift)

**Requirements — Blog Post Page Layout Update (`blog/[slug]/page.tsx`):**
- On desktop (lg+): restructure the article area to use a two-column layout. The article content (BlogPostContent) on the left at `max-w-3xl`, the TOC sidebar on the right
- The outer container remains `max-w-5xl`. Inside, use a flex or grid layout: `lg:grid lg:grid-cols-[1fr_220px] lg:gap-8` (or similar — content takes most space, TOC gets a narrow column)
- On mobile: the TOC renders inline within the article flow (above the content), not in a sidebar
- Import `extractHeadings` and call it with `post.content` to get the headings array. Pass it to both `<TableOfContents>` and ensure `<BlogPostContent>` adds matching IDs
- If the post has no h2/h3 headings, don't render the TOC at all

**Acceptance Criteria:**
- Blog posts with h2/h3 headings show a table of contents
- Desktop: TOC appears as a sticky sidebar to the right of the article
- Mobile: TOC appears as a collapsible "On this page" section above the content
- Clicking a TOC link scrolls to the correct heading in the article
- Heading IDs in the rendered HTML match the TOC anchor hrefs
- h3 entries are visually indented under h2 entries
- Posts without headings don't show a TOC
- Both light and dark themes render correctly
- The article content area doesn't feel cramped with the sidebar present
- `pnpm build` succeeds with zero TS errors and zero ESLint warnings

---

### Task 4: Analytics Integration (Plausible)

**Objective:** Add Plausible analytics to the site so Matt can see visitor traffic, page views, and referral sources — without cookies, consent banners, or privacy concerns.

**Files to create:**

| File | Purpose |
|------|---------|
| `src/components/analytics.tsx` | Client component: renders the Plausible script tag |

**Files to modify:**

| File | Change |
|------|--------|
| `src/app/layout.tsx` | Add `<Analytics />` component to `<head>` |

**Requirements — Analytics Component (`analytics.tsx`):**
- Client component (`"use client"`) — or a server component that renders a `<script>` tag. Builder's choice based on what works with Next.js static export
- Renders the Plausible analytics script:
  ```html
  <script defer data-domain="mattwilson02.github.io" src="https://plausible.io/js/script.js"></script>
  ```
- The `data-domain` value should be defined as a constant at the top of the file (e.g. `const PLAUSIBLE_DOMAIN = "mattwilson02.github.io"`) so it's easy to update if Matt gets a custom domain
- The script tag uses `defer` — it loads asynchronously and doesn't block rendering
- If the builder determines that a separate component is overkill for a single `<script>` tag, it's acceptable to add the script directly in `layout.tsx` `<head>` instead. In that case, skip creating `analytics.tsx` and just add the script inline. The constant for the domain should still be defined for easy updates
- No conditional rendering for development — Plausible ignores localhost by default

**Requirements — Layout Update (`layout.tsx`):**
- Add the Plausible script or `<Analytics />` component inside the `<head>` element, after the existing `<script>` tags (theme script and JSON-LD)
- No other changes to layout.tsx

**Acceptance Criteria:**
- The HTML source of every page contains the Plausible script tag with `data-domain="mattwilson02.github.io"`
- The script loads asynchronously (`defer`) and doesn't impact page load performance
- No cookies are set by the analytics script
- No consent banner or privacy popup is needed
- The domain value is easily configurable (defined as a constant, not buried in JSX)
- `pnpm build` succeeds with zero TS errors and zero ESLint warnings
- Analytics works on all pages: home, blog listing, and individual blog posts (inherited from root layout)

---

### Task 5: Build Verification & Integration Test

**Objective:** Verify the complete site builds cleanly with all Sprint 10 changes, confirm all new features work end-to-end, and ensure no regressions.

**Files to modify:**

| File | Change |
|------|--------|
| `src/app/globals.css` | Add styles for the reading progress bar if needed (e.g. ensuring it renders above the nav with correct z-index) |

**Requirements — Build Verification Checklist:**

The builder must verify all of the following after completing Tasks 1-4:

- [ ] `pnpm build` exits 0 with zero TypeScript errors and zero ESLint warnings
- [ ] `out/` directory contains all expected files: `index.html`, `404.html`, `sitemap.xml`, `feed.xml`, `og-image.png`, `robots.txt`, `.nojekyll`, `favicon.ico`, `matt-wilson-resume.pdf`, plus `blog/index.html` and `blog/*/index.html` for each post
- [ ] Code copy buttons appear on all code blocks in blog posts
- [ ] Clicking "Copy" copies code text and shows "Copied!" feedback
- [ ] Reading progress bar appears on blog post pages and tracks scroll position
- [ ] Reading progress bar does NOT appear on the home page or blog listing page
- [ ] Table of contents renders on blog posts that have h2/h3 headings
- [ ] TOC links scroll to the correct headings in the article
- [ ] Desktop: TOC appears as sticky sidebar. Mobile: TOC appears as collapsible section
- [ ] Plausible analytics script is present in the HTML `<head>` of all pages
- [ ] All existing features still work: shimmer animation, availability badge, nav scroll spy, theme toggle, mobile hamburger, tag filtering on blog listing, related posts, RSS feed autodiscovery
- [ ] Both light and dark themes render all new components correctly
- [ ] `prefers-reduced-motion: reduce` disables smooth transitions on the reading progress bar
- [ ] Page is responsive at mobile (375px), tablet (768px), and desktop (1280px)
- [ ] Blog post page layout with TOC sidebar doesn't cause horizontal overflow on any breakpoint

**Requirements — Globals.css Update (if needed):**
- If the reading progress bar's z-index conflicts with other fixed elements (nav, scroll-to-top), adjust the layering
- The progress bar should be at `z-[60]` (above nav at `z-50`, above scroll-to-top at `z-40`)
- If additional global styles are needed for the TOC collapsible toggle or the code copy button, add them here

**Acceptance Criteria:**
- All verification checklist items pass
- No regressions to existing functionality
- The site remains production-ready

## Implementation Order

1. **Task 1** — Code copy button + BlogPostContent extraction (foundational — creates the `BlogPostContent` component that Tasks 2 and 3 build on)
2. **Task 2** — Reading progress bar (independent of Task 1's component, but both modify the blog post page — apply sequentially)
3. **Task 3** — Table of contents (depends on Task 1 for the `BlogPostContent` component's heading ID injection; modifies the blog post page layout)
4. **Task 4** — Analytics (fully independent — modifies only `layout.tsx`)
5. **Task 5** — Build verification (depends on Tasks 1-4 completing)

Task 4 can be built in parallel with Tasks 1-3 since it touches only `layout.tsx`. Tasks 1, 2, and 3 are sequential because they all modify the blog post page structure.

## File Count

| Task | New Files | Modified Files | Total New |
|------|-----------|----------------|-----------|
| Task 1 | 2 | 1 | 2 |
| Task 2 | 1 | 1 | 3 |
| Task 3 | 2 | 2 | 5 |
| Task 4 | 1 | 1 | 6 |
| Task 5 | 0 | 1 | 6 |

**6 new files, 6 modified files (some across multiple tasks).** Well within the 15-file limit.

**New files:**
1. `src/components/code-block.tsx`
2. `src/components/blog-post-content.tsx`
3. `src/components/reading-progress.tsx`
4. `src/components/table-of-contents.tsx`
5. `src/lib/extract-headings.ts`
6. `src/components/analytics.tsx` (optional — may be inlined in layout.tsx)

**Modified files:**
1. `src/app/blog/[slug]/page.tsx` (Tasks 1, 2, 3)
2. `src/app/layout.tsx` (Task 4)
3. `src/app/globals.css` (Task 5, if needed)

**Unique files touched:** 9 total (6 new + 3 modified). Lean sprint.

## Definition of Done

- [ ] `pnpm install && pnpm build` exits 0 with zero TS errors and zero ESLint warnings
- [ ] Code copy buttons visible on all `<pre>` code blocks in blog posts
- [ ] Copy button copies code text to clipboard and shows "Copied!" feedback for 2 seconds
- [ ] Reading progress bar appears on blog post pages, tracks scroll from 0% to 100%
- [ ] Reading progress bar does NOT appear on home page or blog listing page
- [ ] Table of contents renders for posts with h2/h3 headings
- [ ] Desktop (lg+): TOC appears as sticky sidebar right of article content
- [ ] Mobile (below lg): TOC appears as collapsible "On this page" section
- [ ] TOC anchor links scroll to correct headings in the article
- [ ] h3 entries visually indented under h2 entries in TOC
- [ ] Heading elements in rendered Markdown have correct `id` attributes matching TOC links
- [ ] Plausible analytics script present in HTML `<head>` of all pages with correct `data-domain`
- [ ] Analytics script loads with `defer` — no blocking of page rendering
- [ ] Both light and dark themes render all new components correctly
- [ ] `prefers-reduced-motion: reduce` disables smooth transition on progress bar
- [ ] Code copy button is keyboard accessible with `aria-label`
- [ ] No horizontal overflow on any breakpoint (375px, 768px, 1024px, 1280px)
- [ ] All existing features functional — no regressions (nav, theme, shimmer, scroll spy, tag filter, related posts, RSS)
- [ ] Blog post page correctly composes server and client components (metadata generation still works)
- [ ] Static export generates all expected files in `out/`

## What's Next (Sprint 11 Preview)

Potential future work: syntax highlighting for code blocks (e.g. `rehype-highlight` or `shiki`), real testimonials to replace placeholders, custom domain setup, real headshot photo replacing the avatar placeholder, blog search functionality, or a "Currently building" live status section.
