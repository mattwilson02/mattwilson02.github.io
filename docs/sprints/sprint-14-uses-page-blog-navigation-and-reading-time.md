# Sprint 14 — Uses Page, Blog Navigation & Reading Time

## Overview

**Goal:** Add a `/uses` page showing Matt's development tools and setup, implement previous/next post navigation on blog posts, auto-calculate reading time from content instead of hardcoding it, and add breadcrumb navigation with structured data on blog pages for improved SEO.

**Rationale:** The site is polished and content-rich after 13 sprints, but three gaps remain in the "professional developer portfolio" category:

1. **No "Uses" page.** A `/uses` page is standard on developer portfolios (see uses.tech) — recruiters and fellow engineers expect it. It creates another indexable page (the site currently has 1 home page + 1 blog listing + 7 post pages = 9 pages), shows personality, and provides natural SEO keywords around specific tools and technologies Matt works with daily. It also signals depth — this isn't someone who just lists "TypeScript" on a skills page; he can tell you his exact editor setup, terminal config, and why he chose each tool.

2. **No previous/next post navigation.** When a reader finishes a blog post, the only navigation options are "Back to Blog" and the related posts section (which suggests posts by tag overlap). There's no sequential navigation — "Previous Post" / "Next Post" — which is the most intuitive way to browse a blog chronologically. This is standard blog UX that keeps readers on the site.

3. **Hardcoded reading time.** Every blog post has a manually set `readingTime: "6 min read"` string in `blog.ts`. This doesn't update when content changes and requires manual maintenance. Auto-calculating from word count (average reading speed ~238 words/minute) eliminates this maintenance burden and ensures accuracy as posts are edited.

4. **No breadcrumbs on blog pages.** Blog post pages have a "← Back to Blog" text link, but no proper breadcrumb trail (Home → Blog → Post Title). Breadcrumbs improve UX for orientation and are a Google-recommended structured data type (`BreadcrumbList` schema) that can appear as rich results in search.

## What Exists

- **Blog infrastructure (Sprints 8-13):**
  - `src/data/blog.ts` — `BlogPost` interface with `slug`, `title`, `date`, `excerpt`, `tags`, `readingTime` (hardcoded string), `content` (Markdown string). 7 posts sorted newest-first
  - `src/app/blog/page.tsx` — listing page with search (`BlogSearch`) and tag filtering (`TagFilter`). Client component
  - `src/app/blog/[slug]/page.tsx` — server component with `generateStaticParams`, `generateMetadata`, JSON-LD `BlogPosting`, `ReadingProgress`, `TableOfContents` (mobile + desktop sidebar), `BlogPostContent`, `SharePost`, `RelatedPosts`, two "← Back to Blog" links (top and bottom)
  - `src/app/blog/layout.tsx` — wraps blog pages with `Nav` (showBlogLink) and `Footer`. Static metadata
  - `src/components/blog-card.tsx` — card component displaying title, formatted date, reading time, excerpt, tag pills
  - `src/components/related-posts.tsx` — tag-overlap related post suggestions (1-2 cards)
  - `src/components/blog-post-content.tsx` — client component wrapping `ReactMarkdown` with `rehypeHighlight`, `CodeBlock` override, heading ID injection
  - `react-markdown` ^10.1.0, `rehype-highlight` ^7.0.2 installed
- **Blog post page structure (`blog/[slug]/page.tsx`):**
  - Top "← Back to Blog" link → `<article>` with `<h1>`, metadata line (date · readingTime + tag pills), `<hr>`, mobile TOC, flex layout with content + desktop TOC sidebar → `</article>` → `SharePost` → `RelatedPosts` → bottom "← Back to Blog" link
  - No previous/next navigation, no breadcrumbs
- **Home page (`src/app/page.tsx`):** Hero → About → Experience → Projects → Skills → Certifications → LatestPosts → CurrentlyBuilding → Contact → Footer → ScrollToTop
- **Nav (`src/components/nav.tsx`):** 7 home links, 7 blog links. `showBlogLink` prop toggles between anchor and absolute paths
- **Root layout (`src/app/layout.tsx`):** JSON-LD Person schema, Plausible analytics, Inter font, theme script, favicon/manifest metadata
- **Existing routes:** `/` (home), `/blog` (listing), `/blog/[slug]` (7 post pages). **No `/uses` route**
- **`scripts/generate-feeds.ts`:** Prebuild script generating `sitemap.xml` and `feed.xml` from `blogPosts`. Will need updating to include `/uses` in the sitemap
- **Established patterns:**
  - `Section` wrapper (`src/components/section.tsx`): `id`, `py-20 md:py-28`, `max-w-5xl`, `px-6`
  - Data files in `src/data/*.ts` with exported TypeScript interfaces and const data objects
  - CSS variable theming via `var(--color-*)` in `globals.css`
  - Framer Motion `containerVariants` / `itemVariants` with `whileInView="visible"` and `viewport={{ once: true, margin: "-100px" }}`
  - `useReducedMotion()` hook in all animated components
  - Named exports, `"use client"` only where Framer Motion or interactivity is used
  - Card styling: `rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-6` with hover `hover:border-[var(--color-accent)] hover:scale-[1.02]`
  - Tech pill styling: `rounded-full border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-1 text-xs font-medium`
  - Blog layout (`blog/layout.tsx`) wraps pages with `Nav` (showBlogLink) and `Footer` — reusable pattern for new page routes
  - Dynamic imports for below-fold sections in `page.tsx` using `next/dynamic` with `.then(m => ({ default: m.Name }))` pattern

## Architectural Decisions

All previous sprint architectural decisions carry forward. Additional decisions for this sprint:

### 1. Uses Page — Same Layout Pattern as Blog
- The `/uses` route uses a layout similar to the blog: `Nav` (with a link back to home) and `Footer` wrapping the content
- Rather than creating a separate `uses/layout.tsx`, reuse the blog layout pattern by rendering `Nav` and `Footer` directly in the `uses/page.tsx` — the uses page is a single standalone page, not a section with sub-routes like the blog
- Actually, the simpler approach: create `src/app/uses/layout.tsx` following the exact same pattern as `blog/layout.tsx`. This keeps the page file clean and follows the established convention
- Content is data-driven: `src/data/uses.ts` defines categories and tools, the page renders them

### 2. Reading Time — Computed Utility, Not Stored Data
- Create a `calculateReadingTime(content: string): string` utility in `src/lib/reading-time.ts`
- The function strips Markdown syntax, counts words, divides by 238 (average adult reading speed for technical content), rounds up, and returns a formatted string like `"6 min read"`
- The `readingTime` field stays on the `BlogPost` interface for now but becomes ignored — components call `calculateReadingTime(post.content)` instead of using `post.readingTime`
- This is preferred over removing the field (which would be a breaking change across many files) — the field can be deprecated and cleaned up later
- All places that display reading time (`blog-card.tsx`, `blog/[slug]/page.tsx`, `latest-posts.tsx`) use the utility instead of the stored value

### 3. Previous/Next Navigation — Chronological, Data-Driven
- Since `blogPosts` is already sorted newest-first, "previous" means the next older post (higher index) and "next" means the next newer post (lower index)
- A small `PostNavigation` component renders at the bottom of each blog post, between `RelatedPosts` and the bottom "← Back to Blog" link
- The component receives the current post's slug and looks up adjacent posts from the sorted `blogPosts` array
- Visual design: a two-column layout with "← Previous Post" on the left and "Next Post →" on the right, showing the linked post's title. If there's no previous or next (first/last post), that side is empty

### 4. Breadcrumbs — Component + JSON-LD Schema
- A `Breadcrumbs` component renders a simple text trail: Home → Blog → Post Title
- On the blog listing page: Home → Blog
- On individual post pages: Home → Blog → {Post Title}
- Each breadcrumb segment is a link except the current page (rendered as plain text)
- The component also renders a `<script type="application/ld+json">` with the `BreadcrumbList` schema — Google uses this for rich results
- The breadcrumb replaces the top "← Back to Blog" link on post pages — it serves the same navigation purpose with better UX and SEO

### 5. Sitemap Update — Include `/uses`
- The `scripts/generate-feeds.ts` prebuild script needs a minor update to include `/uses` in the sitemap
- The uses page gets `priority: 0.6`, `changefreq: monthly` — it's a reference page, not frequently changing content

## Tasks

### Task 1: Reading Time Utility & Integration

**Objective:** Create an auto-calculation utility for reading time and integrate it across all components that display reading time, replacing the hardcoded `readingTime` field in blog post data.

**Files to create:**

| File | Purpose |
|------|---------|
| `src/lib/reading-time.ts` | Utility function to calculate reading time from Markdown content |

**Files to modify:**

| File | Change |
|------|--------|
| `src/components/blog-card.tsx` | Import and use `calculateReadingTime` instead of `post.readingTime` |
| `src/app/blog/[slug]/page.tsx` | Import and use `calculateReadingTime` instead of `post.readingTime` |

**Requirements — Reading Time Utility (`lib/reading-time.ts`):**
- Export a function `calculateReadingTime(content: string): string`
- Algorithm:
  1. Strip Markdown syntax: remove code blocks (``` fenced blocks), inline code backticks, heading markers (`#`), bold/italic markers (`*`, `_`), link syntax (`[text](url)` → keep text), image syntax (`![alt](url)` → remove entirely), horizontal rules (`---`)
  2. Count remaining words by splitting on whitespace and filtering empty strings
  3. Divide word count by 238 (research-backed average for technical content — slightly slower than the commonly cited 250 due to code-adjacent prose)
  4. Round up to nearest integer (`Math.ceil`)
  5. Return formatted string: `"${minutes} min read"` — minimum 1 min
- Export the function as a named export
- No `"use client"` — this is a pure utility importable by both server and client components

**Requirements — Blog Card Update (`blog-card.tsx`):**
- Import `calculateReadingTime` from `@/lib/reading-time`
- The `BlogCard` component currently receives the full `BlogPost` object (or relevant fields). It displays `readingTime` from the data
- Replace `post.readingTime` (or however the prop is accessed) with `calculateReadingTime(post.content)` in the rendered output
- The `BlogCard` component needs access to `post.content` for this calculation. Check the current props — if `content` is not passed to the card, it needs to be added. Since `BlogCard` is used in `blog/page.tsx`, `latest-posts.tsx`, and `related-posts.tsx`, verify all call sites pass the content field
- Alternative approach if passing `content` to cards is undesirable (cards showing full Markdown content as a prop feels heavy): compute reading times at the data level. Create a helper that maps `blogPosts` to include computed reading time, or compute it where the data is consumed. The builder should choose the cleanest approach — the acceptance criteria is that reading time is auto-calculated, not how it's plumbed

**Requirements — Blog Post Page Update (`blog/[slug]/page.tsx`):**
- Import `calculateReadingTime` from `@/lib/reading-time`
- Replace `post.readingTime` in the metadata line (line ~92: `{formatDate(post.date)} &middot; {post.readingTime}`) with `calculateReadingTime(post.content)`
- No other changes to the page

**Acceptance Criteria:**
- Reading time displayed on blog cards and post pages is auto-calculated from content
- A post with ~1400 words of content (after Markdown stripping) shows "6 min read"
- A post with ~600 words shows "3 min read"
- The utility handles edge cases: empty content returns "1 min read", code-heavy posts strip code blocks before counting
- Both blog listing cards and individual post pages show consistent reading times
- `pnpm build` succeeds with zero TS errors and zero ESLint warnings

---

### Task 2: Uses Page

**Objective:** Build a `/uses` page showing Matt's development tools, editor setup, hardware, and software — creating another indexable page and showing depth beyond skills-list-level detail.

**Files to create:**

| File | Purpose |
|------|---------|
| `src/data/uses.ts` | Uses page data: tool categories and items |
| `src/app/uses/layout.tsx` | Uses page layout wrapping with Nav and Footer |
| `src/app/uses/page.tsx` | Uses page at `/uses` |

**Files to modify:**

| File | Change |
|------|--------|
| `scripts/generate-feeds.ts` | Add `/uses` to sitemap generation |

**Requirements — Data (`uses.ts`):**

Define and export typed interfaces and a data array:

```
interface UsesTool {
  name: string;
  description: string;
  link?: string;
}

interface UsesCategory {
  category: string;
  items: UsesTool[];
}
```

Export a `usesCategories` array. Draft content from Matt's actual stack and the product spec. Categories and items:

1. **Editor & IDE:**
   - VS Code — "Primary editor. Vim keybindings, minimal extensions, integrated terminal for everything."
   - Claude Code — "AI pair programmer. Used it to build Ralph and this portfolio. The future of development is conversational."
   - Cursor — "AI-native editor for when I want inline completions alongside chat. Switches between this and VS Code depending on the task."

2. **Terminal & CLI:**
   - iTerm2 — "Terminal emulator on macOS. Split panes, profiles per project, search that actually works."
   - Zsh + Oh My Zsh — "Shell with git aliases and autocompletion. Nothing fancy — I don't spend time on shell customisation."
   - pnpm — "Package manager for all TypeScript projects. Fast, disk-efficient, strict by default."

3. **Languages & Frameworks:**
   - TypeScript — "Default choice for everything. Strict mode always on. If I'm writing JavaScript, something has gone wrong."
   - Next.js — "React framework for web apps. Static export for this site, full-stack for client projects."
   - React Native (Expo) — "Cross-platform mobile. EAS Build for deployment. Maestro for E2E testing."
   - Python — "AI/ML work, scripting, backend services. Flask for APIs, not Django — I prefer assembling parts over batteries-included."
   - NestJS — "Enterprise-grade Node.js backend framework. Domain-driven design with decorators and dependency injection."

4. **AI & LLMs:**
   - Claude API (Anthropic) — "Primary LLM for all AI projects. Opus for strategy, Sonnet for code generation, Haiku for classification."
   - ChromaDB — "Vector database for RAG pipelines. Simple, embeddable, good enough for personal-scale projects."
   - n8n — "Workflow automation for connecting services. Self-hosted on Hetzner alongside Imperium."

5. **Infrastructure & DevOps:**
   - Docker + Docker Compose — "Container orchestration for all deployable projects. Health checks, volume management, restart policies."
   - Hetzner VPS — "Hosting for personal projects. Single server, Docker Compose, Caddy reverse proxy. Simple and cheap."
   - Caddy — "Reverse proxy with automatic HTTPS. Replaced nginx and never looked back."
   - Azure DevOps — "CI/CD for client work at Stonehage Fleming. Pipelines, boards, repos."
   - GitHub Actions — "CI/CD for personal projects. This site deploys via Actions on push to main."

6. **Testing:**
   - Vitest — "Unit and integration testing for all TypeScript projects. Fast, native ESM, compatible with Jest API."
   - Cypress — "E2E testing for web apps. Reliable, good DX, snapshot testing when needed."
   - Maestro — "E2E testing for React Native. Simpler than Detox, YAML-based flows, runs on real devices."

7. **Hardware:**
   - MacBook Pro M3 — "Primary development machine. 16GB RAM is enough for everything except large Docker builds."
   - 27" Monitor — "Single external monitor. Ultrawide tempting but one big screen keeps me focused."

**Follow the copy style guide:** Descriptions are terse, opinionated, first person. Not product descriptions — personal takes on why each tool was chosen. One sentence, occasionally two.

**Requirements — Uses Layout (`uses/layout.tsx`):**
- Follow the exact same pattern as `src/app/blog/layout.tsx`
- Render `Nav` (with `showBlogLink={true}` — reuse the same prop since the nav behaviour is identical: section links become absolute paths, "Blog" link is visible)
- Render `<main id="main-content">{children}</main>` then `Footer`
- Export metadata: `title: "Uses — Matt Wilson"`, `description: "Tools, software, and hardware I use for full-stack development and AI engineering."`

**Requirements — Uses Page (`uses/page.tsx`):**
- Server component — no interactivity needed
- Page heading: "Uses" as `<h1>` with same styling as blog listing heading (`text-3xl font-bold tracking-tight md:text-4xl`)
- Intro line below heading in muted text: "Tools, software, and hardware I use daily. Opinionated choices, briefly explained." or similar — direct, short
- Render each category as a section with the category name as an `<h2>` (`text-xl font-semibold mb-4`)
- Within each category, render items as a clean list — not cards. Each item: tool name in bold, description in muted text, optional external link on the name (opens in new tab with `rel="noopener noreferrer"`)
- Layout: single column, generous spacing between categories. Use the same `max-w-5xl mx-auto px-6` container with `py-20 md:py-28` padding
- Items within a category can be rendered as a `<dl>` (definition list) for semantic HTML — `<dt>` for the tool name, `<dd>` for the description. Or as a simple list. The builder should choose whichever is cleaner
- Add subtle visual separation between categories (either `border-b border-[var(--color-border)]` with padding or generous margin)
- No Framer Motion animations — this is a reference page, not a showcase. Keep it static and fast
- Content driven from `uses.ts`, not hardcoded in JSX

**Requirements — Sitemap Update (`scripts/generate-feeds.ts`):**
- Add `https://mattwilson02.github.io/uses` to the sitemap URL list
- Priority: `0.6`, changefreq: `monthly`
- Position it after the home page URL and before the blog listing URL in the sitemap
- After this change, the sitemap will contain 10 URLs: home, uses, /blog, and 7 individual post URLs

**Acceptance Criteria:**
- `/uses` route renders a styled page with 7 tool categories and their items
- Uses page has Nav and Footer via its layout (same chrome as blog pages)
- Nav on the uses page works identically to blog pages (absolute paths for section links)
- Each tool shows name, description, and optional link
- Descriptions follow the copy style guide: terse, opinionated, first person
- Page is responsive at all breakpoints
- Content driven from `uses.ts`
- `sitemap.xml` includes `/uses` URL after rebuild
- Both light and dark themes render correctly
- `pnpm build` succeeds with zero TS errors and zero ESLint warnings

---

### Task 3: Breadcrumb Navigation with Structured Data

**Objective:** Add breadcrumb navigation to blog pages (listing and individual posts) with `BreadcrumbList` JSON-LD schema, replacing the top "← Back to Blog" link on post pages with a proper breadcrumb trail.

**Files to create:**

| File | Purpose |
|------|---------|
| `src/components/breadcrumbs.tsx` | Reusable breadcrumb component with JSON-LD structured data |

**Files to modify:**

| File | Change |
|------|--------|
| `src/app/blog/page.tsx` | Add `Breadcrumbs` above the page heading |
| `src/app/blog/[slug]/page.tsx` | Replace top "← Back to Blog" link with `Breadcrumbs`; add BreadcrumbList JSON-LD |

**Requirements — Breadcrumbs Component (`breadcrumbs.tsx`):**
- Server component — no interactivity needed
- Props interface:
  ```
  interface BreadcrumbItem {
    label: string;
    href?: string;  // undefined = current page (rendered as plain text)
  }

  interface BreadcrumbsProps {
    items: BreadcrumbItem[];
  }
  ```
- Renders a `<nav aria-label="Breadcrumb">` containing an `<ol>` list of breadcrumb items
- Each item except the last is a link (`<a>` or Next.js `<Link>`), styled in muted text with hover transition to foreground colour: `text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-foreground)]`
- The last item (current page) is rendered as `<span>` in `text-sm text-[var(--color-foreground)]` — not a link
- Items separated by a `/` or `›` character in muted colour between them
- Renders a `<script type="application/ld+json">` with the `BreadcrumbList` schema:
  ```json
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://mattwilson02.github.io"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://mattwilson02.github.io/blog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Post Title"
      }
    ]
  }
  ```
- The last item in the schema omits the `item` URL (Google's recommendation for the current page)
- The site URL (`https://mattwilson02.github.io`) should be used for absolute URLs in the schema. Import or define as a constant

**Requirements — Blog Listing Page Update (`blog/page.tsx`):**
- Import `Breadcrumbs` and render it above the `<h1>` heading with `mb-4` spacing
- Breadcrumb trail: `[{ label: "Home", href: "/" }, { label: "Blog" }]`
- This is a simple 2-level breadcrumb — Home → Blog (current page)

**Requirements — Blog Post Page Update (`blog/[slug]/page.tsx`):**
- Import `Breadcrumbs` component
- Replace the top "← Back to Blog" `<Link>` element (currently at lines 78-83) with `<Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: post.title }]} />`
- The breadcrumb trail: Home → Blog → {Post Title}
- Add the `BreadcrumbList` JSON-LD to the existing structured data. The component handles this internally — no additional `<script>` tag needed in the page
- The bottom "← Back to Blog" link (lines 143-150) remains unchanged — it's still useful as a closing navigation element after reading the post
- The `BreadcrumbList` schema is separate from the existing `BlogPosting` schema — both render as independent `<script type="application/ld+json">` tags. This is correct per Google's structured data guidelines

**Acceptance Criteria:**
- Blog listing page shows "Home / Blog" breadcrumb above the heading
- Blog post pages show "Home / Blog / {Post Title}" breadcrumb replacing the top "← Back to Blog" link
- "Home" links to `/`, "Blog" links to `/blog`, current page title is plain text (not linked)
- HTML source contains valid `BreadcrumbList` JSON-LD on both blog listing and post pages
- Breadcrumbs are accessible: `<nav aria-label="Breadcrumb">` with `<ol>` list
- Breadcrumbs are styled consistently with the site's muted text and transition patterns
- Bottom "← Back to Blog" link on post pages remains unchanged
- Both light and dark themes render breadcrumbs correctly
- `pnpm build` succeeds with zero TS errors

---

### Task 4: Previous/Next Post Navigation

**Objective:** Add sequential post navigation at the bottom of each blog post, making it easy for readers to browse the blog chronologically without returning to the listing page.

**Files to create:**

| File | Purpose |
|------|---------|
| `src/components/post-navigation.tsx` | Previous/next post navigation links |

**Files to modify:**

| File | Change |
|------|--------|
| `src/app/blog/[slug]/page.tsx` | Add `PostNavigation` between `RelatedPosts` and the bottom "← Back to Blog" link |

**Requirements — PostNavigation Component (`post-navigation.tsx`):**
- Server component — no interactivity needed. The data is static and computed from the `blogPosts` array
- Props interface:
  ```
  interface PostNavigationProps {
    currentSlug: string;
  }
  ```
- Algorithm:
  1. Import `blogPosts` from `@/data/blog`
  2. Find the index of the current post by slug
  3. "Next" (newer) post = `blogPosts[currentIndex - 1]` (lower index = newer, since the array is sorted newest-first)
  4. "Previous" (older) post = `blogPosts[currentIndex + 1]` (higher index = older)
  5. If the current post is the newest (index 0), there is no "Next". If it's the oldest (last index), there is no "Previous"
- Render a two-column layout using CSS grid or flexbox:
  - Left side: "← Previous" label above the previous post's title, linking to `/blog/${prevPost.slug}`. If no previous post, render empty space
  - Right side: "Next →" label above the next post's title, linking to `/blog/${nextPost.slug}`. If no next post, render empty space. Text aligned right
  - Use `justify-between` so the two sides sit at opposite edges
- Styling:
  - Direction labels ("← Previous", "Next →"): `text-xs text-[var(--color-muted)] uppercase tracking-wide`
  - Post titles: `text-sm font-medium text-[var(--color-foreground)] transition-colors hover:text-[var(--color-accent)]` — clickable link
  - Container: `border-t border-[var(--color-border)] pt-8 mt-8` — consistent with other separator styling in the post page
  - The entire left or right side should be a `<Link>` wrapping both the label and the title for a larger click target
- If there are no adjacent posts (blog has only 1 post), don't render the component at all
- Accessible: links have descriptive text (the post title), direction labels provide context

**Requirements — Blog Post Page Update (`blog/[slug]/page.tsx`):**
- Import `PostNavigation` component
- Render it between `<RelatedPosts>` and the bottom "← Back to Blog" `<div>`, passing `currentSlug={post.slug}`
- The visual flow at the bottom of a post becomes: SharePost → RelatedPosts → PostNavigation → "← Back to Blog"

**Acceptance Criteria:**
- Each blog post shows previous/next navigation links at the bottom
- The newest post (currently "Docker in Production") shows only "← Previous" (no "Next")
- The oldest post (currently "Specs Over Keystrokes") shows only "Next →" (no "Previous")
- Middle posts show both directions
- Post titles are displayed and link to the correct posts
- Navigation is chronological: "Previous" goes to the older post, "Next" goes to the newer post
- Layout is two-column: previous on the left, next on the right
- Both light and dark themes render correctly
- Responsive: on mobile, the two-column layout should still work (titles may wrap, which is fine) or stack vertically if the builder determines that looks better
- `pnpm build` succeeds with zero TS errors

---

### Task 5: Build Verification & Integration

**Objective:** Verify the complete site builds cleanly with all Sprint 14 changes, confirm all new features work end-to-end, and ensure no regressions.

**Files to modify:** None expected — this is a verification task. Fix issues in relevant files if found.

**Requirements — Build Verification Checklist:**

The builder must verify all of the following after completing Tasks 1-4:

- [ ] `pnpm build` exits 0 with zero TypeScript errors and zero ESLint warnings
- [ ] `out/` directory contains all expected files: `index.html`, `404.html`, `sitemap.xml`, `feed.xml`, `og-image.png`, `robots.txt`, `.nojekyll`, `favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png`, `apple-touch-icon.png`, `site.webmanifest`, `matt-wilson-resume.pdf`, `headshot.png`, `blog/index.html`, `blog/*/index.html` for all 7 posts, and `uses/index.html`
- [ ] `/uses` page renders with 7 tool categories and all items
- [ ] Uses page has Nav and Footer via its layout
- [ ] `sitemap.xml` contains 10 URLs: home, uses, /blog, and 7 individual post URLs
- [ ] Reading time on blog cards and post pages is auto-calculated (not the old hardcoded values)
- [ ] Reading times are consistent between card view and post view for the same post
- [ ] Blog listing page shows breadcrumbs: Home / Blog
- [ ] Blog post pages show breadcrumbs: Home / Blog / {Post Title}
- [ ] `BreadcrumbList` JSON-LD schema present in HTML source of blog listing and post pages
- [ ] Top "← Back to Blog" link on post pages replaced by breadcrumbs
- [ ] Bottom "← Back to Blog" link remains unchanged
- [ ] Previous/next navigation appears at the bottom of each blog post
- [ ] Newest post shows only "← Previous", oldest post shows only "Next →", middle posts show both
- [ ] Previous/next links navigate to the correct posts in chronological order
- [ ] All existing features still work: shimmer animation, availability badge, nav scroll spy, theme toggle, mobile hamburger, blog search, tag filter, code copy, reading progress, TOC, share buttons, related posts, RSS autodiscovery, syntax highlighting
- [ ] Both light and dark themes render all new components and pages correctly
- [ ] Responsive at mobile (375px), tablet (768px), and desktop (1280px)

**Acceptance Criteria:**
- All verification checklist items pass
- No regressions to existing functionality
- The site remains production-ready

## Implementation Order

1. **Task 1** — Reading time utility (foundational — creates the utility used by Tasks 2's potential future needs and directly impacts blog display)
2. **Task 2** — Uses page (independent of Tasks 1, 3, 4 — creates new route and data file)
3. **Task 3** — Breadcrumbs (independent of Tasks 1 and 2 — modifies blog pages)
4. **Task 4** — Previous/next navigation (independent of Tasks 1-3 — modifies blog post page)
5. **Task 5** — Build verification (depends on Tasks 1-4 completing)

Tasks 1, 2, 3, and 4 are largely independent. Task 1 and Task 3 both modify `blog/[slug]/page.tsx` — they touch different parts (reading time display vs. replacing the top back link), so they can be applied sequentially without conflict. Task 4 also modifies the same file (adding post navigation). The builder should apply changes to `blog/[slug]/page.tsx` in order: Task 1 (reading time), then Task 3 (breadcrumbs), then Task 4 (post nav).

Task 2 is fully independent — it creates entirely new files and only touches `generate-feeds.ts`.

## File Count

| Task | New Files | Modified Files | Total New |
|------|-----------|----------------|-----------|
| Task 1 | 1 | 2 | 1 |
| Task 2 | 3 | 1 | 4 |
| Task 3 | 1 | 2 | 5 |
| Task 4 | 1 | 1 | 6 |
| Task 5 | 0 | 0 | 6 |

**6 new files, 6 modified files (some across multiple tasks).** Well within the 15-file limit.

**New files:**
1. `src/lib/reading-time.ts`
2. `src/data/uses.ts`
3. `src/app/uses/layout.tsx`
4. `src/app/uses/page.tsx`
5. `src/components/breadcrumbs.tsx`
6. `src/components/post-navigation.tsx`

**Modified files:**
1. `src/components/blog-card.tsx` (Task 1 — auto reading time)
2. `src/app/blog/[slug]/page.tsx` (Tasks 1, 3, 4 — reading time, breadcrumbs, post nav)
3. `src/app/blog/page.tsx` (Task 3 — breadcrumbs on listing page)
4. `scripts/generate-feeds.ts` (Task 2 — add /uses to sitemap)

**Unique files touched:** 10 total (6 new + 4 modified). Lean sprint.

## Definition of Done

- [ ] `pnpm install && pnpm build` exits 0 with zero TS errors and zero ESLint warnings
- [ ] `calculateReadingTime` utility correctly computes reading time from Markdown content
- [ ] Reading time on blog cards and post pages is auto-calculated, not hardcoded
- [ ] `/uses` page renders with 7 tool categories and all items, styled consistently with the site
- [ ] Uses page content is data-driven from `uses.ts`
- [ ] Uses page has Nav and Footer matching blog page chrome
- [ ] `sitemap.xml` contains 10 URLs including `/uses`
- [ ] Breadcrumbs render on blog listing page (Home / Blog) and post pages (Home / Blog / Title)
- [ ] `BreadcrumbList` JSON-LD schema present in HTML source of blog pages
- [ ] Top "← Back to Blog" link on post pages replaced by breadcrumb trail
- [ ] Previous/next post navigation renders at the bottom of each blog post
- [ ] Navigation shows correct adjacent posts in chronological order
- [ ] First and last posts gracefully handle missing prev/next
- [ ] All links in breadcrumbs and post navigation point to correct URLs
- [ ] Both light and dark themes render all new features correctly
- [ ] Responsive at mobile (375px), tablet (768px), and desktop (1280px)
- [ ] No regressions to existing features (nav, theme, blog search, tag filter, TOC, code copy, analytics)
- [ ] Static export generates all expected files in `out/`

## What's Next (Sprint 15 Preview)

Potential future work: custom domain setup with DNS configuration, real testimonials to restore the section with genuine quotes, blog post pagination as post count grows beyond 10, a dedicated resume/CV page (HTML version of the PDF), keyboard shortcut navigation (`j`/`k` for next/previous post), or a dark-mode-aware code block theme toggle.
