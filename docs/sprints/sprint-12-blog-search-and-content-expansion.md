# Sprint 12 — Blog Search & Content Expansion

## Overview

**Goal:** Add client-side blog search so visitors can find posts by keyword, expand the blog with 2 new posts to build out the content library, and overhaul the testimonials section so it no longer displays obvious placeholder content that undermines the site's polish.

**Rationale:** The blog has solid infrastructure (Sprints 8-11) — syntax highlighting, reading progress, TOC, copy-to-clipboard, share buttons, tag filtering, RSS, related posts. But with only 3 posts and no search, it's a showcase of features with thin content. Adding 2 more posts creates enough critical mass for the tag filter and related posts algorithm to be genuinely useful, and makes the blog feel like an active publication rather than a demo. Search is the natural next discoverability layer — tag filtering handles browsing, search handles "I know what I'm looking for." Meanwhile, the testimonials section shows three cards that all say "Testimonial coming soon." with fake names from "Acme Corp" — this is the single most visible piece of unfinished work on the site and signals to recruiters that the portfolio is incomplete. It needs to either contain real value or be removed from the page.

## What Exists

- **Blog infrastructure (Sprints 8-11):**
  - `src/data/blog.ts` — `BlogPost` interface with `slug`, `title`, `date`, `excerpt`, `tags`, `readingTime`, `content` (Markdown string). 3 posts sorted newest-first
  - `src/app/blog/page.tsx` — client component (`"use client"`) with `useState` for tag filtering. Imports `blogPosts`, `BlogCard`, `TagFilter`. Renders `h1`, intro text, `TagFilter`, and a 2-column card grid
  - `src/components/tag-filter.tsx` — client component with pill buttons, `aria-pressed`, active/inactive styling
  - `src/components/blog-card.tsx` — server component with `Link`, title, formatted date, reading time, excerpt, tag pills, hover scale effect
  - `src/components/related-posts.tsx` — server component, tag-overlap algorithm with fallback to most recent
  - `src/app/blog/layout.tsx` — wraps blog pages with `Nav` (showBlogLink) and `Footer`
  - `src/app/blog/[slug]/page.tsx` — server component with `generateStaticParams`, `generateMetadata`, JSON-LD BlogPosting, `ReadingProgress`, `TableOfContents`, `BlogPostContent`, `SharePost`, `RelatedPosts`
  - `scripts/generate-feeds.ts` — prebuild script generating `sitemap.xml` and `feed.xml` from `blogPosts` array. Runs via `prebuild` npm script. Adding new posts to `blog.ts` automatically includes them in both feeds
  - `react-markdown` ^10.1.0, `rehype-highlight` ^7.0.2 installed
- **Existing blog posts (3):**
  1. "Building an Autonomous AI Developer Agent" — 2026-03-15, tags: AI, TypeScript, Developer Tools, 7 min read
  2. "Self-Taught to Senior Engineer in 4 Years" — 2026-02-20, tags: Career, Learning, 6 min read
  3. "Specs Over Keystrokes: How AI Changes What Engineers Do" — 2026-01-10, tags: AI, Engineering, Opinion, 5 min read
- **Testimonials section:**
  - `src/data/testimonials.ts` — 3 placeholder entries: all quotes say "Testimonial coming soon.", names are "Jane Smith", "Alex Johnson", "Sarah Chen" at fake companies "Acme Corp", "Horizon Labs", "Orbit Systems"
  - `src/components/testimonials.tsx` — client component with Framer Motion, renders a 3-column card grid with decorative quote marks. Uses `Section` wrapper with `id="testimonials"`
  - Referenced in `src/app/page.tsx` as a dynamic import, positioned between `Certifications` and `LatestPosts`
- **Home page composition (`src/app/page.tsx`):** Nav → Hero → About → Experience → Projects → Skills → Certifications → Testimonials → LatestPosts → Contact → Footer → ScrollToTop
- **Nav (`src/components/nav.tsx`):** 7 home links (Home, About, Experience, Projects, Skills, Contact, Blog), 7 blog links. Scroll spy via Intersection Observer on home page sections
- **Established patterns:**
  - `Section` wrapper (`src/components/section.tsx`): `id`, `py-20 md:py-28`, `max-w-5xl`, `px-6`
  - Data files in `src/data/*.ts` with exported TypeScript interfaces and const data objects
  - CSS variable theming via `var(--color-*)` in `globals.css`
  - Framer Motion `containerVariants` / `itemVariants` with `whileInView="visible"` and `viewport={{ once: true, margin: "-100px" }}`
  - `useReducedMotion()` hook in all animated components
  - Named exports, `"use client"` only where Framer Motion or interactivity is used
  - Card styling: `rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-6` with hover `hover:border-[var(--color-accent)] hover:scale-[1.02]`
  - Tech pill styling: `rounded-full border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-1 text-xs font-medium`
  - Dynamic imports for below-fold sections in `page.tsx` using `next/dynamic` with `.then(m => ({ default: m.Name }))` pattern

## Architectural Decisions

All previous sprint architectural decisions carry forward. Additional decisions for this sprint:

### 1. Blog Search — Client-Side Text Matching, Not a Search Service
- With 5 posts, a server-side search index or third-party service (Algolia, Pagefind) is overkill. Simple client-side string matching across `title`, `excerpt`, and `tags` fields is fast and sufficient
- The search input and the tag filter coexist on the listing page — search narrows posts by keyword, tag filter narrows by category. Both are client-side `useState` that filter the same `blogPosts` array. When both are active, results must match both the search query AND the active tag
- Search matching should be case-insensitive substring matching. No fuzzy matching, no stemming — keep it simple. If the query appears anywhere in the post's title, excerpt, or tags (joined as a single string), it's a match
- Debounce the search input by ~300ms to avoid filtering on every keystroke

### 2. Testimonials → Remove Section Entirely
- The testimonials section currently displays three cards that all say "Testimonial coming soon." with obviously fake names and companies. This actively hurts the site's credibility — it signals "this is unfinished" to every visitor
- The cleanest solution is to remove the section from the page composition. The data file and component can remain in the codebase (not deleted) so they're easy to restore when real testimonials arrive, but they should not be rendered
- Removing the section also means removing the Intersection Observer reference to `#testimonials` from the scroll spy — but since the nav doesn't include a "Testimonials" link, there's no scroll spy issue. The section just needs to be removed from `page.tsx`
- The page order becomes: Hero → About → Experience → Projects → Skills → Certifications → LatestPosts → Contact → Footer. This flows better — Skills/Certifications (what Matt can do) → LatestPosts (what Matt thinks about) → Contact (how to reach Matt)

### 3. New Blog Posts — Expand Tags and Content Depth
- 2 new posts that introduce at least one new tag and cover topics not yet represented in the blog
- Post 4: a technical post about building production React Native apps (draws on the SF Mobile experience, introduces "React Native" and "Mobile" tags) — this fills a gap since Matt's mobile work is only visible in the Experience section
- Post 5: a practical post about RAG architecture and lessons learned (draws on the Athena project, introduces "Python" and "RAG" tags) — connects the Projects section to the blog and covers a hot topic in AI engineering
- Both posts follow the established copy style guide and include fenced code blocks with language annotations for syntax highlighting
- The `scripts/generate-feeds.ts` prebuild script automatically includes new posts in sitemap and RSS — no script changes needed

### 4. Search Input — Positioned Above Tag Filter
- The search input sits at the top of the blog listing page, between the intro text and the tag filter pills
- Ordering: heading → intro → search input → tag filter → card grid
- This mirrors a standard filter/search UX pattern: broad filter (search) → narrow filter (tags) → results
- The search input uses a clean, minimal design matching the site's aesthetic — `var(--color-card)` background, `var(--color-border)` border, `var(--color-muted)` placeholder text, focus ring in `var(--color-accent)`

## Tasks

### Task 1: Blog Search Component & Integration

**Objective:** Add a search input to the blog listing page that filters posts by keyword across title, excerpt, and tags — making it easy to find specific content as the blog grows.

**Files to create:**

| File | Purpose |
|------|---------|
| `src/components/blog-search.tsx` | Client component: search input with debounced text filtering |

**Files to modify:**

| File | Change |
|------|--------|
| `src/app/blog/page.tsx` | Add search state; integrate `BlogSearch` above `TagFilter`; filter posts by both search query AND active tag |

**Requirements — BlogSearch Component (`blog-search.tsx`):**
- Client component (`"use client"`)
- Props interface:
  ```
  interface BlogSearchProps {
    value: string;
    onChange: (query: string) => void;
  }
  ```
- Renders a text input with:
  - Placeholder text: "Search posts..." in `text-[var(--color-muted)]`
  - Left-aligned search icon (inline SVG magnifying glass, ~16px, `text-[var(--color-muted)]`)
  - Styling: `w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-2.5 pl-10 text-sm text-[var(--color-foreground)]` (left padding for the icon)
  - Focus: `focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]`
  - The icon and input are wrapped in a `relative` container so the icon can be positioned `absolute left-3`
- A clear button ("x" icon or text) appears inside the input when `value` is non-empty, allowing one-click clearing
- The component calls `onChange` directly — debouncing is handled in the parent (`blog/page.tsx`) where the state lives
- Accessible: `aria-label="Search blog posts"`, `type="search"` (enables native clear button in some browsers as a bonus)
- No Framer Motion — this is a simple form control

**Requirements — Blog Listing Page Update (`blog/page.tsx`):**
- Add `useState<string>("")` for `searchQuery` (the debounced value used for filtering) and a separate `useState<string>("")` for `searchInput` (the raw input value)
- Implement debouncing: use a `useEffect` with a 300ms `setTimeout` that updates `searchQuery` from `searchInput`. Clear the timeout on cleanup and when `searchInput` changes. This is a standard debounce pattern — no external library needed
- Render `<BlogSearch value={searchInput} onChange={setSearchInput} />` between the intro `<p>` and the `<TagFilter>` component. Add `mb-6` spacing between search and tag filter
- Filter logic update: the current filter is `activeTag ? blogPosts.filter(p => p.tags.includes(activeTag)) : blogPosts`. Extend this to also apply the search query:
  1. Start with `blogPosts`
  2. If `activeTag` is set, filter to posts matching the tag
  3. If `searchQuery` is non-empty, further filter to posts where `title`, `excerpt`, or any `tag` contains the query (case-insensitive)
  4. The search matches against a concatenated string: `\`${post.title} ${post.excerpt} ${post.tags.join(" ")}\`.toLowerCase().includes(searchQuery.toLowerCase())`
- The "No posts found" message should reflect both filters: "No posts found." (generic, covers both search and tag miss cases)
- When the search query changes, do NOT reset the active tag — they are independent filters. The user can search within a tag or across all posts

**Acceptance Criteria:**
- Blog listing page shows a search input above the tag filter pills
- Typing in the search input filters posts after a ~300ms debounce
- Search matches against post title, excerpt, and tags (case-insensitive)
- Search and tag filter work together — results must match both
- Clearing the search input shows all posts (respecting active tag if set)
- The search input has a clear button when non-empty
- Both light and dark themes render the input correctly
- `pnpm build` succeeds with zero TS errors and zero ESLint warnings

---

### Task 2: New Blog Posts

**Objective:** Add 2 new blog posts expanding the content library into React Native mobile development and RAG architecture — both topics where Matt has real production experience.

**Files to modify:**

| File | Change |
|------|--------|
| `src/data/blog.ts` | Add 2 new `BlogPost` entries to the `blogPosts` array |

**Requirements — Post 4: "Shipping a Cross-Platform Fintech App with React Native":**
- `slug`: `"shipping-cross-platform-fintech-react-native"`
- `title`: `"Shipping a Cross-Platform Fintech App with React Native"`
- `date`: `"2026-03-01"`
- `excerpt`: `"Lessons from building SF Mobile — a cross-platform wealth management app with biometric auth, real-time portfolios, and 4-language localisation."`
- `tags`: `["React Native", "TypeScript", "Mobile"]`
- `readingTime`: `"6 min read"`
- Content direction (400-600 words, Markdown with 2-3 fenced code blocks):
  - Open with the challenge: building a production fintech app for iOS and Android from scratch as lead engineer. Wealth management clients expect banking-grade polish
  - Section on auth complexity: MFA with email OTP, phone OTP, and biometric (Face ID / Touch ID). Mention the device recognition layer and JWT session management with platform-specific secure credential storage. Include a TypeScript code block showing the auth flow type structure or the biometric check pattern
  - Section on React Native architecture decisions: Expo + EAS Build for deployment pipeline, TanStack Query for server state, Kubb for OpenAPI code generation. Include a code block showing the query setup or the code generation config
  - Section on testing strategy: Jest + RNTL for unit tests (52 files), Maestro for E2E (5 flows per platform). Why Maestro over Detox. Include a brief code block showing a Maestro test flow (YAML format)
  - Close with what made it work: treating mobile like a real engineering project (CI/CD, automated testing, typed APIs) rather than a "frontend side project"
  - Tone: practical, specific, draws on real SF Mobile experience from the product spec

**Requirements — Post 5: "Building a RAG Pipeline That Actually Works":**
- `slug`: `"building-rag-pipeline-that-works"`
- `title`: `"Building a RAG Pipeline That Actually Works"`
- `date`: `"2026-02-05"`
- `excerpt`: `"What I learned building Athena — a personal AI assistant with ChromaDB vector search and Claude. The gap between RAG tutorials and production RAG is wide."`
- `tags`: `["AI", "Python", "RAG"]`
- `readingTime`: `"6 min read"`
- Content direction (400-600 words, Markdown with 2-3 fenced code blocks):
  - Open with the problem: personal knowledge scattered across files and notes, wanted semantic search not just keyword matching. Built Athena to solve it
  - Section on the RAG architecture: document ingestion → chunking → embedding → ChromaDB vector store → retrieval → Claude API for synthesis. Include a Python code block showing the retrieval + synthesis flow (the query function that hits ChromaDB and passes results to Claude)
  - Section on chunking strategy: why naive chunking fails (cuts mid-sentence, loses context), what actually works (overlap windows, metadata preservation). Include a Python code block showing a chunking function
  - Section on the gap between tutorials and reality: embedding drift, stale documents, relevance scoring thresholds, when to retrieve vs. when the LLM already knows. Honest about what's hard
  - Close with practical takeaways: start simple, measure retrieval quality before optimising generation, ChromaDB is fine for personal scale
  - Tone: technical but accessible, written for engineers curious about RAG who haven't built one yet. Draws on real Athena experience

**Requirements — General:**
- Insert new posts into the `blogPosts` array in date order (newest first). The array order after insertion should be: Post 1 (Mar 15), Post 4 (Mar 1), Post 2 (Feb 20), Post 5 (Feb 5), Post 3 (Jan 10)
- All code blocks must use language annotations (`` ```typescript ``, `` ```python ``, `` ```yaml ``) for syntax highlighting
- Code examples should be 5-15 lines — illustrative, not exhaustive
- Content must follow the established copy style guide: direct, confident, no buzzwords. First person where it fits. "Here's what I built and why" tone
- The prebuild script (`scripts/generate-feeds.ts`) will automatically include new posts in the sitemap and RSS feed — no changes needed to the script

**Acceptance Criteria:**
- `blogPosts` array contains 5 entries sorted newest-first by date
- Post 4 has 2-3 fenced code blocks (TypeScript and YAML)
- Post 5 has 2-3 fenced code blocks (Python)
- New tags introduced: "React Native", "Mobile", "Python", "RAG"
- Content is real, substantive (400-600 words each), and follows the copy style guide
- Slugs are URL-safe
- After `pnpm build`, the sitemap contains 7 URLs (home, /blog, 5 individual posts) and the RSS feed contains 5 items
- `pnpm build` succeeds with zero TS errors

---

### Task 3: Remove Testimonials Placeholder Section

**Objective:** Remove the testimonials section from the rendered page to eliminate the most visible piece of unfinished work on the site. Keep the component and data files in the codebase for future restoration.

**Files to modify:**

| File | Change |
|------|--------|
| `src/app/page.tsx` | Remove `Testimonials` dynamic import and remove `<Testimonials />` from the JSX |

**Requirements:**
- Remove the `Testimonials` dynamic import line from the top of `page.tsx`
- Remove `<Testimonials />` from the JSX composition
- Do NOT delete `src/components/testimonials.tsx` or `src/data/testimonials.ts` — these files should remain in the codebase so they can be restored when real testimonials are available
- The page section order becomes: Hero → About → Experience → Projects → Skills → Certifications → LatestPosts → Contact
- Verify that removing the section does not break the scroll spy in `nav.tsx` — it should not, since there is no "Testimonials" nav link in the `homeNavLinks` or `blogNavLinks` arrays. The Intersection Observer only watches section IDs that correspond to nav link entries
- No changes to `nav.tsx` — the nav has no testimonials link to remove

**Acceptance Criteria:**
- The testimonials section ("What People Say" with 3 "coming soon" cards) no longer renders on the home page
- `src/components/testimonials.tsx` and `src/data/testimonials.ts` still exist in the codebase (not deleted)
- No scroll spy errors or broken navigation
- The page flows naturally: Certifications → LatestPosts → Contact
- `pnpm build` succeeds with zero TS errors and zero ESLint warnings

---

### Task 4: Latest Posts Section Update

**Objective:** Update the "Latest Writing" section on the home page to show 3 posts instead of 2, now that there are 5 posts in the blog — giving visitors a better preview of the content range.

**Files to modify:**

| File | Change |
|------|--------|
| `src/components/latest-posts.tsx` | Change from showing 2 posts to showing 3 posts; update grid to support 3 columns |

**Requirements:**
- Change the slice from `blogPosts.slice(0, 2)` to `blogPosts.slice(0, 3)` (or equivalent — read the file to confirm the current slicing logic)
- Update the grid to support 3 columns on large screens: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` — matching the project cards grid pattern
- This gives the latest posts section the same visual weight as the projects section, and shows posts spanning 3 different topic areas (AI agent development, React Native, and career journey)
- No other changes to the component — the Framer Motion animation, "View All Posts →" link, and Section wrapper remain as-is

**Acceptance Criteria:**
- "Latest Writing" section shows 3 blog post cards instead of 2
- Grid layout: 1 column mobile, 2 columns md, 3 columns lg — matching the projects section
- Cards display correctly at all breakpoints without overflow
- The 3 most recent posts are shown (Ralph post, React Native post, Self-Taught post — based on date ordering)
- `pnpm build` succeeds with zero TS errors

---

### Task 5: Build Verification & Integration Test

**Objective:** Verify the complete site builds cleanly with all Sprint 12 changes, confirm search works end-to-end, and ensure the testimonials removal causes no regressions.

**Files to modify:** None expected — this is a verification task. Fix issues in relevant files if found.

**Requirements — Build Verification Checklist:**

The builder must verify all of the following after completing Tasks 1-4:

- [ ] `pnpm build` exits 0 with zero TypeScript errors and zero ESLint warnings
- [ ] `out/` directory contains all expected files: `index.html`, `404.html`, `sitemap.xml`, `feed.xml`, `og-image.png`, `robots.txt`, `.nojekyll`, `favicon.ico`, `matt-wilson-resume.pdf`, `blog/index.html`, and `blog/*/index.html` for all 5 posts
- [ ] Blog listing page shows search input above tag filter
- [ ] Typing a search query filters posts by keyword match across title, excerpt, and tags
- [ ] Search and tag filter work together — selecting a tag and typing a query returns the intersection
- [ ] Clearing search shows all posts (respecting active tag)
- [ ] 5 blog posts render with syntax-highlighted code blocks (including 2 new posts)
- [ ] New tags ("React Native", "Mobile", "Python", "RAG") appear in the tag filter pills on the blog listing page
- [ ] Tag filtering works correctly with the new tags — clicking "React Native" shows only Post 4, clicking "RAG" shows only Post 5
- [ ] Related posts on new post pages suggest relevant posts based on tag overlap
- [ ] `sitemap.xml` contains 7 URLs: home, /blog, and 5 individual post URLs
- [ ] `feed.xml` contains 5 `<item>` entries with correct titles, links, and dates
- [ ] Testimonials section no longer renders on the home page
- [ ] Page section order: Hero → About → Experience → Projects → Skills → Certifications → Latest Writing → Contact → Footer
- [ ] "Latest Writing" section shows 3 post cards in a responsive grid
- [ ] All existing features still work: shimmer animation, availability badge, nav scroll spy, theme toggle, mobile hamburger, reading progress, TOC, code copy, share buttons, RSS autodiscovery
- [ ] Both light and dark themes render correctly across all pages
- [ ] Responsive at mobile (375px), tablet (768px), and desktop (1280px)

**Acceptance Criteria:**
- All verification checklist items pass
- No regressions to existing functionality
- The site remains production-ready

## Implementation Order

1. **Task 2** — New blog posts (independent — creates the content that makes search more useful and expands tag coverage)
2. **Task 1** — Blog search (independent of Task 2 but benefits from having more posts to search across)
3. **Task 3** — Remove testimonials (independent — single line changes in `page.tsx`)
4. **Task 4** — Latest posts update (depends on Task 2 for having 5 posts to display)
5. **Task 5** — Build verification (depends on Tasks 1-4 completing)

Tasks 1, 2, and 3 are fully independent and can be built in parallel. Task 4 depends on Task 2 (needs 5 posts). Task 5 is the final integration check.

## File Count

| Task | New Files | Modified Files | Total New |
|------|-----------|----------------|-----------|
| Task 1 | 1 | 1 | 1 |
| Task 2 | 0 | 1 | 1 |
| Task 3 | 0 | 1 | 1 |
| Task 4 | 0 | 1 | 1 |
| Task 5 | 0 | 0 | 1 |

**1 new file, 4 modified files (each modified by exactly one task — no conflicts).** Well within the 15-file limit.

**New files:**
1. `src/components/blog-search.tsx`

**Modified files:**
1. `src/app/blog/page.tsx` (Task 1 — add search state, integrate BlogSearch, combine filters)
2. `src/data/blog.ts` (Task 2 — add 2 new blog posts)
3. `src/app/page.tsx` (Task 3 — remove Testimonials import and render)
4. `src/components/latest-posts.tsx` (Task 4 — show 3 posts, update grid)

**Unique files touched:** 5 total (1 new + 4 modified). Lean sprint.

## Definition of Done

- [ ] `pnpm install && pnpm build` exits 0 with zero TS errors and zero ESLint warnings
- [ ] Blog search input renders on `/blog` listing page above tag filter
- [ ] Search filters posts by case-insensitive keyword match across title, excerpt, and tags
- [ ] Search is debounced (~300ms) — no filtering on every keystroke
- [ ] Search and tag filter compose together — results match both criteria
- [ ] Clear button on search input resets to show all posts
- [ ] `blogPosts` array contains 5 entries sorted newest-first by date
- [ ] New post 4 ("Shipping a Cross-Platform Fintech App with React Native") has 2-3 code blocks, tags: React Native, TypeScript, Mobile
- [ ] New post 5 ("Building a RAG Pipeline That Actually Works") has 2-3 code blocks, tags: AI, Python, RAG
- [ ] All 5 posts render correctly with syntax highlighting, TOC, reading progress, share buttons, related posts
- [ ] New tags (React Native, Mobile, Python, RAG) appear in the tag filter and work correctly
- [ ] `sitemap.xml` contains 7 URLs; `feed.xml` contains 5 items
- [ ] Testimonials section removed from home page render (component/data files retained)
- [ ] Page section order: Hero → About → Experience → Projects → Skills → Certifications → Latest Writing → Contact
- [ ] "Latest Writing" shows 3 post cards in 1/2/3 column responsive grid
- [ ] Blog post content follows the copy style guide: direct, confident, no buzzwords
- [ ] Both light and dark themes render correctly across all pages
- [ ] Responsive at mobile (375px), tablet (768px), and desktop (1280px)
- [ ] No regressions to existing features (nav, theme, shimmer, scroll spy, code copy, RSS)
- [ ] Static export generates all expected files in `out/`

## What's Next (Sprint 13 Preview)

Potential future work: custom domain setup, real headshot photo replacing the avatar placeholder, real testimonials to restore the section with genuine quotes, a "Currently building" live status section, blog post pagination (as post count grows), or additional blog posts continuing to expand the content library.
