# Sprint 16 — Per-Post OG Images & Keyboard Navigation

## Overview

**Goal:** Generate unique OG images for each blog post and tag page at build time so shared links look compelling on LinkedIn/Slack/Twitter, add keyboard shortcuts for power-user blog navigation, and improve the blog listing UX with result counts and a clear-all-filters action.

**Rationale:** When any blog post is shared on LinkedIn or Slack, the preview card shows the same generic "Matt Wilson — Senior Full Stack & AI Engineer" OG image with the MW monogram. There's no visual distinction between sharing the Docker post vs. the RAG post vs. the home page — they all look identical. For a site with 8 blog posts and 14 tag pages, this is a significant missed opportunity. Per-post OG images with the post title create visually distinct, compelling share previews that increase click-through rates. The existing `scripts/generate-assets.ts` already has a zero-dependency Canvas class with a bitmap font renderer that produces PNGs — the infrastructure exists, it just needs to be applied to blog content. Beyond sharing, the blog has no keyboard navigation — developers expect `j`/`k` for next/previous, `/` to focus search, and `Escape` to clear. These are small touches that signal the site was built by someone who cares about UX. Finally, the blog listing page gives no feedback about how many results match the current filter/search combination, and there's no one-click way to clear all filters — both are standard listing page UX that should exist.

## What Exists

- **OG image infrastructure:**
  - `scripts/generate-assets.ts` — custom `Canvas` class with `encodePNG()`, 5x7 bitmap `FONT`, `drawText()`, `textWidth()`, `rect()`, `circle()`, `fill()`, and `toPNG()` methods. Generates headshot, favicons, and the site-wide OG image (`generateOGImage()` at 1200x630). Uses `zlib.deflateSync` for PNG compression — zero external dependencies
  - `public/og-image.png` — site-wide OG image (1200x630, dark background, MW monogram, name, title, accent bars)
  - No per-post or per-tag OG images exist
- **Blog post metadata (`blog/[slug]/page.tsx`):**
  - `generateMetadata` returns `openGraph: { title, description, type: "article", publishedTime }` — **no `images` field**, so all blog posts fall back to the site-wide OG image from `layout.tsx`
- **Blog tag page metadata (`blog/tag/[tag]/page.tsx`):**
  - `generateMetadata` returns `openGraph: { title, description }` — **no `images` field**, same fallback behaviour
- **Prebuild pipeline:**
  - `package.json` has `"prebuild": "tsx scripts/generate-feeds.ts"` — runs before `pnpm build`
  - `scripts/generate-feeds.ts` — generates `sitemap.xml` and `feed.xml` from `blogPosts` data
  - `scripts/generate-assets.ts` — run manually (`npx tsx scripts/generate-assets.ts`), not part of the build pipeline. Output files are committed to `public/`
- **Blog listing page (`src/app/blog/page.tsx`):**
  - Client component with `useState` for `activeTag`, `searchInput`, `searchQuery` (debounced)
  - Renders `BlogSearch` → `TagFilter` → card grid
  - "No posts found." message when results are empty — **no result count when results exist**
  - No way to clear both search and tag filter simultaneously
  - No keyboard shortcuts
- **Blog post page (`src/app/blog/[slug]/page.tsx`):**
  - `PostNavigation` component at the bottom for previous/next — **no keyboard shortcut** to navigate
  - No keyboard shortcut to go back to the blog listing
- **Blog data (`src/data/blog.ts`):**
  - 8 posts with slugs, titles, dates, tags, content
  - 14 unique tags across all posts
- **Established patterns:**
  - `Section` wrapper (`src/components/section.tsx`): `id`, `py-20 md:py-28`, `max-w-5xl`, `px-6`
  - CSS variable theming via `var(--color-*)` in `globals.css`
  - `"use client"` only where interactivity is needed
  - Named exports from components
  - Dynamic imports for below-fold sections in `page.tsx`
  - `scripts/generate-feeds.ts` imports `blogPosts` and writes to `public/`

## Architectural Decisions

All previous sprint architectural decisions carry forward. Additional decisions for this sprint:

### 1. Per-Post OG Images Generated at Build Time via Prebuild Script
- Extend the prebuild pipeline to generate a unique OG image for each blog post and each tag page
- Create a new `scripts/generate-og-images.ts` script that imports the Canvas/PNG/font infrastructure from `generate-assets.ts` and the `blogPosts` array from `src/data/blog.ts`
- The script runs as part of `prebuild` (chain both scripts) so adding a new blog post automatically generates its OG image on the next build
- Images are written to `public/og/blog/{slug}.png` and `public/og/blog/tag/{tag}.png` — organised in a subdirectory to avoid polluting the `public/` root
- Each image is 1200x630px (standard OG dimensions) with the post title as prominent text on the dark background, matching the site-wide OG image's visual style (accent bars, dark bg, muted URL)
- To share the Canvas infrastructure, refactor `generate-assets.ts` to export the `Canvas` class, `encodePNG` function, and `FONT` object — then import them in the new script. The asset generation functions (`generateHeadshot`, `generateOGImage`, etc.) remain in `generate-assets.ts` and only run when that script is invoked directly

### 2. Keyboard Navigation — Global Listener on Blog Pages Only
- A `KeyboardNav` client component that attaches a `keydown` listener to `document`
- Only rendered on blog pages (listing page and post pages) — NOT on the home page, resume, or uses pages
- Shortcuts are disabled when the user is typing in an input/textarea (check `document.activeElement.tagName`)
- This is a progressive enhancement — all shortcuts have mouse/touch equivalents. No UI indicating shortcuts exist (keep it clean). A power user who tries `j`/`k` will discover they work; no one else is impacted

### 3. Blog Listing Result Count — Inline, Not Intrusive
- Show a small muted result count below the tag filter when filters are active: "Showing 3 of 8 posts" or just "3 posts"
- When no filters are active (showing all posts), show the total: "8 posts"
- This is a single line of text in the existing listing page — no new component needed, just a conditional `<p>` element

## Tasks

### Task 1: Canvas Infrastructure Refactor & OG Image Generation Script

**Objective:** Make the Canvas/PNG/font infrastructure from `generate-assets.ts` importable, then create a new script that generates unique OG images for each blog post and tag page at build time.

**Files to create:**

| File | Purpose |
|------|---------|
| `scripts/canvas.ts` | Shared Canvas class, PNG encoder, and bitmap font — extracted from `generate-assets.ts` |
| `scripts/generate-og-images.ts` | Build script that generates per-post and per-tag OG images |

**Files to modify:**

| File | Change |
|------|--------|
| `scripts/generate-assets.ts` | Import Canvas/font from `canvas.ts` instead of defining inline |
| `package.json` | Update `prebuild` to run both feed generation and OG image generation |

**Requirements — Canvas Extraction (`scripts/canvas.ts`):**
- Move the following from `generate-assets.ts` into `canvas.ts` as named exports:
  - The `CRC_TABLE` constant and `crc32` function
  - The `chunk` function
  - The `encodePNG` function
  - The `Canvas` class (with all methods: `fill`, `setPixel`, `rect`, `circle`, `drawGlyph`, `drawText`, `textWidth`, `toPNG`)
  - The `FONT` record (the complete 5x7 bitmap font)
  - The colour constants: `ACCENT`, `WHITE`, `DARK`, `MUTED`
- Everything should be exported as named exports
- No side effects in this file — it's a pure utility module

**Requirements — Asset Script Update (`generate-assets.ts`):**
- Replace all inline definitions of Canvas, font, colours, and PNG encoding with imports from `./canvas`
- The script's behaviour is unchanged — it still generates headshot, favicons, OG image, and manifest when run directly
- Verify `npx tsx scripts/generate-assets.ts` still works correctly after the refactor

**Requirements — OG Image Generation Script (`generate-og-images.ts`):**
- Import `Canvas`, `FONT`, `ACCENT`, `WHITE`, `DARK`, `MUTED` from `./canvas`
- Import `blogPosts` from `../src/data/blog`
- Import `writeFileSync`, `mkdirSync`, `existsSync` from `fs` and `join` from `path`

**Per-post OG image generation:**
- For each post in `blogPosts`, generate a 1200x630 PNG at `public/og/blog/{slug}.png`
- Image design (matching the site-wide OG image style):
  - Dark background (`DARK` / `#0a0a0a`)
  - Blue accent bar at top (6px height) and bottom (6px height)
  - Post title as the primary text — large, white, centred. If the title is long, the builder should implement word wrapping (split on spaces, render multiple lines). Max width ~1000px with padding
  - "Matt Wilson" in muted text below the title — smaller, positioned as an author attribution
  - The site URL `mattwilson02.github.io` in small muted text near the bottom
  - A horizontal accent-coloured separator line between the title area and the author/URL area
- Create the `public/og/blog/` directory if it doesn't exist (`mkdirSync` with `recursive: true`)

**Per-tag OG image generation:**
- Extract unique tags from `blogPosts`
- For each tag, generate a 1200x630 PNG at `public/og/blog/tag/{encoded-tag}.png`
- Image design:
  - Same dark background and accent bars as post images
  - Tag name as the primary text — large, white, centred
  - "Blog — Matt Wilson" in muted text below
  - Post count for that tag in small muted text: e.g. "3 posts"
  - Same separator and URL as post images
- Use `encodeURIComponent(tag)` for the filename to handle tags with spaces (e.g. "React Native" → `React%20Native.png`)
- Create the `public/og/blog/tag/` directory if it doesn't exist

**Requirements — Package.json Prebuild Update:**
- Update the `prebuild` script to run both feed generation and OG image generation:
  - `"prebuild": "tsx scripts/generate-feeds.ts && tsx scripts/generate-og-images.ts"`
- This ensures OG images are always regenerated when the blog content changes
- Add the `generate-og-images` script for manual runs: `"generate-og-images": "tsx scripts/generate-og-images.ts"`

**Acceptance Criteria:**
- Running `pnpm generate-og-images` creates PNG files in `public/og/blog/` for all 8 posts and in `public/og/blog/tag/` for all 14 tags
- Each generated PNG is 1200x630 pixels and a valid image
- Post OG images show the post title prominently with author attribution
- Tag OG images show the tag name with post count
- `npx tsx scripts/generate-assets.ts` still works correctly after the Canvas extraction
- `pnpm build` automatically generates OG images via the `prebuild` chain
- Adding a new post to `blog.ts` and rebuilding generates its OG image automatically
- `pnpm build` exits 0 with zero TS errors and zero ESLint warnings

---

### Task 2: Per-Post & Per-Tag OG Image Metadata Integration

**Objective:** Update blog post and tag page metadata to reference their unique OG images, so shared links on LinkedIn/Slack/Twitter show the post-specific preview instead of the generic site-wide image.

**Files to modify:**

| File | Change |
|------|--------|
| `src/app/blog/[slug]/page.tsx` | Add `images` to `openGraph` in `generateMetadata` |
| `src/app/blog/tag/[tag]/page.tsx` | Add `images` to `openGraph` in `generateMetadata` |
| `scripts/generate-feeds.ts` | Add `public/og/` directory contents to `.gitignore` consideration (or document that generated files are committed) |

**Requirements — Blog Post Metadata Update (`blog/[slug]/page.tsx`):**
- In the `generateMetadata` function, add `images` to the `openGraph` return:
  ```
  openGraph: {
    title: post.title,
    description: post.excerpt,
    type: "article",
    publishedTime: post.date,
    images: [
      {
        url: `/og/blog/${post.slug}.png`,
        width: 1200,
        height: 630,
        alt: post.title,
      },
    ],
  },
  ```
- Also add Twitter card metadata to ensure Twitter/X uses the post-specific image:
  ```
  twitter: {
    card: "summary_large_image",
    title: post.title,
    description: post.excerpt,
    images: [`/og/blog/${post.slug}.png`],
  },
  ```
- No other changes to the page component

**Requirements — Tag Page Metadata Update (`blog/tag/[tag]/page.tsx`):**
- In the `generateMetadata` function, add `images` to the `openGraph` return:
  ```
  openGraph: {
    title: `${decodedTag} — Blog — Matt Wilson`,
    description: `Blog posts about ${decodedTag} by Matt Wilson.`,
    images: [
      {
        url: `/og/blog/tag/${encodeURIComponent(decodedTag)}.png`,
        width: 1200,
        height: 630,
        alt: `Posts tagged "${decodedTag}"`,
      },
    ],
  },
  ```
- Add matching Twitter card metadata

**Requirements — Sitemap Update (`scripts/generate-feeds.ts`):**
- No changes to the sitemap logic itself — OG images are not sitemapped (they're referenced only via meta tags)
- However, the generated OG images in `public/og/` will be included in the static export `out/og/`. This is correct behaviour — the images need to be served

**Acceptance Criteria:**
- HTML source of each blog post page contains `<meta property="og:image" content=".../{slug}.png">` pointing to the post-specific image
- HTML source of each tag page contains `<meta property="og:image" content=".../{tag}.png">` pointing to the tag-specific image
- Twitter card meta tags reference the post-specific images
- The generic site-wide OG image (`/og-image.png`) is still used by the home page, blog listing, uses, and resume pages (unchanged)
- When sharing a blog post URL on LinkedIn/Slack (or using an OG debugger tool), the preview shows the post title on a dark background — not the generic MW monogram
- `pnpm build` succeeds with zero TS errors and zero ESLint warnings

---

### Task 3: Keyboard Navigation for Blog

**Objective:** Add keyboard shortcuts for power-user blog navigation — `j`/`k` for next/previous post, `/` to focus the search input, `Escape` to clear search and close mobile TOC, and `b` to go back to the blog listing from a post page.

**Files to create:**

| File | Purpose |
|------|---------|
| `src/components/keyboard-nav.tsx` | Client component: global keyboard shortcut listener for blog pages |

**Files to modify:**

| File | Change |
|------|--------|
| `src/app/blog/page.tsx` | Add `<KeyboardNav>` component; pass search clear callback |
| `src/app/blog/[slug]/page.tsx` | Add `<KeyboardNav>` component with post navigation context |

**Requirements — KeyboardNav Component (`keyboard-nav.tsx`):**
- Client component (`"use client"`)
- Props interface:
  ```
  interface KeyboardNavProps {
    context: "listing" | "post";
    // For listing context:
    onFocusSearch?: () => void;
    onClearFilters?: () => void;
    // For post context:
    previousSlug?: string;
    nextSlug?: string;
  }
  ```
- Attaches a `keydown` event listener to `document` via `useEffect`
- **Guard clause:** Ignore all shortcuts when the active element is an `<input>`, `<textarea>`, `<select>`, or has `contenteditable="true"`. Check `document.activeElement?.tagName` and `document.activeElement?.getAttribute("contenteditable")`
- Exception: the `Escape` key should work even when focused in an input — it clears the search input and blurs it

**Shortcuts — Listing context (`context: "listing"`):**
- `/` — Prevent default (stops the browser's "quick find" in Firefox), call `onFocusSearch()` which focuses the search input
- `Escape` — Call `onClearFilters()` which clears the search input and resets the tag filter. If the search input is focused, also blur it

**Shortcuts — Post context (`context: "post"`):**
- `j` — Navigate to the next (newer) post if `nextSlug` is provided. Use `window.location.href = /blog/${nextSlug}` or Next.js `router.push`. The builder should use `useRouter` from `next/navigation` for client-side navigation
- `k` — Navigate to the previous (older) post if `previousSlug` is provided
- `b` — Navigate back to the blog listing: `router.push("/blog")`
- `Escape` — Navigate back to the blog listing (same as `b`)

**Implementation notes:**
- Import `useRouter` from `next/navigation` for the post context navigation
- The component renders `null` — it has no visual output, only side effects
- Clean up the event listener in the `useEffect` return
- The `previousSlug` and `nextSlug` props follow the same logic as `PostNavigation` — the builder should import `blogPosts` and compute adjacent posts, OR the parent page should compute and pass them

**Requirements — Blog Listing Page Update (`blog/page.tsx`):**
- Import `KeyboardNav` and render it inside the component (anywhere — it renders `null`)
- Pass `context="listing"`, `onFocusSearch` as a callback that focuses the search input (the `BlogSearch` component needs a `ref` or the listing page needs a `ref` to the input — the builder should use `useRef` and pass a `ref` prop to `BlogSearch`, or use `document.querySelector` as a simpler approach)
- Pass `onClearFilters` as a callback that resets both `setSearchInput("")` and `setActiveTag(null)`

**Requirements — Blog Post Page Update (`blog/[slug]/page.tsx`):**
- The blog post page is a server component. `KeyboardNav` is a client component. Render it as a client child
- Compute the previous and next slugs from `blogPosts` (same logic as `PostNavigation`) and pass them as props
- Pass `context="post"`, `previousSlug`, `nextSlug`

**Acceptance Criteria:**
- On the blog listing page:
  - Pressing `/` focuses the search input
  - Pressing `Escape` clears the search input and active tag filter
  - Shortcuts don't fire when typing in the search input (except `Escape`)
- On blog post pages:
  - Pressing `j` navigates to the next (newer) post
  - Pressing `k` navigates to the previous (older) post
  - Pressing `b` or `Escape` navigates to the blog listing
  - On the newest post, `j` does nothing. On the oldest, `k` does nothing
- All shortcuts are ignored when focused in form inputs (except `Escape`)
- No visual UI for shortcuts — they're discoverable by use, not by instruction
- `pnpm build` succeeds with zero TS errors and zero ESLint warnings

---

### Task 4: Blog Listing UX Improvements

**Objective:** Add a result count indicator and a clear-all-filters action to the blog listing page, giving users feedback about their current filter state and a quick way to reset.

**Files to modify:**

| File | Change |
|------|--------|
| `src/app/blog/page.tsx` | Add result count text; add "Clear filters" link when filters are active |

**Requirements — Result Count:**
- Add a small text indicator between the tag filter and the card grid (or between the tag filter and the search, if it reads better — builder's discretion)
- When no filters are active: show total count — `"8 posts"` in `text-sm text-[var(--color-muted)]`
- When filters are active (search query or active tag): show filtered count — `"Showing 3 of 8 posts"` in the same styling
- The count should update reactively as the user types in search or selects tags
- Use `blogPosts.length` for the total and `filtered.length` for the current count

**Requirements — Clear Filters Action:**
- When either the search query or active tag is set (i.e. any filter is active), show a small "Clear filters" button/link next to the result count
- Styling: `text-sm text-[var(--color-accent)] cursor-pointer hover:underline` — a subtle text action, not a prominent button
- Clicking it resets `searchInput` to `""` and `activeTag` to `null` — same as the `Escape` keyboard shortcut
- When no filters are active, the "Clear filters" action is not rendered
- Layout: the result count and "Clear filters" link sit on the same line, with `flex items-center justify-between` or `flex items-center gap-4`

**Requirements — Search Input Enhancement:**
- Add a `ref` forwarding mechanism to `BlogSearch` so the keyboard navigation can focus it programmatically
- The simplest approach: use `useRef<HTMLInputElement>(null)` in the listing page and pass it to `BlogSearch`. The `BlogSearch` component should accept an optional `inputRef` prop (or use `React.forwardRef`) and attach it to the `<input>` element
- This enables the `/` keyboard shortcut from Task 3 to focus the search input

**Acceptance Criteria:**
- Blog listing page shows post count: "8 posts" when unfiltered, "Showing N of 8 posts" when filtered
- "Clear filters" link appears only when filters are active
- Clicking "Clear filters" resets both search and tag filter
- Result count updates in real-time as the user types or selects tags
- The search input can be focused programmatically via a ref (for keyboard nav integration)
- Both light and dark themes render the count and clear link correctly
- `pnpm build` succeeds with zero TS errors and zero ESLint warnings

---

### Task 5: Build Verification & Integration

**Objective:** Verify the complete site builds cleanly with all Sprint 16 changes, confirm OG images are generated and referenced correctly, keyboard navigation works end-to-end, and ensure no regressions.

**Files to modify:** None expected — this is a verification task. Fix issues in relevant files if found.

**Requirements — Build Verification Checklist:**

The builder must verify all of the following after completing Tasks 1-4:

- [ ] `pnpm build` exits 0 with zero TypeScript errors and zero ESLint warnings
- [ ] `prebuild` script runs both `generate-feeds.ts` and `generate-og-images.ts` before build
- [ ] `public/og/blog/` directory contains 8 PNG files (one per blog post slug)
- [ ] `public/og/blog/tag/` directory contains 14 PNG files (one per unique tag)
- [ ] All generated OG images are valid PNGs at 1200x630 dimensions
- [ ] Post OG images display the post title prominently on a dark background
- [ ] Tag OG images display the tag name with post count
- [ ] Blog post HTML source contains `<meta property="og:image">` pointing to the post-specific image (not the site-wide image)
- [ ] Tag page HTML source contains `<meta property="og:image">` pointing to the tag-specific image
- [ ] Twitter card meta tags on blog posts reference post-specific images
- [ ] Home page, blog listing, uses, and resume pages still use the site-wide OG image (unchanged)
- [ ] `npx tsx scripts/generate-assets.ts` still works correctly after Canvas extraction
- [ ] Keyboard shortcuts on blog listing: `/` focuses search, `Escape` clears filters
- [ ] Keyboard shortcuts on blog posts: `j`/`k` navigate between posts, `b`/`Escape` go to listing
- [ ] Shortcuts are disabled when typing in input fields (except `Escape`)
- [ ] Blog listing shows result count ("8 posts" or "Showing N of 8 posts")
- [ ] "Clear filters" link appears when filters are active and resets all filters when clicked
- [ ] `out/` directory contains all expected files from previous sprints plus `og/blog/*.png` and `og/blog/tag/*.png`
- [ ] All existing features still work: shimmer animation, availability badge, nav scroll spy, theme toggle, mobile hamburger, blog search, tag filter, code copy, reading progress, TOC, share buttons, related posts, post navigation, breadcrumbs, RSS autodiscovery, syntax highlighting, analytics, print styles
- [ ] Both light and dark themes render all changes correctly
- [ ] Responsive at mobile (375px), tablet (768px), and desktop (1280px)

**Acceptance Criteria:**
- All verification checklist items pass
- No regressions to existing functionality
- The site remains production-ready

## Implementation Order

1. **Task 1** — Canvas refactor & OG image generation (foundational — creates the images that Task 2 references)
2. **Task 2** — Metadata integration (depends on Task 1 — needs OG images to exist at the referenced paths)
3. **Task 4** — Blog listing UX improvements (independent of Tasks 1-2 — can be built in parallel, and creates the `ref`/callback infrastructure that Task 3 needs)
4. **Task 3** — Keyboard navigation (depends on Task 4 for the search input ref and clear filters callback)
5. **Task 5** — Build verification (depends on Tasks 1-4 completing)

Tasks 1 and 4 are independent and can be built in parallel. Task 2 depends on Task 1. Task 3 depends on Task 4 (for the ref/callback plumbing). Task 5 is the final integration check.

## File Count

| Task | New Files | Modified Files | Total New |
|------|-----------|----------------|-----------|
| Task 1 | 2 | 2 | 2 |
| Task 2 | 0 | 2 | 2 |
| Task 3 | 1 | 2 | 3 |
| Task 4 | 0 | 1 | 3 |
| Task 5 | 0 | 0 | 3 |

**3 new files, 7 modified files (some across multiple tasks).** Well within the 15-file limit.

**New files:**
1. `scripts/canvas.ts` — shared Canvas/PNG/font utilities
2. `scripts/generate-og-images.ts` — per-post and per-tag OG image generation
3. `src/components/keyboard-nav.tsx` — keyboard shortcut listener

**Modified files:**
1. `scripts/generate-assets.ts` (Task 1 — import from canvas.ts instead of inline definitions)
2. `package.json` (Task 1 — update prebuild script, add generate-og-images script)
3. `src/app/blog/[slug]/page.tsx` (Tasks 2, 3 — OG image metadata + keyboard nav)
4. `src/app/blog/tag/[tag]/page.tsx` (Task 2 — OG image metadata)
5. `src/app/blog/page.tsx` (Tasks 3, 4 — keyboard nav + result count + clear filters)
6. `src/components/blog-search.tsx` (Task 4 — accept ref for programmatic focus, if needed)

**Unique files touched:** 9 total (3 new + 6 modified). Lean sprint.

## Definition of Done

- [ ] `pnpm install && pnpm build` exits 0 with zero TS errors and zero ESLint warnings
- [ ] `prebuild` generates OG images for all 8 posts and 14 tags alongside sitemap and RSS
- [ ] `public/og/blog/{slug}.png` exists for each blog post at 1200x630px
- [ ] `public/og/blog/tag/{tag}.png` exists for each unique tag at 1200x630px
- [ ] Blog post pages reference post-specific OG images in metadata (not the site-wide image)
- [ ] Tag pages reference tag-specific OG images in metadata
- [ ] Twitter card meta tags on blog posts reference post-specific images
- [ ] Home page, blog listing, uses, and resume still use the site-wide OG image
- [ ] `scripts/generate-assets.ts` still works after Canvas extraction to `scripts/canvas.ts`
- [ ] Adding a new post to `blog.ts` and rebuilding generates its OG image automatically
- [ ] Keyboard `/` focuses the blog search input on the listing page
- [ ] Keyboard `Escape` clears search and tag filter on the listing page
- [ ] Keyboard `j`/`k` navigates between posts on blog post pages
- [ ] Keyboard `b` or `Escape` navigates to the blog listing from a post page
- [ ] Shortcuts are disabled when typing in form inputs (except `Escape`)
- [ ] Blog listing shows result count: "8 posts" unfiltered, "Showing N of 8 posts" when filtered
- [ ] "Clear filters" action appears when filters are active and resets all filters
- [ ] Both light and dark themes render all changes correctly
- [ ] Responsive at mobile (375px), tablet (768px), and desktop (1280px)
- [ ] No regressions to existing features (nav, theme, blog search, tag filter, TOC, code copy, analytics, RSS, print styles)
- [ ] Static export generates all expected files in `out/`

## What's Next (Sprint 17 Preview)

Potential future work: custom domain setup with DNS configuration, real testimonials to restore the section with genuine quotes, blog post pagination as post count grows beyond 10, a dark-mode-aware code block theme toggle (separate highlight.js palettes for light and dark), or additional blog posts continuing to expand the content library.
