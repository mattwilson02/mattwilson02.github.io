# Sprint 9 — Blog Discoverability & SEO

## Overview

**Goal:** Make the blog discoverable beyond direct visitors: generate an RSS feed for subscribers, build a dynamic sitemap that includes all blog pages, add tag-based filtering to the listing page, and surface related posts at the bottom of each article to increase engagement.

**Rationale:** Sprint 8 built the blog — 3 posts, listing page, individual post pages with Markdown rendering and per-page SEO metadata. But the blog is effectively invisible to the wider internet. The sitemap (`public/sitemap.xml`) still lists only the home page URL — the `/blog` listing and all 3 `/blog/[slug]` pages are missing from it. There is no RSS feed, so readers can't subscribe. The listing page shows all posts in a flat list with no way to filter by tag. And once someone finishes a post, there's no suggestion of what to read next. These are all standard blog infrastructure pieces that multiply the value of the content that already exists.

## What Exists

- **Blog infrastructure (Sprint 8):**
  - `src/data/blog.ts` — `BlogPost` interface with `slug`, `title`, `date`, `excerpt`, `tags`, `readingTime`, `content` (Markdown string). 3 posts sorted newest-first
  - `src/app/blog/page.tsx` — listing page at `/blog` with 2-column card grid, no filtering
  - `src/app/blog/[slug]/page.tsx` — individual post pages with `generateStaticParams`, `generateMetadata`, `ReactMarkdown` rendering, JSON-LD BlogPosting schema, "Back to Blog" links. No related posts
  - `src/app/blog/layout.tsx` — wraps blog pages with `Nav` (showBlogLink) and `Footer`
  - `src/components/blog-card.tsx` — reusable card with title, date, reading time, excerpt, tags
  - `src/components/latest-posts.tsx` — "Latest Writing" section on home page showing 2 most recent posts
  - `react-markdown` ^10.1.0 already installed
- **Sitemap (`public/sitemap.xml`):** Static XML file with single `<url>` entry for `https://mattwilson02.github.io/`. **Missing:** `/blog`, `/blog/building-an-autonomous-ai-developer-agent`, `/blog/self-taught-to-senior-engineer`, `/blog/specs-over-keystrokes`
- **Root layout (`src/app/layout.tsx`):** Has `metadata` export with OG tags, Twitter card, JSON-LD Person schema. **No RSS feed autodiscovery `<link>` tag**
- **Blog post tags:** Each post has a `tags` string array displayed as pills on cards and post pages. Tags in use: "AI", "TypeScript", "Developer Tools", "Career", "Learning", "Engineering", "Opinion". **No filtering by tag on the listing page**
- **Blog post page:** Renders content then a "Back to Blog" link. **No related/suggested posts**
- **Established patterns:**
  - `Section` wrapper (`src/components/section.tsx`): `id`, `py-20 md:py-28`, `max-w-5xl`, `px-6`
  - Data files in `src/data/*.ts` with exported TypeScript interfaces and const data objects
  - CSS variable theming via `var(--color-*)` in `globals.css`
  - Framer Motion `containerVariants` / `itemVariants` with `whileInView="visible"` and `viewport={{ once: true, margin: "-100px" }}`
  - Card styling: `rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-6` with hover `hover:border-[var(--color-accent)] hover:scale-[1.02]`
  - Tech pill styling: `rounded-full border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-1 text-xs font-medium`
  - Dynamic imports for below-fold sections using `next/dynamic` with `.then(m => ({ default: m.Name }))` pattern
  - Named exports, `"use client"` only where Framer Motion or interactivity is used
  - Blog pages use `max-w-5xl mx-auto px-6` container with `py-20 md:py-28` padding

## Architectural Decisions

All previous sprint architectural decisions carry forward. Additional decisions for this sprint:

### 1. Sitemap Generated at Build Time via a Script
- The current `public/sitemap.xml` is a hand-written static file. With blog posts as dynamic content (sourced from `src/data/blog.ts`), the sitemap needs to be generated at build time to stay in sync
- Add a `scripts/generate-sitemap.ts` script that imports `blogPosts` from the data file and writes a complete `sitemap.xml` to `public/`
- Add a `prebuild` npm script in `package.json` that runs this script before `next build` — ensures the sitemap is always up-to-date when deploying
- Use `tsx` (TypeScript execution) as a dev dependency to run the `.ts` script directly without a separate compile step
- This approach is preferred over Next.js's `sitemap.ts` convention because: (a) it works reliably with `output: 'export'`, (b) it doesn't require runtime, and (c) it's explicit and debuggable

### 2. RSS Feed as a Static XML File Generated at Build Time
- Same approach as the sitemap: a build script reads `blogPosts` and generates `public/feed.xml`
- The script can be combined into the same `scripts/generate-sitemap.ts` file (rename to `scripts/generate-feeds.ts`) since both are static XML generation from the same data source
- RSS 2.0 format (simpler and more widely supported than Atom)
- The root layout gets an RSS autodiscovery `<link>` tag so feed readers can find it automatically

### 3. Tag Filtering as Client-Side State on the Listing Page
- Tags are already displayed on blog cards. Adding filtering means: extract unique tags from all posts, render them as clickable filter pills above the card grid, filter the displayed posts by selected tag
- This is purely client-side — no new routes, no new pages. The listing page becomes a `"use client"` component with `useState` for the active tag filter
- "All" is the default state (no filter). Clicking a tag filters to posts with that tag. Clicking the active tag or "All" clears the filter
- This keeps the URL simple (`/blog`) — no query params needed for 3 posts. If the blog grows to 20+ posts, tag routes can be added later

### 4. Related Posts as a Simple Tag-Overlap Algorithm
- At the bottom of each blog post, show 1-2 other posts that share the most tags with the current post
- The algorithm: for each other post, count shared tags with the current post, sort by overlap count descending, take the top 1-2
- If no posts share tags (unlikely with 3 posts), fall back to showing the most recent post that isn't the current one
- This is computed at render time from the static data — no new data structures needed
- Uses the existing `BlogCard` component for display consistency

## Tasks

### Task 1: Build-Time Sitemap & RSS Feed Generation

**Objective:** Replace the static single-URL sitemap with a build-time generated sitemap that includes all pages (home, blog listing, and every blog post), and generate an RSS 2.0 feed for blog subscribers.

**Files to create:**

| File | Purpose |
|------|---------|
| `scripts/generate-feeds.ts` | Build script that generates `public/sitemap.xml` and `public/feed.xml` |

**Files to modify:**

| File | Change |
|------|--------|
| `package.json` | Add `tsx` dev dependency; add `prebuild` script; add `generate-feeds` script |
| `public/sitemap.xml` | Overwritten at build time (no manual edits — generated file) |

**Dependencies to add:**

| Package | Purpose |
|---------|---------|
| `tsx` | Dev dependency — runs TypeScript scripts directly without compilation |

**Requirements — Feed Generation Script (`scripts/generate-feeds.ts`):**
- Imports `blogPosts` from `../src/data/blog` (relative path — the script runs from the project root)
- Defines `siteUrl` as `"https://mattwilson02.github.io"`

**Sitemap generation:**
- Writes `public/sitemap.xml` with valid XML sitemap format
- Includes these URLs:
  - `https://mattwilson02.github.io/` — priority `1.0`, changefreq `monthly`
  - `https://mattwilson02.github.io/blog` — priority `0.8`, changefreq `weekly`
  - `https://mattwilson02.github.io/blog/${slug}` for each post — priority `0.7`, changefreq `monthly`, `<lastmod>` set to the post's `date`
- Uses the current date (ISO format `YYYY-MM-DD`) for `<lastmod>` on the home and blog listing pages

**RSS feed generation:**
- Writes `public/feed.xml` as a valid RSS 2.0 XML document
- Channel metadata:
  - `<title>`: "Matt Wilson — Blog"
  - `<description>`: "Writing about AI engineering, developer tools, and the craft of building software."
  - `<link>`: `https://mattwilson02.github.io/blog`
  - `<language>`: `en`
  - `<lastBuildDate>`: current date in RFC 2822 format
- One `<item>` per blog post, with:
  - `<title>`: post title
  - `<description>`: post excerpt
  - `<link>`: `https://mattwilson02.github.io/blog/${slug}`
  - `<guid isPermaLink="true">`: same as link
  - `<pubDate>`: post date in RFC 2822 format
  - `<category>` elements: one per tag
- Posts ordered newest-first (matching the data array order)

**Requirements — Package.json Updates:**
- Add `"tsx": "^4.0.0"` to `devDependencies`
- Add script: `"generate-feeds": "tsx scripts/generate-feeds.ts"`
- Add script: `"prebuild": "tsx scripts/generate-feeds.ts"` — this runs automatically before `pnpm build`
- The `prebuild` hook is a built-in npm lifecycle script — no additional config needed

**Acceptance Criteria:**
- Running `pnpm generate-feeds` creates/overwrites `public/sitemap.xml` and `public/feed.xml`
- `pnpm build` automatically generates the feeds before building (via `prebuild`)
- Sitemap contains 5 URLs: home, /blog, and 3 individual post URLs
- RSS feed contains 3 `<item>` entries with correct titles, links, dates, and categories
- Both files are valid XML
- Adding a new post to `blog.ts` and rebuilding automatically includes it in both files
- `pnpm build` exits 0 with zero TS errors and zero ESLint warnings

---

### Task 2: RSS Feed Autodiscovery & Robots.txt Update

**Objective:** Add the RSS feed autodiscovery link to the site's `<head>` so feed readers can find it, and update `robots.txt` to reference the sitemap correctly.

**Files to modify:**

| File | Change |
|------|--------|
| `src/app/layout.tsx` | Add RSS feed autodiscovery via `alternates` in metadata export |
| `public/robots.txt` | Verify sitemap URL is correct (it should already be — this is a verification step) |

**Requirements — RSS Autodiscovery (`layout.tsx`):**
- Add to the existing `metadata` export's `alternates` field:
  ```
  alternates: {
    canonical: siteUrl,
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
  ```
- This tells Next.js to render a `<link rel="alternate" type="application/rss+xml" href="/feed.xml">` in the HTML `<head>`
- The `alternates` field already exists with `canonical` — extend it, don't replace it
- No other changes to `layout.tsx`

**Requirements — Robots.txt Verification:**
- The existing `public/robots.txt` already references `Sitemap: https://mattwilson02.github.io/sitemap.xml` — verify this is correct and matches the generated sitemap path
- No change expected unless the reference is wrong

**Acceptance Criteria:**
- HTML source contains `<link rel="alternate" type="application/rss+xml" href="/feed.xml">` in the `<head>`
- Feed readers (e.g. Feedly, NetNewsWire) can discover the feed by entering the site URL
- `robots.txt` sitemap reference matches the generated sitemap location
- `pnpm build` succeeds with zero TS errors

---

### Task 3: Blog Tag Filtering

**Objective:** Add interactive tag filtering to the blog listing page so visitors can filter posts by topic — making the blog more navigable as the post count grows.

**Files to create:**

| File | Purpose |
|------|---------|
| `src/components/tag-filter.tsx` | Reusable tag filter pill row component |

**Files to modify:**

| File | Change |
|------|--------|
| `src/app/blog/page.tsx` | Convert to client component; add tag filter state; filter displayed posts |

**Requirements — Tag Filter Component (`tag-filter.tsx`):**
- Client component (`"use client"`)
- Props interface:
  ```
  interface TagFilterProps {
    tags: string[];           // unique tags to display
    activeTag: string | null; // currently selected tag, null = show all
    onTagSelect: (tag: string | null) => void;
  }
  ```
- Renders a horizontal flex-wrap row of clickable pill buttons
- First pill: "All" — active when `activeTag` is `null`
- Remaining pills: one per unique tag from the `tags` prop
- Active pill styling: `bg-[var(--color-accent)] text-white border-[var(--color-accent)]` — visually distinct from inactive pills
- Inactive pill styling: matches the established tech pill style (`rounded-full border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-1 text-xs font-medium`), plus `cursor-pointer` and `hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]` for interactivity
- All pills are `<button>` elements (not links — this is state manipulation, not navigation)
- Accessible: `aria-pressed` attribute on each button reflecting active state
- No Framer Motion needed — this is a simple interactive control

**Requirements — Blog Listing Update (`blog/page.tsx`):**
- Convert to a client component (`"use client"`) — needed for `useState`
- Extract unique tags from all `blogPosts`: collect all tags, deduplicate, sort alphabetically
- Add `useState<string | null>(null)` for the active tag filter
- Render the `TagFilter` component between the intro text and the card grid
- Filter the `blogPosts` array: if `activeTag` is `null`, show all posts. Otherwise, show only posts where `tags.includes(activeTag)`
- If the filter results in zero posts (shouldn't happen with current data, but handle gracefully), display a muted text message: "No posts found for this tag."
- The card grid and card rendering remain unchanged — just the data source array is filtered

**Acceptance Criteria:**
- Blog listing page shows tag filter pills above the post grid: "All", "AI", "Career", "Developer Tools", "Engineering", "Learning", "Opinion", "TypeScript"
- Clicking a tag pill filters posts to only those with that tag
- Clicking "All" or the currently active tag clears the filter
- Active tag pill is visually distinct (accent background)
- Pill styling matches the established design language
- Filter is instant (client-side state, no page reload)
- Both light and dark themes render the filter correctly
- `pnpm build` succeeds — client component works with static export

---

### Task 4: Related Posts on Blog Post Pages

**Objective:** Show 1-2 related post suggestions at the bottom of each blog post, encouraging readers to continue exploring the blog instead of bouncing.

**Files to create:**

| File | Purpose |
|------|---------|
| `src/components/related-posts.tsx` | Related posts component showing 1-2 blog cards |

**Files to modify:**

| File | Change |
|------|--------|
| `src/app/blog/[slug]/page.tsx` | Add RelatedPosts component above the "Back to Blog" footer link |

**Requirements — Related Posts Component (`related-posts.tsx`):**
- Server component (no `"use client"` needed — the data is static and computed at build time)
- Props interface:
  ```
  interface RelatedPostsProps {
    currentSlug: string;
    currentTags: string[];
  }
  ```
- Algorithm to find related posts:
  1. Import `blogPosts` from `src/data/blog`
  2. Filter out the current post (by `currentSlug`)
  3. For each remaining post, count how many tags overlap with `currentTags`
  4. Sort by overlap count descending
  5. Take the top 2 posts (or fewer if less than 2 exist)
  6. If no posts share any tags, fall back to the 2 most recent posts (excluding current) — this ensures the section always has content
- Render a "Related Posts" heading (`<h2>` at `text-xl font-semibold`) followed by the posts as `BlogCard` components in a responsive grid (1 column on mobile, 2 on md+)
- Wrap in a container with top border separator (`border-t border-[var(--color-border)] pt-8 mt-12`) matching the existing "Back to Blog" separator styling
- If there are no other posts at all (only 1 post in the blog), don't render anything

**Requirements — Blog Post Page Update (`blog/[slug]/page.tsx`):**
- Import `RelatedPosts` component
- Place it between the article's closing `</article>` tag and the existing "Back to Blog" `<div>` at the bottom
- Pass `currentSlug={post.slug}` and `currentTags={post.tags}` as props
- No other changes to the post page structure

**Acceptance Criteria:**
- Each blog post page shows 1-2 related post cards below the article content
- "Building an Autonomous AI Developer Agent" (tags: AI, TypeScript, Developer Tools) should suggest "Specs Over Keystrokes" (shares "AI" tag) and "Self-Taught to Senior Engineer" (no shared tags but is the fallback)
- "Self-Taught to Senior Engineer" (tags: Career, Learning) should suggest the other 2 posts as fallbacks
- Related post cards link to the correct post pages
- Card styling matches the established `BlogCard` design
- "Related Posts" heading is visually clear but not overpowering
- Both light and dark themes render correctly
- `pnpm build` succeeds with zero TS errors

---

### Task 5: Home Page Blog Link in Navigation

**Objective:** Add a subtle "Blog" link to the home page navigation so visitors can discover the blog without scrolling to the "Latest Writing" section.

**Files to modify:**

| File | Change |
|------|--------|
| `src/components/nav.tsx` | Add "Blog" link to `homeNavLinks` array |

**Requirements:**
- Add `{ label: "Blog", href: "/blog", id: "blog" }` to the `homeNavLinks` array as the last item (after Contact)
- Total home nav links will be: Home, About, Experience, Projects, Skills, Contact, Blog (7 links)
- The "Blog" link is a route link (`/blog`), not an anchor — it navigates to the blog listing page
- The desktop nav currently uses `gap-5` between items. With 7 links, the builder should verify fit at the `md` breakpoint (768px). If tight, reduce to `gap-4`. The mobile hamburger menu handles any count
- The scroll spy should not break: "Blog" has no corresponding section on the home page. The `linkClass` function already handles this — it only highlights links when `!showBlogLink && activeId === id`, and "blog" will never be the `activeId` on the home page since there's no `#blog` section to observe. Verify this doesn't cause issues
- The `blogNavLinks` array (used on blog pages) already includes "Blog" — no changes needed there

**Acceptance Criteria:**
- Home page desktop nav shows 7 links: Home, About, Experience, Projects, Skills, Contact, Blog
- "Blog" link navigates to `/blog`
- "Blog" link never shows as "active" on the home page (no corresponding section to observe)
- Mobile hamburger menu shows all 7 links
- 7 links display without overflow on desktop at `md` breakpoint (768px)
- No scroll spy errors from the missing `#blog` section element
- Blog pages nav is unchanged
- `pnpm build` succeeds with zero TS errors

## Implementation Order

1. **Task 1** — Sitemap & RSS generation (foundational — creates the feed files that Tasks 2 and 5 reference)
2. **Task 2** — RSS autodiscovery & robots.txt (depends on Task 1 creating `feed.xml`)
3. **Task 3** — Tag filtering (independent of Tasks 1-2, can be built in parallel)
4. **Task 4** — Related posts (independent of Tasks 1-3, can be built in parallel)
5. **Task 5** — Nav blog link (independent, can be built in parallel with Tasks 3-4)

Tasks 1 and 2 are sequential (2 depends on 1). Tasks 3, 4, and 5 are fully independent of each other and of Tasks 1-2 — they can all be built in parallel.

## File Count

| Task | New Files | Modified Files | Total New |
|------|-----------|----------------|-----------|
| Task 1 | 1 | 2 (package.json, sitemap.xml*) | 1 |
| Task 2 | 0 | 1 | 1 |
| Task 3 | 1 | 1 | 2 |
| Task 4 | 1 | 1 | 3 |
| Task 5 | 0 | 1 | 3 |

*`sitemap.xml` is overwritten by the script, not manually edited.

**3 new files, 6 modified files (some across multiple tasks).** Well within the 15-file limit.

**New files:**
1. `scripts/generate-feeds.ts`
2. `src/components/tag-filter.tsx`
3. `src/components/related-posts.tsx`

**Modified files:**
1. `package.json` (Task 1 — add `tsx`, add scripts)
2. `public/sitemap.xml` (Task 1 — overwritten by script)
3. `src/app/layout.tsx` (Task 2 — RSS autodiscovery)
4. `src/app/blog/page.tsx` (Task 3 — client component + tag filter)
5. `src/app/blog/[slug]/page.tsx` (Task 4 — related posts)
6. `src/components/nav.tsx` (Task 5 — blog link)

## Definition of Done

- [ ] `pnpm install && pnpm build` exits 0 with zero TS errors and zero ESLint warnings
- [ ] `prebuild` script runs automatically before `next build` and generates both feed files
- [ ] `public/sitemap.xml` contains 5 URLs: home, /blog, and 3 individual post URLs
- [ ] `public/feed.xml` is valid RSS 2.0 with 3 items, correct dates, and category tags
- [ ] HTML `<head>` contains RSS autodiscovery `<link>` tag pointing to `/feed.xml`
- [ ] Blog listing page shows tag filter pills above the post grid
- [ ] Clicking a tag pill filters posts to only those matching the tag
- [ ] Active tag pill uses accent background styling; inactive pills use established pill style
- [ ] "All" pill clears the filter and shows all posts
- [ ] Each blog post page shows 1-2 related post cards below the article content
- [ ] Related posts are determined by tag overlap, with most-recent fallback
- [ ] Related post cards use the existing `BlogCard` component and link correctly
- [ ] Home page nav includes "Blog" as 7th link, navigating to `/blog`
- [ ] Mobile hamburger menu shows all 7 links on the home page
- [ ] No scroll spy errors from the "Blog" link having no corresponding section
- [ ] Both light and dark themes render all changes correctly
- [ ] Responsive at mobile (375px), tablet (768px), and desktop (1280px)
- [ ] Adding a new post to `blog.ts` and rebuilding automatically includes it in sitemap, RSS feed, tag filter options, and related posts suggestions

## What's Next (Sprint 10 Preview)

Potential future work: analytics integration (Plausible or similar privacy-respecting option), real testimonials to replace placeholders, custom domain setup, real headshot photo replacing the avatar placeholder, blog search functionality, or a "Currently building" live status section.
