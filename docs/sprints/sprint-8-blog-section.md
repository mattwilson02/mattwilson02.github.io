# Sprint 8 — Blog Section

## Overview

**Goal:** Add a blog with listing page, individual post pages, and a "Latest Writing" preview on the home page — giving the portfolio SEO-indexable content pages and demonstrating technical thought leadership.

**Rationale:** The core portfolio is feature-complete (Sprints 1-6). Every section from the product spec is built and deployed. The single highest-value addition now is a blog: it creates multiple indexable pages (the site currently has exactly one), demonstrates writing ability to hiring managers, and positions Matt as a thinker — not just a builder. Blog posts about AI engineering, autonomous agents, and the self-taught journey map directly to his positioning. The product spec listed "Blog / writing section" as out of scope *for the initial build*; that build is done.

## What Exists

- **Full single-page portfolio:** Nav (6 links: Home, About, Experience, Projects, Skills, Contact), Hero (shimmer animation, availability badge, resume download), About, Experience, Projects, Skills, Certifications, Testimonials (placeholder), Contact, Footer, ScrollToTop — all with dark/light theming and scroll-triggered Framer Motion animations
- **Root layout (`src/app/layout.tsx`):** Provides Inter font, theme script, JSON-LD Person schema, skip-to-content link, OG metadata. All child routes inherit this automatically
- **Nav and Footer rendered inside `src/app/page.tsx`:** NOT in the root layout — blog pages will need their own Nav/Footer rendering or a shared layout
- **Established patterns:**
  - `Section` wrapper (`src/components/section.tsx`): `id`, `py-20 md:py-28`, `max-w-5xl`, `px-6`
  - Data files in `src/data/*.ts` with exported TypeScript interfaces and const data objects
  - CSS variable theming via `var(--color-*)` in `globals.css`
  - Framer Motion `containerVariants` / `itemVariants` with `whileInView="visible"` and `viewport={{ once: true, margin: "-100px" }}`
  - `useReducedMotion()` hook in all animated components
  - Named exports, `"use client"` only where Framer Motion or interactivity is used
  - Card styling: `rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-6` with hover `hover:border-[var(--color-accent)] hover:scale-[1.02]`
  - Tech pill styling: `rounded-full border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-1 text-xs font-medium`
  - Dynamic imports for below-fold sections in `page.tsx` using `next/dynamic` with `.then(m => ({ default: m.Name }))` for named exports
- **Static export (`output: 'export'`):** All routes must be statically generated. `generateStaticParams` works correctly with this mode — used to generate blog post pages at build time
- **No existing blog infrastructure:** No `/blog` route, no markdown rendering dependency, no content files

## Architectural Decisions

All previous sprint architectural decisions carry forward. Additional decisions for this sprint:

### 1. Blog Content as Structured TypeScript Data
- Blog posts live in `src/data/blog.ts` as a typed array, following the exact same data-driven pattern as `projects.ts`, `experience.ts`, etc.
- Post content is stored as a Markdown string within each post object. This keeps content co-located with metadata and avoids MDX config complexity
- A lightweight Markdown renderer (`react-markdown`) parses the content string into React elements at render time
- This requires one new dependency (`react-markdown`) — no config changes to `next.config.ts`
- To add a new blog post, the author edits one file (`blog.ts`) — same DX pattern as adding a project or experience entry

### 2. Blog as Separate Routes, Not Sections
- Blog listing page at `/blog` — a new route, not an anchor section on the home page
- Individual posts at `/blog/[slug]` — dynamic route using `generateStaticParams` to produce static HTML at build time
- This creates multiple indexable pages (one per post + the listing page), which is the primary SEO benefit
- Blog pages share the root `layout.tsx` (font, theme, skip-to-content) but need their own Nav and Footer — handled via a `src/app/blog/layout.tsx`

### 3. Blog Layout Wraps Nav and Footer
- `src/app/blog/layout.tsx` renders `Nav`, `<main>`, and `Footer` around its children — blog pages get the same chrome as the home page without duplicating imports in every blog route
- The home page (`page.tsx`) continues to render its own Nav/Footer directly (no change to existing code beyond adding the LatestPosts section)
- The blog layout does NOT include ScrollToTop — blog pages are short enough that it's unnecessary

### 4. "Latest Writing" Section on Home Page
- A small section on the home page showing the 2-3 most recent posts as preview cards, linking to the full post
- Positioned between Testimonials and Contact — the blog tease comes before the closing CTA
- Follows the established section pattern (`Section` wrapper, Framer Motion animations, data-driven)
- This is the bridge that tells visitors the blog exists without requiring them to find it via nav

### 5. Nav Gets a "Blog" Link — But Only on Blog Pages
- Adding "Blog" as a 7th link in the main nav would crowd the home page nav (currently 6 links at `gap-5`)
- Instead: the blog layout uses a slightly modified nav that includes a "Blog" link. On the home page, the nav stays at 6 links
- The simplest way to achieve this: add an optional `extraLinks` prop or a `showBlogLink` boolean to the `Nav` component. The blog layout passes it; the home page doesn't
- On blog pages, the Nav links to `/` for "Home" (not `#home`) and `/#about`, `/#projects`, etc. for section links, plus `/blog` for the blog itself

### 6. Blog Post SEO — Per-Page Metadata
- Each blog post page uses Next.js `generateMetadata` to set unique `<title>`, `<meta description>`, and Open Graph tags per post
- The blog listing page has its own static metadata
- Blog posts include JSON-LD `BlogPosting` structured data for rich search results

## Tasks

### Task 1: Blog Data Structure & Initial Posts

**Objective:** Create the blog data file with typed interfaces and 3 initial posts that demonstrate Matt's expertise and thinking.

**Files to create:**

| File | Purpose |
|------|---------|
| `src/data/blog.ts` | Blog post metadata and content |

**Dependencies to add:**

| Package | Purpose |
|---------|---------|
| `react-markdown` | Render Markdown content strings as React elements |

**Requirements — Data (`blog.ts`):**

Define and export typed interfaces and a data array:

```
interface BlogPost {
  slug: string;
  title: string;
  date: string;           // ISO date string (YYYY-MM-DD)
  excerpt: string;        // 1-2 sentence preview for listing cards and meta description
  tags: string[];         // Topic tags displayed as pills
  readingTime: string;    // e.g. "5 min read"
  content: string;        // Full post body as a Markdown string
}
```

Export a `blogPosts` array sorted by date (newest first) with 3 initial posts. The builder should draft real, substantive content following the established copy style guide (direct, confident, no buzzwords). Each post should be 400-600 words — substantial enough to demonstrate thought leadership, short enough to be a realistic first batch.

**Post 1: "Building an Autonomous AI Developer Agent"**
- `slug`: `"building-an-autonomous-ai-developer-agent"`
- `date`: `"2026-03-15"`
- `tags`: `["AI", "TypeScript", "Developer Tools"]`
- Content direction: Technical write-up on building Ralph. What problem it solves (developers manually orchestrating build-test-fix cycles), the architecture decisions (multi-tier LLM routing — Opus for strategy, Sonnet for code), how it reads a codebase and generates sprint specs, and what he learned about agentic systems in practice. Concrete, not abstract. Reference real decisions, not buzzwords
- Tone: Engineer writing for engineers. "Here's what I built and why" — not "5 Reasons AI Will Change Everything"

**Post 2: "Self-Taught to Senior Engineer in 4 Years"**
- `slug`: `"self-taught-to-senior-engineer"`
- `date`: `"2026-02-20"`
- `tags`: `["Career", "Learning"]`
- Content direction: The journey from discovering Bitcoin in 2022 to shipping production fintech at Stonehage Fleming. What actually mattered (problem-solving, reading real codebases, shipping under pressure), what didn't (tutorial hell, chasing frameworks). The Bitcoin Core goal as ongoing motivation. Honest about the path — not a "you can do it too!" motivational post
- Tone: Reflective but direct. First person throughout

**Post 3: "Specs Over Keystrokes: How AI Changes What Engineers Do"**
- `slug`: `"specs-over-keystrokes"`
- `date`: `"2026-01-10"`
- `tags`: `["AI", "Engineering", "Opinion"]`
- Content direction: Matt's core belief that the job is becoming about writing definitive specs and evaluating output, not typing code. What this means in practice (using Ralph to build this very website), why critical thinking matters more than ever, and why this is an opportunity not a threat. Grounded in real experience, not speculation
- Tone: Opinionated but backed by practice. "Here's what I've observed shipping software with AI agents"

**Acceptance Criteria:**
- `react-markdown` added as a dependency in `package.json`
- `blogPosts` array exported with 3 posts, each with all interface fields populated
- Content is real, substantive Markdown (headings, paragraphs, code blocks where appropriate, emphasis)
- Posts sorted by date, newest first
- Slugs are URL-safe (lowercase, hyphens, no special characters)
- `pnpm install` succeeds with the new dependency

---

### Task 2: Blog Listing Page & Blog Card Component

**Objective:** Build the `/blog` route as a listing page showing all posts as preview cards, and create a reusable blog card component.

**Files to create:**

| File | Purpose |
|------|---------|
| `src/app/blog/layout.tsx` | Blog layout wrapping pages with Nav and Footer |
| `src/app/blog/page.tsx` | Blog listing page at `/blog` |
| `src/components/blog-card.tsx` | Reusable blog post preview card |

**Requirements — Blog Layout (`blog/layout.tsx`):**
- Renders `Nav` (with blog link enabled — see Task 4), then `<main id="main-content">` wrapping `{children}`, then `Footer`
- This gives all blog pages the same chrome as the home page
- Exports metadata for the blog section: `title: "Blog — Matt Wilson"`, description: "Writing about AI engineering, developer tools, and the craft of building software."
- The layout is a server component — no `"use client"` needed

**Requirements — Blog Listing Page (`blog/page.tsx`):**
- Page heading: "Blog" as `<h1>` with the same styling as section headings (`text-3xl font-bold tracking-tight md:text-4xl`)
- A short intro line below the heading in muted text — something like "Thoughts on building software, AI systems, and the engineering craft." — following the copy style guide
- Responsive grid of blog cards: 1 column on mobile, 2 columns on md+. No need for 3 columns — blog cards are wider/more text-heavy than project cards
- Cards sorted by date, newest first (the data array is already sorted)
- Use the same `max-w-5xl mx-auto px-6` container as other pages for visual consistency
- Add vertical padding (`py-20 md:py-28`) matching the Section wrapper pattern
- This is a server component — no Framer Motion animations needed on the listing page (it's a navigation page, not a showcase)

**Requirements — Blog Card (`blog-card.tsx`):**
- Accepts a `BlogPost` (or subset: slug, title, date, excerpt, tags, readingTime) as props
- Links to `/blog/${slug}` — the entire card is a clickable `<a>` link (same pattern as `project-card.tsx`)
- Displays: title (bold, `text-lg`), date (muted, `text-sm`, formatted as "Mar 15, 2026"), reading time (muted, `text-sm`), excerpt (muted body text), and tags as pills
- Card styling matches project cards: `rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-6`, hover `hover:border-[var(--color-accent)] hover:scale-[1.02]` with smooth transition
- Tag pills use the established tech pill style
- Date and reading time can be on the same line, separated by a middot or dash
- The card should feel scannable — a recruiter should be able to quickly identify which posts interest them

**Acceptance Criteria:**
- `/blog` route renders a listing page with 3 post cards
- Blog layout includes Nav and Footer — blog pages look like part of the same site
- Cards link to `/blog/[slug]` correctly
- Date is human-formatted (not raw ISO)
- Tags display as pills
- Responsive: 1 column on mobile, 2 on md+
- Card hover effect matches project cards
- `pnpm build` succeeds — the blog listing page is included in the static export

---

### Task 3: Blog Post Page

**Objective:** Build the `/blog/[slug]` dynamic route that renders individual blog posts with Markdown content, metadata, and structured data.

**Files to create:**

| File | Purpose |
|------|---------|
| `src/app/blog/[slug]/page.tsx` | Individual blog post page with dynamic routing |

**Requirements — Dynamic Route (`blog/[slug]/page.tsx`):**

**Static Generation:**
- Export a `generateStaticParams` function that returns all slugs from `blogPosts` data — this generates a static HTML page for each post at build time
- Export a `generateMetadata` function that returns per-post SEO metadata: unique `<title>` (format: `"${post.title} — Matt Wilson"`), `<meta description>` from the post excerpt, Open Graph tags with post title and excerpt

**Page Content:**
- Look up the post by slug from the `blogPosts` array. If not found, call `notFound()` from `next/navigation` to trigger the 404 page
- Render a clean article layout:
  - `<article>` semantic element wrapping the content
  - Post title as `<h1>` (same size as section headings: `text-3xl font-bold tracking-tight md:text-4xl`)
  - Metadata line below title: date (formatted) + reading time + tags as pills — in muted text
  - Horizontal rule or spacing separator between metadata and content
  - Post content rendered via `react-markdown` within a prose-styled container
  - A "Back to Blog" link at the top and/or bottom of the post — styled as a subtle text link with a left arrow (e.g. "← Back to Blog"), linking to `/blog`

**Markdown Styling:**
- The rendered Markdown needs proper typography styles: headings (`h2`, `h3`), paragraphs with line-height, code blocks with background, inline code with background, bold/italic, lists, blockquotes
- Define these styles in `globals.css` under a `.prose` class (or use scoped styles in the component). The prose styles should use CSS variables for theme compatibility:
  - Headings: `var(--color-foreground)`, sized appropriately (`h2` at `text-2xl`, `h3` at `text-xl`)
  - Body text: `var(--color-muted)` with relaxed line-height
  - Code blocks: `var(--color-card)` background with `var(--color-border)` border, monospace font
  - Inline code: same background, slightly smaller with padding
  - Blockquotes: left border in `var(--color-accent)`, italic, muted text
  - Links: `var(--color-accent)` with underline on hover

**JSON-LD Structured Data:**
- Include a `BlogPosting` schema for each post with: `headline`, `datePublished`, `author` (Person with name "Matt Wilson"), `description` (excerpt), `url`
- Render via a `<script type="application/ld+json">` tag

**Layout:**
- Use the same `max-w-5xl mx-auto px-6` container
- Content should be constrained to a comfortable reading width (`max-w-prose` or `max-w-3xl`) centred within the container
- Vertical padding matching other pages (`py-20 md:py-28`)

**Acceptance Criteria:**
- `/blog/building-an-autonomous-ai-developer-agent` (and other slugs) render as individual pages
- `pnpm build` generates static HTML for each blog post in `out/blog/[slug]/index.html`
- Markdown content renders with proper typography (headings, code blocks, paragraphs, lists)
- Both light and dark themes render blog content correctly — code blocks and blockquotes are themed
- Per-post SEO metadata appears in the HTML source (unique title, description, OG tags)
- JSON-LD BlogPosting schema is present
- "Back to Blog" link navigates to `/blog`
- Invalid slugs show the 404 page
- Post page is responsive at all breakpoints

---

### Task 4: Nav Update for Blog Pages

**Objective:** Enable blog navigation by adding a "Blog" link to the Nav on blog pages, and update section anchor links to work as cross-page links from the blog.

**Files to modify:**

| File | Change |
|------|--------|
| `src/components/nav.tsx` | Add optional blog link support; make anchor links work as absolute URLs when on blog pages |

**Requirements — Nav Enhancement (`nav.tsx`):**
- Add a `showBlogLink` prop (optional boolean, defaults to `false`) to the `Nav` component
- When `showBlogLink` is `true`:
  - Add `{ label: "Blog", href: "/blog" }` to the rendered links — positioned as the last item after Contact
  - Change section anchor links (`#about`, `#experience`, `#projects`, `#skills`, `#contact`) to absolute paths (`/#about`, `/#experience`, etc.) so they navigate back to the home page's correct section
  - Change the "Home" link from `#home` to `/`
  - The scroll spy intersection observer should be disabled (or gracefully handle missing section elements) — there are no `#about`, `#projects`, etc. sections on blog pages
- When `showBlogLink` is `false` (default): no changes to current behaviour. The home page nav continues to work exactly as it does today with 6 anchor links
- The blog layout (`blog/layout.tsx`) passes `showBlogLink={true}` when rendering `<Nav />`
- The mobile hamburger menu should include "Blog" when enabled, using the same styling as other links

**Why not always show the Blog link:**
- The home page nav has 6 links at `gap-5` — 7 links would be tight on tablet-width viewports
- Section anchor links only work on the home page; showing them as-is on blog pages leads to broken `#` scrolls
- This approach keeps both contexts clean without conditional logic in every link

**Acceptance Criteria:**
- Home page nav: unchanged — 6 links with anchor scrolling, no "Blog" link (unless the builder determines 7 fits cleanly at `md`, in which case adding it globally is acceptable)
- Blog pages nav: includes "Blog" link, section links navigate back to home page sections (`/#about` etc.)
- "Matt Wilson" logo link navigates to `/` from blog pages
- Mobile hamburger menu shows correct links in both contexts
- Scroll spy on blog pages does not throw errors (handles missing section elements)
- `pnpm build` succeeds with zero TypeScript errors

---

### Task 5: Latest Posts Section on Home Page

**Objective:** Add a "Latest Writing" section to the home page showing the 2-3 most recent blog post previews, bridging visitors from the portfolio to the blog.

**Files to create:**

| File | Purpose |
|------|---------|
| `src/components/latest-posts.tsx` | "Latest Writing" section for the home page |

**Files to modify:**

| File | Change |
|------|--------|
| `src/app/page.tsx` | Add LatestPosts section between Testimonials and Contact |
| `src/app/globals.css` | Add `.prose` styles for blog post Markdown rendering (from Task 3) |

**Requirements — LatestPosts Component (`latest-posts.tsx`):**
- Uses the `Section` wrapper with `id="writing"`
- Heading "Latest Writing" as `<h2>` (same styling as other section headings)
- Imports `blogPosts` from `src/data/blog.ts` and renders the first 2 posts (or 3 if the grid allows — match the project cards pattern)
- Uses the `BlogCard` component from Task 2 for each post
- Below the cards: a "View All Posts →" link to `/blog`, styled as a subtle text link in accent colour (`text-[var(--color-accent)]` with `hover:underline`)
- Scroll-triggered Framer Motion animation using the established `containerVariants` / `itemVariants` pattern with `whileInView` and `viewport={{ once: true, margin: "-100px" }}`
- Respect `useReducedMotion()` as all other sections do
- Client component (`"use client"`) since it uses Framer Motion

**Requirements — Page Assembly (`page.tsx`):**
- Add `LatestPosts` as a dynamic import (following the existing pattern for below-fold sections): `const LatestPosts = dynamic(() => import("@/components/latest-posts").then(m => ({ default: m.LatestPosts })))`
- Section order: Hero → About → Experience → Projects → Skills → Certifications → Testimonials → **LatestPosts** → Contact → Footer

**Requirements — Prose Styles (`globals.css`):**
- Add a `.prose` class with themed Markdown typography styles (see Task 3 for the full specification)
- This is defined in `globals.css` once and used by the blog post page
- All colours use CSS variables for theme compatibility
- Styles needed: `h2`, `h3`, `p`, `ul`, `ol`, `li`, `blockquote`, `pre`, `code`, `a`, `strong`, `em`, `hr`
- Code blocks should use a monospace font stack and `var(--color-card)` background
- Keep the styles minimal and clean — this is a technical blog, not a magazine

**Acceptance Criteria:**
- "Latest Writing" section appears on the home page between Testimonials and Contact
- 2-3 blog post cards display with title, date, excerpt, and tags
- "View All Posts →" link navigates to `/blog`
- Cards link to individual post pages
- Framer Motion scroll animation works on the section
- Both light and dark themes render correctly
- Section order on page is correct: Testimonials → Latest Writing → Contact
- `pnpm build` succeeds with zero TypeScript errors and zero ESLint warnings
- `.prose` styles render blog content correctly in both themes

## Implementation Order

1. **Task 1** — Blog data & dependency (everything else depends on the data file and `react-markdown`)
2. **Task 3** — Blog post page (depends on Task 1 for data; prose styles needed here inform Task 5)
3. **Task 2** — Blog listing page & card component (depends on Task 1 for data; the card is reused in Task 5)
4. **Task 4** — Nav update (depends on Task 2 for the blog layout that consumes the prop)
5. **Task 5** — Latest Posts on home page + prose styles in globals.css (depends on Tasks 2 & 3)

Tasks 2 and 3 can be built in parallel once Task 1 is complete — they create independent files. Task 4 depends on Task 2's blog layout. Task 5 depends on Task 2's blog card and Task 3's prose style requirements.

## File Count

| Task | New Files | Modified Files | Total New |
|------|-----------|----------------|-----------|
| Task 1 | 1 | 1 (package.json) | 1 |
| Task 2 | 3 | 0 | 4 |
| Task 3 | 1 | 0 | 5 |
| Task 4 | 0 | 1 | 5 |
| Task 5 | 1 | 2 | 6 |

**6 new files, 4 modified files.** Well within the 15-file limit. Lean and focused.

**New files:**
1. `src/data/blog.ts`
2. `src/app/blog/layout.tsx`
3. `src/app/blog/page.tsx`
4. `src/app/blog/[slug]/page.tsx`
5. `src/components/blog-card.tsx`
6. `src/components/latest-posts.tsx`

**Modified files:**
1. `package.json` (add `react-markdown`)
2. `src/components/nav.tsx` (blog link prop)
3. `src/app/page.tsx` (add LatestPosts section)
4. `src/app/globals.css` (add `.prose` styles)

## Definition of Done

- [ ] `pnpm install && pnpm build` exits 0 with zero TS errors and zero ESLint warnings
- [ ] `react-markdown` added as a dependency and installed
- [ ] 3 blog posts in `src/data/blog.ts` with real, substantive content (400-600 words each)
- [ ] `/blog` route renders a listing page with all 3 post cards
- [ ] `/blog/[slug]` routes render individual posts with formatted Markdown content
- [ ] Blog post Markdown renders correctly: headings, paragraphs, code blocks, lists, blockquotes
- [ ] Per-post SEO metadata present: unique title, description, OG tags
- [ ] JSON-LD BlogPosting schema present on each post page
- [ ] Blog pages include Nav and Footer via blog layout
- [ ] Nav on blog pages includes "Blog" link and uses absolute paths for section links (`/#about` etc.)
- [ ] Scroll spy on blog pages does not throw errors
- [ ] "Latest Writing" section appears on home page between Testimonials and Contact
- [ ] Latest Writing shows 2-3 recent posts with "View All Posts →" link to `/blog`
- [ ] Blog card hover effects match project cards (border accent + subtle scale)
- [ ] `.prose` styles theme correctly in both light and dark modes
- [ ] Invalid blog slugs show the 404 page
- [ ] All blog pages are responsive at mobile (375px), tablet (768px), and desktop (1280px)
- [ ] Static export generates HTML files for blog listing and all individual posts
- [ ] Blog post content follows the copy style guide: direct, confident, no buzzwords
- [ ] `out/blog/index.html` and `out/blog/[slug]/index.html` files exist in build output

## What's Next (Sprint 9 Preview)

Potential future work: RSS/Atom feed generation for blog subscribers, blog post search or tag filtering, analytics integration (Plausible or similar privacy-respecting option), real testimonials to replace placeholders, custom domain setup, or a real headshot photo replacing the avatar placeholder.
