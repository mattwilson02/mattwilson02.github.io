# Sprint 11 — Syntax Highlighting & Code Block Polish

## Overview

**Goal:** Add syntax highlighting to blog code blocks, display language labels, enhance blog posts with real code examples that showcase the highlighting, and add share functionality to blog posts.

**Rationale:** The blog has been live since Sprint 8 with a reading progress bar, table of contents, and copy-to-clipboard buttons on code blocks (Sprint 10). But the code blocks themselves render as plain monochrome text — no colour differentiation between keywords, strings, comments, or variables. For a technical engineering blog written by someone who builds developer tools, this is a credibility gap. Syntax highlighting is table-stakes for any developer blog and was explicitly called out in the Sprint 10 preview as the next priority. Beyond highlighting, the 3 existing blog posts are essay-style with almost no fenced code blocks — adding real code examples to the Ralph and Specs posts makes them more concrete and gives the highlighting something to shine on. Finally, there's no way for readers to share a post they liked — a simple copy-link button and social share links close that gap.

## What Exists

- **Blog infrastructure (Sprints 8-10):**
  - `src/data/blog.ts` — `BlogPost` interface with `slug`, `title`, `date`, `excerpt`, `tags`, `readingTime`, `content` (Markdown string). 3 posts sorted newest-first
  - `src/app/blog/[slug]/page.tsx` — server component with `generateStaticParams`, `generateMetadata`, JSON-LD BlogPosting, reading progress bar, TOC (mobile collapsible + desktop sticky sidebar), related posts, "Back to Blog" links
  - `src/components/blog-post-content.tsx` — client component (`"use client"`). Renders `<ReactMarkdown>` with `components` prop overriding `pre` → `CodeBlock`, `h2`/`h3` → heading elements with slugified `id` attributes. Wraps content in `<div className="prose max-w-3xl">`
  - `src/components/code-block.tsx` — client component. Wraps `<pre>` in a relative container with a "Copy" button in the top-right corner. Uses `navigator.clipboard.writeText()` with "Copied!" feedback
  - `src/lib/extract-headings.ts` — exports `slugify()` and `extractHeadings()` utilities
  - `react-markdown` ^10.1.0 installed — supports `rehypePlugins` prop for AST-level plugins
- **Code block rendering pipeline:** Markdown `→` `react-markdown` `→` `pre` override `→` `CodeBlock` component `→` `<div class="relative"><pre ref={preRef}>{children}</pre><button>Copy</button></div>`
- **Prose styles (`globals.css` lines 107-212):**
  - `.prose pre` — `bg-[var(--color-card)]`, `border-[var(--color-border)]`, monospace font, `overflow-x: auto`, `0.875rem` font size
  - `.prose code` — inline code with card background and border
  - `.prose pre code` — resets inline code styles inside pre blocks (no background, no border, no padding)
- **Current blog post content:** 3 posts, mostly prose-style writing with bold text, lists, and inline code. The Ralph post mentions structured JSON (`{ files: [{path, content}], commands: string[] }`) inline but has NO fenced code blocks with language annotations. No post currently uses `` ```typescript `` or `` ```json `` syntax
- **Dependencies:** `react-markdown` ^10.1.0, `framer-motion` ^11.0.0, `next` ^15.0.0, `react` ^19.0.0. No rehype or remark plugins installed
- **Theme system:** CSS variables `--color-card`, `--color-border`, `--color-foreground`, `--color-muted`, `--color-accent` defined for light and dark modes in `globals.css`

## Architectural Decisions

All previous sprint architectural decisions carry forward. Additional decisions for this sprint:

### 1. Syntax Highlighting via `rehype-highlight` (highlight.js)
- `rehype-highlight` integrates directly with `react-markdown` via the `rehypePlugins` prop — no config changes to `next.config.ts`, no build pipeline changes
- It's synchronous (unlike `shiki` which is async and harder to integrate with client-side `react-markdown`)
- highlight.js detects the language from fenced code block annotations (`` ```typescript ``) and adds CSS classes to tokens (`hljs-keyword`, `hljs-string`, `hljs-comment`, etc.)
- The actual colours are defined in a CSS theme file — this means theme switching (light/dark) is handled purely in CSS, matching the site's existing CSS variable approach
- One new production dependency (`rehype-highlight`) and one dev dependency (`highlight.js` types if needed — but `rehype-highlight` bundles its own types)

### 2. Custom highlight.js Theme Using CSS Variables
- Rather than importing a pre-built highlight.js theme (which would clash with the site's light/dark toggle), create a custom theme in `globals.css` that uses the existing CSS variable system
- Define highlight colours as new CSS variables (e.g. `--color-syntax-keyword`, `--color-syntax-string`, etc.) with appropriate values for both light and dark modes
- This keeps all theming in one place and ensures syntax highlighting adapts automatically when the user toggles themes
- The colour palette should be professional and readable — not a "fun" theme. Muted, high-contrast colours that work on the `--color-card` background

### 3. Language Label via Code Block Enhancement
- When `rehype-highlight` processes a fenced code block with a language annotation (`` ```typescript ``), it adds a `className` like `language-typescript` to the `<code>` element
- The `CodeBlock` component can extract this language from the child `<code>` element's className and display it as a small label in the top-left corner of the code block
- This gives readers immediate context about what language they're looking at — especially useful when posts include multiple languages

### 4. Blog Post Content Updates — Real Code Examples
- The existing posts are substantive but abstract. Adding 2-3 fenced code blocks per post (where they fit naturally) makes the content more concrete and showcases the new syntax highlighting
- This is a data-only change — modify `src/data/blog.ts`, no component changes
- Keep the additions short and relevant to the post's narrative. Don't force code where it doesn't belong

### 5. Share Functionality — Lightweight, No Dependencies
- A small "Share" area at the bottom of each blog post with: a "Copy link" button (uses `navigator.clipboard.writeText(window.location.href)`) and native share via `navigator.share()` on mobile
- No third-party share widgets or social SDK scripts — keep it lightweight and privacy-respecting
- This is a new client component rendered on the blog post page

## Tasks

### Task 1: Syntax Highlighting Integration

**Objective:** Add syntax highlighting to all fenced code blocks in blog posts by integrating `rehype-highlight` with `react-markdown` and defining a custom CSS theme that respects the site's light/dark modes.

**Dependencies to add:**

| Package | Purpose |
|---------|---------|
| `rehype-highlight` | Rehype plugin that applies highlight.js syntax highlighting to code blocks in the react-markdown pipeline |

**Files to modify:**

| File | Change |
|------|--------|
| `src/components/blog-post-content.tsx` | Add `rehypeHighlight` to `ReactMarkdown`'s `rehypePlugins` prop |
| `src/app/globals.css` | Add syntax highlighting CSS variables and `.hljs-*` token colour rules |

**Requirements — blog-post-content.tsx Update:**
- Install and import `rehypeHighlight` from `rehype-highlight`
- Add `rehypePlugins={[rehypeHighlight]}` to the `<ReactMarkdown>` component
- No other changes to the component — the existing `components` overrides (`pre` → `CodeBlock`, `h2`/`h3` → heading with ID) continue to work. `rehype-highlight` operates at the AST level before component rendering, adding `className` attributes to `<code>` tokens
- The plugin automatically detects language from fenced code block annotations (`` ```typescript ``) and applies `hljs-*` classes. For code blocks without a language annotation, it attempts auto-detection — this is acceptable behaviour

**Requirements — Syntax Theme CSS (`globals.css`):**
- Add new CSS variables for syntax token colours in both the light and dark theme blocks in `:root` / `.dark`:

Light mode values (professional, readable on `#f9fafb` card background):
  - `--color-syntax-keyword`: a blue-purple (e.g. `#7c3aed` or `#6f42c1`) — for `if`, `const`, `function`, `import`, `export`, `return`
  - `--color-syntax-string`: a warm green (e.g. `#16a34a` or `#22863a`) — for string literals
  - `--color-syntax-comment`: a muted grey (e.g. `#9ca3af` or `#6b7280`) — for comments, visually recessive
  - `--color-syntax-number`: an orange (e.g. `#d97706` or `#e36209`) — for numeric literals
  - `--color-syntax-function`: a blue (e.g. `#2563eb` — matching the site's accent) — for function names
  - `--color-syntax-variable`: the foreground colour (`var(--color-foreground)`) — default text
  - `--color-syntax-type`: a teal/cyan (e.g. `#0891b2` or `#0ea5e9`) — for type names, interfaces
  - `--color-syntax-property`: a red-brown (e.g. `#dc2626` or `#cf222e`) — for object properties, attributes
  - `--color-syntax-operator`: a muted foreground — for `=`, `=>`, `+`, etc.
  - `--color-syntax-punctuation`: a muted grey — for brackets, semicolons

Dark mode values (same categories, adjusted for readability on `#111111` card background):
  - Shift each colour to a lighter, more saturated variant that reads well on dark backgrounds
  - Standard dark mode syntax colours: keywords in light purple/violet, strings in light green, comments in medium grey, numbers in light orange, functions in light blue, types in light cyan

- Add `.hljs-*` class rules mapping highlight.js token classes to the CSS variables:
  ```
  .prose .hljs-keyword,
  .prose .hljs-tag { color: var(--color-syntax-keyword); }

  .prose .hljs-string,
  .prose .hljs-doctag { color: var(--color-syntax-string); }

  .prose .hljs-comment { color: var(--color-syntax-comment); font-style: italic; }

  .prose .hljs-number,
  .prose .hljs-literal { color: var(--color-syntax-number); }

  .prose .hljs-title.function_,
  .prose .hljs-title { color: var(--color-syntax-function); }

  .prose .hljs-variable,
  .prose .hljs-template-variable { color: var(--color-syntax-variable); }

  .prose .hljs-type,
  .prose .hljs-built_in { color: var(--color-syntax-type); }

  .prose .hljs-attr,
  .prose .hljs-property { color: var(--color-syntax-property); }

  .prose .hljs-operator { color: var(--color-syntax-operator); }

  .prose .hljs-punctuation { color: var(--color-syntax-punctuation); }

  .prose .hljs-meta { color: var(--color-syntax-comment); }
  ```

- Scope all `.hljs-*` rules under `.prose` to prevent accidental styling outside blog content
- Do NOT import any pre-built highlight.js CSS theme file — the custom CSS variables handle everything

**Acceptance Criteria:**
- Fenced code blocks with language annotations (`` ```typescript ``, `` ```json ``, etc.) render with syntax-coloured tokens
- Keywords, strings, comments, numbers, functions, and types are visually distinct colours
- Both light and dark modes display appropriate syntax colours (readable contrast against the card background)
- Code blocks without language annotations still render (with auto-detection or as plain text)
- The copy button on code blocks still works correctly
- Existing `.prose pre` and `.prose code` styles are preserved (background, border, font, padding)
- No additional CSS theme files imported — all colours defined via CSS variables
- `pnpm build` succeeds with zero TS errors and zero ESLint warnings

---

### Task 2: Code Block Language Labels

**Objective:** Display a small language label (e.g. "TypeScript", "JSON") on code blocks that have a language annotation, giving readers immediate context about what they're looking at.

**Files to modify:**

| File | Change |
|------|--------|
| `src/components/code-block.tsx` | Extract language from child `<code>` element's className; render label |

**Requirements — CodeBlock Enhancement (`code-block.tsx`):**
- Detect the language from the child elements:
  - `rehype-highlight` adds a `className` like `"hljs language-typescript"` to the `<code>` element inside `<pre>`
  - The `CodeBlock` component receives `children` which is the `<code>` element as a React node
  - Extract the language by inspecting the `<code>` element's `className` prop: iterate through `React.Children`, find a valid element with a `className` containing `language-`, extract the language name
  - If no language is detected, don't render a label
- Render a small language label in the top-left corner of the code block:
  - Position: `absolute top-2 left-3` (mirroring the copy button's `top-2 right-2`)
  - Styling: `text-xs text-[var(--color-muted)] select-none pointer-events-none` — small, muted, non-interactive
  - Text: capitalise the language name for display (e.g. "typescript" → "TypeScript", "json" → "JSON", "python" → "Python", "bash" → "Bash")
  - Define a simple lookup map for display names: `{ typescript: "TypeScript", javascript: "JavaScript", json: "JSON", python: "Python", bash: "Bash", tsx: "TSX", jsx: "JSX", css: "CSS", html: "HTML", go: "Go", rust: "Rust", yaml: "YAML", sql: "SQL" }`. For unlisted languages, capitalise the first letter
- Adjust the `<pre>` element's padding-top to accommodate the label without overlapping the code content: change from the current inherited padding to `pt-8` (or add the extra space) when a language label is present
- The copy button remains in the top-right — the language label is in the top-left. They should not overlap

**Acceptance Criteria:**
- Code blocks with language annotations show a small muted label (e.g. "TypeScript") in the top-left corner
- Code blocks without language annotations show no label
- The label does not overlap the copy button or the code content
- The label uses the correct display name (not raw "typescript" but "TypeScript")
- Label is non-interactive (`pointer-events-none`, `select-none`) — it's purely informational
- Both light and dark themes render the label correctly
- The code copy button continues to work (the label doesn't interfere)

---

### Task 3: Blog Post Content Enhancement with Code Examples

**Objective:** Add real, syntax-highlighted code examples to the existing blog posts — making the technical content more concrete and showcasing the new highlighting.

**Files to modify:**

| File | Change |
|------|--------|
| `src/data/blog.ts` | Add fenced code blocks to existing post content |

**Requirements — Post 1: "Building an Autonomous AI Developer Agent":**

Add 2-3 code blocks where they fit naturally in the narrative. Suggested insertions:

1. In the "What Ralph Does" section, after the numbered list — add a code block showing the structured output schema Ralph uses:
   ````
   ```typescript
   interface SprintResult {
     files: Array<{
       path: string;
       action: "create" | "modify" | "delete";
       content: string;
     }>;
     commands: string[];
     commitMessage: string;
   }
   ```
   ````
   Follow with a sentence like: "Every agent response conforms to a typed schema. No free-form prose to parse, no ambiguity about what the agent intended."

2. In the "Architecture Decision" section, after the multi-tier routing explanation — add a code block showing the routing logic:
   ````
   ```typescript
   function routeToModel(task: TaskType): ModelConfig {
     switch (task) {
       case "strategy":
       case "spec-generation":
         return { model: "opus", temperature: 0.3 };
       case "code-generation":
       case "error-analysis":
         return { model: "sonnet", temperature: 0.2 };
       default:
         return { model: "haiku", temperature: 0.1 };
     }
   }
   ```
   ````
   Follow with something like: "The routing is explicit and typed. Each task type maps to a model and temperature that matches the cognitive demand."

3. In the "What I Learned" section, under "Structured outputs beat free-form" — the existing inline mention of `{ files: [{path, content}], commands: string[] }` can be expanded into a proper code block showing a before/after comparison. Keep it brief

**Requirements — Post 3: "Specs Over Keystrokes":**

Add 1-2 code blocks to make the abstract argument concrete:

1. In the "What Precise Specs Actually Look Like" section — add an example showing a spec snippet (as a markdown/yaml code block or a structured TypeScript object) that demonstrates the level of precision Matt describes:
   ````
   ```yaml
   task: "Add blog tag filtering"
   files:
     - path: src/components/tag-filter.tsx
       purpose: "Interactive tag filter pill row"
     - path: src/app/blog/page.tsx
       purpose: "Convert to client component, add filter state"
   requirements:
     - "Active pill: bg-accent, text-white"
     - "Inactive pill: matches existing tech pill style"
     - "Filter is client-side useState, no URL params"
   acceptance_criteria:
     - "Clicking tag filters posts to matching tag"
     - "Clicking active tag clears filter"
   ```
   ````
   Follow with: "That level of precision eliminates ambiguity at the decision points. The agent doesn't have to guess what 'active pill styling' means — it's specified."

**Requirements — Post 2: "Self-Taught to Senior Engineer":**
- This post is narrative/reflective — do NOT force code examples into it. It works well as pure prose. No changes unless a code block fits naturally (it doesn't)

**Requirements — General:**
- All added code blocks must use language annotations (`` ```typescript ``, `` ```yaml ``, `` ```json ``, etc.) so syntax highlighting applies
- Keep code examples short (5-15 lines) — they illustrate points, not replace explanation
- Content additions should flow naturally within the existing prose. Don't break the post's rhythm
- Update `readingTime` values if the additions meaningfully change post length (likely bump the Ralph post from "6 min read" to "7 min read")

**Acceptance Criteria:**
- Post 1 ("Building an Autonomous AI Developer Agent") contains 2-3 fenced code blocks with TypeScript annotations
- Post 3 ("Specs Over Keystrokes") contains 1-2 fenced code blocks (YAML or TypeScript)
- Post 2 ("Self-Taught to Senior Engineer") is unchanged or has minimal additions
- All code blocks render with syntax highlighting (verified after Task 1)
- Code examples are realistic, relevant, and short
- The prose around code examples reads naturally — not forced
- `readingTime` values updated if needed
- Content follows the established copy style guide

---

### Task 4: Blog Post Share Functionality

**Objective:** Add a "Share" area at the bottom of each blog post with copy-link and native share options, so readers can easily share posts they find valuable.

**Files to create:**

| File | Purpose |
|------|---------|
| `src/components/share-post.tsx` | Client component: share/copy-link buttons for blog posts |

**Files to modify:**

| File | Change |
|------|--------|
| `src/app/blog/[slug]/page.tsx` | Add `<SharePost>` component between the article and "Back to Blog" link |

**Requirements — SharePost Component (`share-post.tsx`):**
- Client component (`"use client"`) — needs `navigator.clipboard` and `navigator.share`
- Props interface:
  ```
  interface SharePostProps {
    title: string;
    url: string;
  }
  ```
- Renders a small, horizontally laid-out share area:
  - A muted label: "Share this post" in `text-sm text-[var(--color-muted)]`
  - A "Copy link" button:
    - Clicking calls `navigator.clipboard.writeText(url)`
    - Shows "Copied!" feedback for 2 seconds (same pattern as `code-block.tsx`)
    - Styling: ghost/outline button matching existing secondary button styles — `rounded-md border border-[var(--color-border)] px-3 py-1.5 text-sm text-[var(--color-foreground)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]`
    - Small link/chain icon (inline SVG, ~16px) before the label text
    - `aria-label="Copy post link to clipboard"`
  - A "Share" button (native share):
    - Only render this button if `navigator.share` is available (feature detection: `typeof navigator !== "undefined" && "share" in navigator`)
    - Clicking calls `navigator.share({ title, url })` — this opens the native share sheet on mobile (iOS/Android) and some desktop browsers
    - Same ghost/outline button styling as "Copy link"
    - Small share icon (inline SVG — a box with an upward arrow, ~16px) before the label text
    - `aria-label="Share this post"`
    - If `navigator.share` is not available, this button simply doesn't render — no fallback needed. The "Copy link" button is always available
- Layout: `flex items-center gap-3 flex-wrap` — label on the left, buttons on the right. On mobile, the items should wrap naturally
- No third-party social share links (Twitter/X, LinkedIn, etc.) — keep it minimal. The native share sheet on mobile provides those options automatically
- Wrap in a container with visual separation: `border-t border-[var(--color-border)] pt-6 mt-8`

**Requirements — Blog Post Page Update (`blog/[slug]/page.tsx`):**
- Import `SharePost` component
- Render it between the `</article>` closing tag and the `<RelatedPosts>` component
- Pass `title={post.title}` and `url={\`https://mattwilson02.github.io/blog/${post.slug}\`}`
- The URL should be the canonical URL, not `window.location.href` — this ensures the shared link is always the production URL, even during local development

**Acceptance Criteria:**
- Each blog post page shows a "Share this post" area below the article
- "Copy link" button copies the canonical post URL to the clipboard with "Copied!" feedback
- On browsers/devices supporting `navigator.share`, a "Share" button opens the native share sheet
- On browsers without `navigator.share`, only the "Copy link" button appears (no broken "Share" button)
- Both buttons are keyboard accessible with appropriate aria-labels
- Both light and dark themes render the share area correctly
- The share area does not feel heavy or intrusive — it's a subtle utility, not a social media banner
- `pnpm build` succeeds with zero TS errors and zero ESLint warnings

---

### Task 5: Build Verification & Integration Test

**Objective:** Verify the complete site builds cleanly with all Sprint 11 changes, confirm syntax highlighting renders correctly in both themes, and ensure no regressions.

**Files to modify:** None expected — this is a verification task. If issues are found, fix them in the relevant files.

**Requirements — Build Verification Checklist:**

The builder must verify all of the following after completing Tasks 1-4:

- [ ] `pnpm build` exits 0 with zero TypeScript errors and zero ESLint warnings
- [ ] `out/` directory contains all expected files from previous sprints: `index.html`, `404.html`, `sitemap.xml`, `feed.xml`, `og-image.png`, `robots.txt`, `.nojekyll`, `favicon.ico`, `matt-wilson-resume.pdf`, `blog/index.html`, and `blog/*/index.html` for each post
- [ ] Blog post code blocks with language annotations display syntax-coloured tokens (keywords, strings, comments in distinct colours)
- [ ] Syntax highlighting colours adapt correctly when toggling between light and dark themes
- [ ] Code blocks show a language label in the top-left corner when a language annotation is present
- [ ] Code blocks without language annotations do not show a label
- [ ] The copy button still works on all code blocks — copies plain text, not HTML with highlight markup
- [ ] Blog post content is enhanced: Ralph post has 2-3 TypeScript code blocks, Specs post has 1-2 YAML/TypeScript code blocks
- [ ] "Share this post" area appears below each blog post article
- [ ] "Copy link" button copies the correct canonical URL
- [ ] "Share" button appears on browsers supporting `navigator.share` (test on mobile if possible)
- [ ] All existing features still work: reading progress bar, table of contents, tag filtering, related posts, RSS feed, nav scroll spy, theme toggle, mobile hamburger
- [ ] Both light and dark themes render all components correctly
- [ ] No horizontal overflow on code blocks at mobile (375px) — `overflow-x: auto` on `.prose pre` handles this
- [ ] Page is responsive at mobile (375px), tablet (768px), and desktop (1280px)

**Acceptance Criteria:**
- All verification checklist items pass
- No regressions to existing functionality
- The site remains production-ready
- Syntax highlighting is visually professional — colours are readable and consistent

## Implementation Order

1. **Task 1** — Syntax highlighting integration (foundational — all other tasks depend on or benefit from this)
2. **Task 2** — Language labels on code blocks (depends on Task 1 — needs `rehype-highlight` to add `language-*` classes)
3. **Task 3** — Blog post content enhancement (depends on Tasks 1 & 2 — the code examples need to render with highlighting and labels)
4. **Task 4** — Share functionality (independent of Tasks 1-3, can be built in parallel)
5. **Task 5** — Build verification (depends on Tasks 1-4 completing)

Tasks 1 and 2 are sequential (2 reads classes set by 1). Task 4 is independent and can be built in parallel with Tasks 2-3. Task 5 is the final check.

## File Count

| Task | New Files | Modified Files | Total New |
|------|-----------|----------------|-----------|
| Task 1 | 0 | 3 (package.json, blog-post-content.tsx, globals.css) | 0 |
| Task 2 | 0 | 1 (code-block.tsx) | 0 |
| Task 3 | 0 | 1 (blog.ts) | 0 |
| Task 4 | 1 | 1 (share-post.tsx new, blog/[slug]/page.tsx modified) | 1 |
| Task 5 | 0 | 0 | 1 |

**1 new file, 6 modified files (some across multiple tasks).** Well within the 15-file limit. This is a focused polish sprint.

**New files:**
1. `src/components/share-post.tsx`

**Modified files:**
1. `package.json` (Task 1 — add `rehype-highlight`)
2. `src/components/blog-post-content.tsx` (Task 1 — add rehype plugin)
3. `src/app/globals.css` (Task 1 — syntax highlighting CSS variables and `.hljs-*` rules)
4. `src/components/code-block.tsx` (Task 2 — language label extraction and display)
5. `src/data/blog.ts` (Task 3 — enhanced post content with code blocks)
6. `src/app/blog/[slug]/page.tsx` (Task 4 — add SharePost component)

**Unique files touched:** 7 total (1 new + 6 modified). Lean sprint.

## Definition of Done

- [ ] `pnpm install && pnpm build` exits 0 with zero TS errors and zero ESLint warnings
- [ ] `rehype-highlight` added as a production dependency and installed
- [ ] Fenced code blocks with language annotations render with syntax-coloured tokens
- [ ] Syntax colours defined as CSS variables — adapt to light/dark theme toggle
- [ ] Keyword, string, comment, number, function, and type tokens are visually distinct colours
- [ ] No pre-built highlight.js CSS theme imported — all colours via custom CSS variables
- [ ] Code blocks with language annotations show a language label in the top-left corner (e.g. "TypeScript")
- [ ] Language label uses correct display name (capitalised appropriately)
- [ ] Code blocks without language annotations show no label
- [ ] Copy button still works on all code blocks
- [ ] Blog post 1 ("Building an Autonomous AI Developer Agent") contains 2-3 TypeScript code blocks
- [ ] Blog post 3 ("Specs Over Keystrokes") contains 1-2 YAML/TypeScript code blocks
- [ ] Blog post 2 ("Self-Taught to Senior Engineer") is unchanged or minimally changed
- [ ] Code examples are short (5-15 lines), relevant, and flow naturally in the prose
- [ ] `readingTime` values updated if post length changed meaningfully
- [ ] "Share this post" area appears below each blog post article with "Copy link" button
- [ ] "Copy link" copies the canonical post URL with "Copied!" feedback
- [ ] Native "Share" button renders only when `navigator.share` is available
- [ ] Both light and dark themes render all changes correctly
- [ ] Responsive at mobile (375px), tablet (768px), and desktop (1280px)
- [ ] No regressions to existing features (reading progress, TOC, tag filter, related posts, RSS, nav)
- [ ] Static export generates all expected files in `out/`

## What's Next (Sprint 12 Preview)

Potential future work: real testimonials to replace placeholders, custom domain setup, real headshot photo replacing the avatar placeholder, blog search functionality, a "Currently building" live status section, or additional blog posts expanding the content library.
