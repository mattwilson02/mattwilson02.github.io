# Sprint 13 — Professional Branding & Active Status

## Overview

**Goal:** Replace placeholder branding assets with professional-grade alternatives (headshot, favicon set, OG image), add a "Currently Building" section that signals Matt is actively shipping — not just a static portfolio — and expand the blog with 2 new posts to reach 7 total.

**Rationale:** The site is feature-complete and polished, but three things undermine the professional impression for recruiters and hiring managers:

1. **The "MW" placeholder avatar** — the About section's grey circle with initials is the most visible piece of unfinished work on the site. The `Avatar` component already accepts a `src` prop and renders a `next/image` when provided. All that's needed is a professional headshot image and a one-line data change.

2. **Weak branding assets** — the favicon is a minimal placeholder, and there's no web app manifest or apple-touch-icon. When someone bookmarks the site or adds it to their home screen, they get a generic icon. The OG image is a programmatically generated placeholder — when the site is shared on LinkedIn or Slack, it looks amateur.

3. **Static portfolio feel** — every section describes past work. There's nothing communicating "here's what I'm building right now." A "Currently Building" section with live project status creates a sense of momentum and gives returning visitors a reason to check back. It also provides natural content for social sharing.

The blog expansion (2 more posts) continues building SEO depth and fills topic gaps — specifically Docker/DevOps and testing strategy, both areas where Matt has strong experience but no blog presence.

## What Exists

- **Avatar component (`src/components/avatar.tsx`):** Accepts optional `src` prop. When `src` is provided, renders `<Image>` with `rounded-full object-cover`. When not provided, renders the "MW" placeholder. The About section calls `<Avatar size={96} />` with no `src` — placeholder renders
- **About data (`src/data/about.ts`):** `AboutData` interface has no `avatarSrc` field — the avatar is hardcoded without a `src` in `about.tsx`
- **Static assets (`public/`):** `favicon.ico` (minimal placeholder), `og-image.png` (1200x630 programmatic placeholder), `matt-wilson-resume.pdf`, `.nojekyll`, `robots.txt`, `feed.xml`, `sitemap.xml`. No `site.webmanifest`, no `apple-touch-icon.png`, no `favicon-16x16.png` / `favicon-32x32.png`
- **Root layout (`src/app/layout.tsx`):** References `favicon.ico` implicitly via Next.js defaults. No explicit favicon metadata beyond the default. No `manifest` field in metadata export
- **Home page composition (`src/app/page.tsx`):** Hero → About → Experience → Projects → Skills → Certifications → LatestPosts → Contact → Footer → ScrollToTop. No "Currently Building" section
- **Nav links (`src/components/nav.tsx`):** 7 home links (Home, About, Experience, Projects, Skills, Contact, Blog). 7 blog links with absolute paths
- **Blog (`src/data/blog.ts`):** 5 posts covering AI agents, React Native, career journey, RAG pipelines, and AI-driven engineering. Tags in use: AI, TypeScript, Developer Tools, React Native, Mobile, Career, Learning, Python, RAG, Engineering, Opinion. No posts covering Docker/DevOps or testing strategy
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
  - Prebuild script (`scripts/generate-feeds.ts`) auto-generates `sitemap.xml` and `feed.xml` from `blogPosts` array

## Architectural Decisions

All previous sprint architectural decisions carry forward. Additional decisions for this sprint:

### 1. Headshot as a Static Asset in `public/`
- Place a professional headshot at `public/headshot.jpg` (or `.webp` for smaller file size)
- The `Avatar` component already supports `src` prop with `next/image` — no component changes needed, only a data change in `about.ts` (add an `avatarSrc` field) and a minor update to `about.tsx` to pass it through
- Since `images: { unoptimized: true }` is set in `next.config.ts` (required for static export), the image is served as-is from `public/`. Use a pre-optimised image (compressed, appropriately sized — 192x192 or 256x256 is sufficient for a 96px display size at 2x retina)
- The builder should generate a professional-looking placeholder headshot image if a real photo is not available. Options: a high-quality generated avatar using a simple canvas/SVG approach with the site's accent colour and initials, or a clean silhouette. The key is that it should look intentional, not like a broken image or a lazy placeholder

### 2. Favicon Set via Next.js Metadata API
- Next.js supports `icons` in the metadata export to generate proper `<link>` tags for favicons
- Create a proper favicon set: `favicon.ico` (multi-size), `favicon-16x16.png`, `favicon-32x32.png`, `apple-touch-icon.png` (180x180)
- The builder should generate these programmatically (Node canvas script or similar) using the site's accent colour (`#2563eb`) and Matt's initials "MW" — matching the site's branding
- Add a `site.webmanifest` for progressive web app metadata (name, short_name, icons, theme_color, background_color). This improves Lighthouse PWA score and provides a branded experience when the site is added to a mobile home screen

### 3. "Currently Building" Section — Data-Driven with Status Indicators
- A new section showing Matt's active projects with status indicators (e.g. "Active", "On hold", "Shipped")
- Data lives in `src/data/currently-building.ts` following the established data-file pattern
- Positioned between LatestPosts and Contact — after demonstrating what Matt thinks (blog) and before the closing CTA. This creates a narrative flow: what he's built (Projects) → what he thinks (LatestPosts) → what he's building now (Currently Building) → how to reach him (Contact)
- Each project entry has: name, description (1-2 sentences), status, tech tags, and an optional link
- Status is displayed as a small coloured dot + label: green for "Active", amber for "Paused", blue for "Shipped"
- This section updates by editing a single data file — same pattern as all other sections

### 4. OG Image — Refresh with Proper Branding
- The current OG image is a minimal programmatic placeholder. Replace it with a properly branded image that includes Matt's name, title, and the site's visual identity (accent colour, clean typography)
- The builder should generate this at 1200x630px using a Node canvas script or similar approach
- The image should look professional when shared on LinkedIn, Twitter/X, or Slack — this is often the first impression someone has of the site

### 5. No Nav Link for "Currently Building"
- The section does not need its own nav link. The nav already has 7 links (the ceiling established in Sprint 9), and "Currently Building" is a small section that users scroll to naturally between LatestPosts and Contact
- The scroll spy does not need to track this section since there's no corresponding nav link

## Tasks

### Task 1: Professional Headshot & Avatar Integration

**Objective:** Replace the "MW" placeholder avatar with a professional headshot image, completing the About section's visual presentation.

**Files to create:**

| File | Purpose |
|------|---------|
| `public/headshot.jpg` | Professional headshot image (256x256 or larger, square, compressed) |

**Files to modify:**

| File | Change |
|------|--------|
| `src/data/about.ts` | Add `avatarSrc` field to `AboutData` interface and data |
| `src/components/about.tsx` | Pass `avatarSrc` from data to the `Avatar` component's `src` prop |

**Requirements — Headshot Image (`public/headshot.jpg`):**
- Generate a professional-looking placeholder headshot. Since a real photo is not available, the builder should create a high-quality branded avatar:
  - Option A: A clean, modern SVG-based avatar rendered to JPG — solid accent-colour background (`#2563eb`), white "MW" initials in Inter font, properly anti-aliased and sized
  - Option B: A professional silhouette or geometric avatar using the site's colour palette
  - The image must look intentional and polished — not a grey circle. It should pass the "recruiter glance test" — a hiring manager should see it and think "professional placeholder" not "broken site"
- Dimensions: at least 256x256px (square aspect ratio). This covers the 96px display size at up to 3x retina resolution
- Format: JPEG with quality ~85 for good compression, or WebP if the builder prefers (the `Avatar` component uses `next/image` which handles format display). Keep file size under 50KB
- Alt text is already set to "Matt Wilson" in the `Avatar` component — no change needed

**Requirements — About Data Update (`about.ts`):**
- Add `avatarSrc` to the `AboutData` interface: `avatarSrc?: string`
- Set value: `avatarSrc: "/headshot.jpg"`
- Making it optional (`?`) means the data file gracefully supports both states — with and without a real image

**Requirements — About Component Update (`about.tsx`):**
- Read the `avatarSrc` from `aboutData` and pass it to `<Avatar src={aboutData.avatarSrc} size={96} />`
- No other changes to the component — the Avatar component already handles the `src` prop correctly, rendering either `<Image>` or the "MW" fallback

**Acceptance Criteria:**
- The About section displays a professional-looking headshot image instead of the "MW" grey circle
- The image is properly rounded (the `Avatar` component applies `rounded-full`)
- The image looks good in both light and dark modes (the round clip and object-cover handle this)
- Removing `avatarSrc` from the data file gracefully falls back to the "MW" placeholder
- The image file is under 50KB and loads quickly
- `pnpm build` succeeds with zero TS errors

---

### Task 2: Favicon Set, Web Manifest & OG Image Refresh

**Objective:** Replace placeholder branding assets with a professional favicon set, web app manifest, and improved OG image — ensuring the site looks polished when bookmarked, shared, or added to a home screen.

**Files to create:**

| File | Purpose |
|------|---------|
| `public/favicon-16x16.png` | 16x16 favicon for browser tabs |
| `public/favicon-32x32.png` | 32x32 favicon for browser tabs |
| `public/apple-touch-icon.png` | 180x180 icon for iOS home screen |
| `public/site.webmanifest` | Web app manifest for PWA metadata |

**Files to modify:**

| File | Change |
|------|--------|
| `public/favicon.ico` | Replace placeholder with properly generated multi-size ICO |
| `public/og-image.png` | Replace placeholder with professionally branded image |
| `src/app/layout.tsx` | Add `icons` and `manifest` fields to metadata export |

**Requirements — Favicon Generation:**
- All favicon images should use the site's accent colour (`#2563eb`) as a background with white "MW" initials — creating a consistent branded icon across all sizes
- The builder should generate these programmatically using a Node script (canvas, sharp, or similar). Generate as part of the build or as a one-time script — the output files are committed to `public/`
- `favicon.ico`: standard ICO format, should contain 16x16 and 32x32 sizes
- `favicon-16x16.png`: 16x16 PNG
- `favicon-32x32.png`: 32x32 PNG
- `apple-touch-icon.png`: 180x180 PNG (Apple's required size for iOS home screen icons)
- All icons should have rounded corners or work well when iOS applies its default rounding mask

**Requirements — Web Manifest (`public/site.webmanifest`):**
- Valid JSON manifest with:
  ```json
  {
    "name": "Matt Wilson — Senior Full Stack & AI Engineer",
    "short_name": "Matt Wilson",
    "icons": [
      { "src": "/favicon-16x16.png", "sizes": "16x16", "type": "image/png" },
      { "src": "/favicon-32x32.png", "sizes": "32x32", "type": "image/png" },
      { "src": "/apple-touch-icon.png", "sizes": "180x180", "type": "image/png" }
    ],
    "theme_color": "#2563eb",
    "background_color": "#ffffff",
    "display": "standalone"
  }
  ```

**Requirements — OG Image Refresh (`public/og-image.png`):**
- Dimensions: 1200x630px (standard OG image size, matching existing metadata)
- Design: professional branded image with:
  - Dark background (`#0a0a0a` or the site's dark mode card colour `#111111`)
  - "Matt Wilson" in large, bold text (Inter-style or similar clean sans-serif)
  - "Senior Full Stack & AI Engineer" as subtitle
  - A subtle accent colour element (a line, gradient, or border in `#2563eb`)
  - The site URL `mattwilson02.github.io` in small muted text
- The image should look polished when previewed in LinkedIn, Twitter/X, or Slack share dialogs
- Generate programmatically — same approach as favicon generation

**Requirements — Layout Metadata Update (`layout.tsx`):**
- Add `icons` field to the `metadata` export:
  ```
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  ```
- Add `manifest` field to the `metadata` export: `manifest: "/site.webmanifest"`
- No other changes to `layout.tsx`

**Acceptance Criteria:**
- Browser tabs display a branded "MW" favicon (not a generic or blank icon)
- iOS users adding the site to their home screen see the apple-touch-icon
- The web manifest is served at `/site.webmanifest` and contains valid JSON
- Sharing the site on LinkedIn/Slack shows the new OG image with Matt's name and title on a dark background
- HTML source contains proper `<link>` tags for all favicon sizes and the manifest
- All generated images are valid, properly sized, and under reasonable file sizes (favicons <10KB, OG image <100KB)
- `pnpm build` succeeds with zero TS errors

---

### Task 3: "Currently Building" Section

**Objective:** Add a data-driven "Currently Building" section to the home page that shows Matt's active projects with status indicators — communicating momentum and giving recruiters a reason to engage beyond the static portfolio.

**Files to create:**

| File | Purpose |
|------|---------|
| `src/data/currently-building.ts` | Active project data with status indicators |
| `src/components/currently-building.tsx` | "Currently Building" section component |

**Files to modify:**

| File | Change |
|------|--------|
| `src/app/page.tsx` | Add CurrentlyBuilding section between LatestPosts and Contact |

**Requirements — Data (`currently-building.ts`):**

Define and export typed interfaces and a data array:

```
type ProjectStatus = "active" | "paused" | "shipped";

interface CurrentProject {
  name: string;
  description: string;
  status: ProjectStatus;
  tech: string[];
  link?: string;
}
```

Export a `currentProjects` array with 3-4 entries. Draft from Matt's actual projects and interests:

1. **Ralph v2** — status: `"active"`
   - Description: "Next generation of the autonomous AI developer agent. Multi-repo orchestration, persistent context across sprints, and self-improving spec quality."
   - Tech: `["TypeScript", "Claude API", "Node.js"]`
   - Link: `"https://github.com/mattwilson02/ralph"`

2. **Imperium** — status: `"active"`
   - Description: "Personal knowledge management platform. Daily driver for unified access across Gmail, Drive, Calendar, and messaging — with cost-optimised LLM routing."
   - Tech: `["Python", "Flask", "Docker", "Claude MCP"]`
   - Link: `"https://github.com/mattwilson02/imperium"`

3. **This Portfolio** — status: `"shipped"`
   - Description: "Built entirely by Ralph from sprint specs. 13 sprints, 7 blog posts, full SEO, and zero manual code."
   - Tech: `["Next.js", "TypeScript", "Tailwind CSS"]`
   - Link: `"https://github.com/mattwilson02/mattwilson02.github.io"`

4. **Bitcoin Core Contribution** — status: `"paused"`
   - Description: "Long-term goal. Studying the codebase, building C++ competency, identifying approachable first contributions."
   - Tech: `["C++", "Bitcoin"]`
   - No link

**Follow the copy style guide:** Direct, factual descriptions. No fluff. These should read like status updates, not marketing copy.

**Requirements — CurrentlyBuilding Component (`currently-building.tsx`):**
- Client component (`"use client"`) — uses Framer Motion
- Uses the `Section` wrapper with `id="building"`
- Heading "Currently Building" as `<h2>` (same styling as other section headings)
- Layout: a responsive grid of compact cards — 1 column on mobile, 2 columns on md+. Not 3 columns — these cards have more text than project cards and need the width
- Each card displays:
  - Status indicator: a small coloured dot (`w-2 h-2 rounded-full inline-block`) + status label in small text, positioned top-right or as the first line of the card
    - `"active"`: green dot (`bg-green-500`) + "Active" text
    - `"paused"`: amber dot (`bg-amber-500`) + "Paused" text
    - `"shipped"`: blue dot (`bg-blue-500`) + "Shipped" text
  - Project name as a bold heading (`text-lg font-semibold`)
  - Description in muted text (`text-sm text-[var(--color-muted)]`)
  - Tech tags as pills (same pill style as hero badges and project cards)
  - If `link` is provided, the project name should be an `<a>` linking to the URL (opens in new tab with `rel="noopener noreferrer"`). If no link, render as plain text
- Card styling: matches established card pattern — `rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-6`
- No hover scale effect on these cards (they're status cards, not CTAs) — but a subtle `hover:border-[var(--color-accent)]` border transition is appropriate for cards with links
- Scroll-triggered Framer Motion animation using the established `containerVariants` / `itemVariants` pattern with `whileInView` and `viewport={{ once: true, margin: "-100px" }}`
- Respect `useReducedMotion()` as all other sections do

**Requirements — Page Assembly (`page.tsx`):**
- Add `CurrentlyBuilding` as a dynamic import: `const CurrentlyBuilding = dynamic(() => import("@/components/currently-building").then(m => ({ default: m.CurrentlyBuilding })))`
- Section order: Hero → About → Experience → Projects → Skills → Certifications → LatestPosts → **CurrentlyBuilding** → Contact
- The section slots between LatestPosts and Contact in the JSX

**Acceptance Criteria:**
- "Currently Building" section renders on the home page between LatestPosts and Contact
- 3-4 project cards displayed with name, description, status indicator, and tech pills
- Status dots use correct colours: green for active, amber for paused, blue for shipped
- Project names with links are clickable and open in new tabs
- Projects without links render names as plain text
- Card styling matches established patterns
- Responsive: 1 column mobile, 2 columns md+
- Framer Motion scroll animation triggers correctly
- Content driven from `currently-building.ts`, not hardcoded in JSX
- `pnpm build` succeeds with zero TS errors and zero ESLint warnings

---

### Task 4: Blog Content Expansion

**Objective:** Add 2 new blog posts covering Docker/DevOps and testing strategy — topics where Matt has deep experience but no blog presence. This brings the total to 7 posts and introduces new tags that expand the blog's reach.

**Files to modify:**

| File | Change |
|------|--------|
| `src/data/blog.ts` | Add 2 new `BlogPost` entries to the `blogPosts` array |

**Requirements — Post 6: "Docker in Production: Lessons from Running Services on Hetzner":**
- `slug`: `"docker-in-production-lessons-hetzner"`
- `title`: `"Docker in Production: Lessons from Running Services on Hetzner"`
- `date`: `"2026-03-20"`
- `excerpt`: `"What actually matters when running Docker containers in production — networking, health checks, volume management, and the things that only break at 2am."`
- `tags`: `["Docker", "DevOps", "Python"]`
- `readingTime`: `"6 min read"`
- Content direction (400-600 words, Markdown with 2-3 fenced code blocks):
  - Open with the context: running Imperium's multi-service architecture (Custodes, Sigillite, Cockpit, n8n) on a Hetzner VPS. Not Kubernetes, not AWS — a single server with Docker Compose
  - Section on Docker Compose patterns that matter: health checks, restart policies, dependency ordering with `depends_on` + `condition: service_healthy`. Include a `docker-compose.yml` YAML code block showing a well-structured service definition with health checks
  - Section on networking and reverse proxy: Caddy as a reverse proxy with automatic HTTPS. Why Caddy over nginx for small deployments. Include a `Caddyfile` or config code block
  - Section on the things that only break in production: volume permissions, log rotation, container resource limits, cron-based backups. Include a Bash code block showing a backup script pattern
  - Close with the takeaway: for personal/small-team projects, a single VPS with Docker Compose is simpler, cheaper, and more debuggable than managed container services. Know when to scale up
  - Tone: practical war stories, not a Docker tutorial. "Here's what I wish I'd known" energy

**Requirements — Post 7: "600 Tests and What They Actually Caught":**
- `slug`: `"600-tests-and-what-they-caught"`
- `title`: `"600 Tests and What They Actually Caught"`
- `date`: `"2026-03-10"`
- `excerpt`: `"Writing 600+ tests across Vitest, Cypress, Jest, and Maestro taught me that the value of testing isn't preventing bugs — it's enabling fearless refactoring."`
- `tags`: `["Testing", "TypeScript", "Engineering"]`
- `readingTime`: `"5 min read"`
- Content direction (400-600 words, Markdown with 2-3 fenced code blocks):
  - Open with the stat: 600+ tests across multiple projects. But the number is vanity — what matters is what they enable
  - Section on the testing pyramid in practice: unit tests (Vitest, Jest) for business logic, integration tests (Supertest) for API contracts, E2E tests (Cypress, Maestro) for critical user flows. Why the pyramid shape matters. Include a TypeScript code block showing a clean Vitest test with factory-based test data
  - Section on testing mobile apps: why Maestro over Detox for React Native E2E. The 5-flows-per-platform strategy for SF Mobile. Include a YAML code block showing a Maestro flow
  - Section on what tests actually caught: not "button renders" tests — those are useless. The tests that saved production: financial calculations in stored procedures, auth state machine edge cases, API contract changes that would have broken the mobile app. Specific examples
  - Close with the real value: tests give you confidence to refactor. The codebase with 150 test files is the codebase you can restructure without fear. The codebase with zero tests is the one everyone's afraid to touch
  - Tone: pragmatic, opinionated, grounded in real experience. "Stop writing tests for coverage numbers" energy

**Requirements — General:**
- Insert new posts into the `blogPosts` array in date order (newest first). The array order after insertion should be: Post 6 (Mar 20), Post 1 (Mar 15), Post 7 (Mar 10), Post 4 (Mar 1), Post 2 (Feb 20), Post 5 (Feb 5), Post 3 (Jan 10)
- All code blocks must use language annotations for syntax highlighting
- Code examples should be 5-15 lines — illustrative, not exhaustive
- Content must follow the established copy style guide
- New tags introduced: "Docker", "DevOps", "Testing"
- The prebuild script automatically includes new posts in sitemap (9 URLs: home, /blog, 7 posts) and RSS feed (7 items) — no script changes needed

**Acceptance Criteria:**
- `blogPosts` array contains 7 entries sorted newest-first by date
- Post 6 has 2-3 fenced code blocks (YAML, Caddyfile/config, Bash)
- Post 7 has 2-3 fenced code blocks (TypeScript, YAML)
- New tags introduced: Docker, DevOps, Testing
- Content is real, substantive (400-600 words each), and follows the copy style guide
- Slugs are URL-safe
- After `pnpm build`, the sitemap contains 9 URLs and the RSS feed contains 7 items
- New posts render with syntax highlighting, TOC, reading progress, share buttons, and related posts
- Tag filter on `/blog` includes the new tags
- `pnpm build` succeeds with zero TS errors

---

### Task 5: Build Verification & Integration Test

**Objective:** Verify the complete site builds cleanly with all Sprint 13 changes, confirm all new assets are generated and referenced correctly, and ensure no regressions.

**Files to modify:** None expected — this is a verification task. Fix issues in relevant files if found.

**Requirements — Build Verification Checklist:**

The builder must verify all of the following after completing Tasks 1-4:

- [ ] `pnpm build` exits 0 with zero TypeScript errors and zero ESLint warnings
- [ ] `out/` directory contains all expected files: `index.html`, `404.html`, `sitemap.xml`, `feed.xml`, `og-image.png`, `robots.txt`, `.nojekyll`, `favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png`, `apple-touch-icon.png`, `site.webmanifest`, `matt-wilson-resume.pdf`, `headshot.jpg`, `blog/index.html`, and `blog/*/index.html` for all 7 posts
- [ ] About section displays a professional headshot image instead of the "MW" placeholder
- [ ] Browser tab shows branded "MW" favicon
- [ ] HTML `<head>` contains `<link>` tags for favicon-16x16, favicon-32x32, apple-touch-icon, and manifest
- [ ] `/site.webmanifest` serves valid JSON
- [ ] OG image (`og-image.png`) is updated with professional branding — dark background, name, title
- [ ] "Currently Building" section renders between LatestPosts and Contact with 3-4 project cards
- [ ] Status indicators display correct colours (green/amber/blue) for active/paused/shipped
- [ ] Project links in "Currently Building" open in new tabs
- [ ] 7 blog posts render with syntax highlighting and all blog features (TOC, progress bar, share, related posts)
- [ ] `sitemap.xml` contains 9 URLs (home, /blog, 7 posts)
- [ ] `feed.xml` contains 7 items
- [ ] New tags (Docker, DevOps, Testing) appear in blog tag filter
- [ ] All existing features still work: shimmer animation, availability badge, nav scroll spy, theme toggle, mobile hamburger, blog search, tag filter, code copy, RSS autodiscovery
- [ ] Both light and dark themes render all changes correctly
- [ ] Responsive at mobile (375px), tablet (768px), and desktop (1280px)
- [ ] No horizontal overflow or layout issues from the new section

**Acceptance Criteria:**
- All verification checklist items pass
- No regressions to existing functionality
- The site remains production-ready

## Implementation Order

1. **Task 1** — Headshot & avatar (independent, touches about.ts and about.tsx)
2. **Task 2** — Favicon, manifest & OG image (independent, touches layout.tsx and public/ assets)
3. **Task 3** — "Currently Building" section (independent, new data file + component + page.tsx update)
4. **Task 4** — Blog content expansion (independent, only modifies blog.ts)
5. **Task 5** — Build verification (depends on Tasks 1-4 completing)

Tasks 1, 2, 3, and 4 are fully independent — they touch completely different files. All four can be built in parallel. Task 5 is the final integration check.

## File Count

| Task | New Files | Modified Files | Total New |
|------|-----------|----------------|-----------|
| Task 1 | 1 | 2 | 1 |
| Task 2 | 4 | 3 | 5 |
| Task 3 | 2 | 1 | 7 |
| Task 4 | 0 | 1 | 7 |
| Task 5 | 0 | 0 | 7 |

**7 new files, 7 modified files (no overlaps between tasks).** Well within the 15-file limit.

**New files:**
1. `public/headshot.jpg`
2. `public/favicon-16x16.png`
3. `public/favicon-32x32.png`
4. `public/apple-touch-icon.png`
5. `public/site.webmanifest`
6. `src/data/currently-building.ts`
7. `src/components/currently-building.tsx`

**Modified files:**
1. `src/data/about.ts` (Task 1 — add avatarSrc)
2. `src/components/about.tsx` (Task 1 — pass src to Avatar)
3. `public/favicon.ico` (Task 2 — replace placeholder)
4. `public/og-image.png` (Task 2 — replace placeholder)
5. `src/app/layout.tsx` (Task 2 — add icons + manifest metadata)
6. `src/app/page.tsx` (Task 3 — add CurrentlyBuilding dynamic import)
7. `src/data/blog.ts` (Task 4 — add 2 new posts)

## Definition of Done

- [ ] `pnpm install && pnpm build` exits 0 with zero TS errors and zero ESLint warnings
- [ ] About section displays a professional headshot instead of the "MW" placeholder
- [ ] Removing `avatarSrc` from `about.ts` gracefully falls back to the placeholder
- [ ] Browser tabs show a branded "MW" favicon at all sizes
- [ ] HTML `<head>` contains favicon, apple-touch-icon, and manifest `<link>` tags
- [ ] `/site.webmanifest` is valid JSON with correct name, icons, and theme colour
- [ ] OG image is refreshed with professional dark-background branding
- [ ] "Currently Building" section renders between LatestPosts and Contact
- [ ] 3-4 project cards display with status indicators (green active, amber paused, blue shipped)
- [ ] Status indicators and tech pills follow established styling patterns
- [ ] Content driven from `currently-building.ts`, not hardcoded in JSX
- [ ] `blogPosts` array contains 7 entries sorted newest-first by date
- [ ] New posts cover Docker/DevOps and testing strategy with 2-3 code blocks each
- [ ] New tags (Docker, DevOps, Testing) appear in blog tag filter and work correctly
- [ ] `sitemap.xml` contains 9 URLs; `feed.xml` contains 7 items
- [ ] All 7 posts render with syntax highlighting, TOC, reading progress, share, related posts
- [ ] Blog search works across all 7 posts
- [ ] Related posts algorithm suggests relevant posts for new posts based on tag overlap
- [ ] Both light and dark themes render all changes correctly
- [ ] Responsive at mobile (375px), tablet (768px), and desktop (1280px)
- [ ] No regressions to existing features (nav, theme, shimmer, scroll spy, code copy, RSS, analytics)
- [ ] Section order: Hero → About → Experience → Projects → Skills → Certifications → LatestPosts → Currently Building → Contact → Footer
- [ ] Static export generates all expected files in `out/`

## What's Next (Sprint 14 Preview)

Potential future work: custom domain setup with DNS configuration, real testimonials to restore the section with genuine quotes, blog post pagination as post count grows beyond 10, estimated reading time auto-calculation, a "Uses" page (tools/setup Matt works with), or analytics dashboard integration showing live visitor counts.
