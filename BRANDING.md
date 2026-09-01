# Branding

Everything decided about how this brand looks and sounds, in one place.

**This file is a snapshot, not a changelog.** It states what is true now. When a
decision changes, rewrite the line so it reads as though it always said that —
git holds the history, and the reasoning goes in
`~/development/business-log/log/`. Never append a dated correction here.

**Nothing in this file was invented.** Every entry traces to the code, to a
decision in the business log, or to something Matt said. Where a decision has
not been made, it sits in [Open](#open) and says so.

---

## 1. What the brand has to do

The site is **the substitute for a pre-existing relationship** — the place the
proof lives between a post someone reads and the Calendly link they click. It is
not a portfolio and not a CV. Evidence for that framing: the site was live and
Jacob went round it entirely.

Two consequences that drive every decision below:

- **Sell Matt, not software.** The masthead is the name, at full size. The
  service category is demoted to a small line above it.
- **The real reader is often not the person on the page.** It is whoever they
  have to convince. That reader's question is *"what happens if this goes
  wrong?"*, not *"can he do it?"* — which is what `How This Works` exists to
  answer, and why every point in it is written to survive being lifted out on
  its own.

Employability material — Experience, Skills, Certifications, Testimonials,
Projects — is in `/archive`. It answered a question the buyer is not asking.

---

## 2. Verbal identity

### The fixed strings

| Slot | Current | Lives in |
|---|---|---|
| Name / masthead | Matt Wilson | `src/data/hero.ts` |
| Category line | Bespoke software development and automations | `src/data/hero.ts` |
| Positioning sentence | You know what the business needs. I take the idea the rest of the way. | `src/data/hero.ts` |
| Page title | Matt Wilson, independent software engineer | `src/app/layout.tsx` |
| Meta description | The positioning sentence, verbatim | `src/app/layout.tsx` |
| CTA | Book a call → `calendly.com/mattwilsontech/discovery` | `src/data/navigation.ts` |

**The copy lives in `src/data/*.ts` and nowhere else.** Do not restate it here —
one home per thing. Each of those files carries the reasoning for its own
section in a header comment, including what was rejected and why.

### Who writes it

🔴 **Matt writes all brand copy. It is not generated.** His reasoning:

> *"when you start outsourcing how to resolve your identity, you don't really
> have one, you just have borrowed opinions."*

The standing instruction from 15 Aug is that positioning, comms and brand voice
are never-generate domains, and that includes not critiquing them by default.
Retrieval, verification and questions — not drafting, and not a numbered audit
with a fix attached to every line.

### Rules the copy already follows

Each of these came out of a specific correction, and each is load-bearing:

| Rule | Why |
|---|---|
| **Never write "risk"** in the hero | It promises something `How This Works` defines precisely. *"What risk am i carrying, liability wouldnt work there."* |
| **"Burden" belongs to the Wall** | It is that section's word. Repeating it elsewhere spends it twice |
| **Never name an industry** | The buyer is sector-agnostic. Naming one narrows the promise and is unsupported at n=1 |
| **Never say "tab"** | Implies web-only, and narrows below what the business does |
| **No insurance figures** | Keane's logic: stating terms creates an obligation and buys nothing. "Insured" reassures; a number invites scrutiny of the number |
| **No preambles** | The 17 Aug intro line was deleted, not relocated — *"completely unnecessary"*. Sections announce nothing; they just start |
| **Don't tell the reader their problem was the easy part** | Why *"The idea isn't the hard part"* was replaced: *"the title undermines the client. Ideas are hard too."* |
| **Second person, and imply ownership rather than state it** | An earlier draft said "the IP transfers on completion", which contradicted both the terms section and the SoW. Both transfer phase by phase |
| **Cutting beats adding** | *"Sometimes cutting is better than adding to be fair."* |

### 🚫 The em dash

**Banned in metadata, and to be avoided in body copy.** Decided 18 Aug — it is
the single most recognisable machine-writing tell, and it was in the title, the
OG title, the Twitter title, the image alt, and again inside the description.

- Title suffixes use a middot: `Writing · Matt Wilson`
- Descriptive appositives use a comma, or a rewrite

The wider point Matt was making is about **shape as much as punctuation**:
`Name — Category` is an SEO template, not something a person writes about
themselves.

---

## 3. Visual identity

Dark only. **There is no light theme**, and the palette lives in
`src/app/globals.css` and nowhere else.

### Colour

| Token | Value | Job |
|---|---|---|
| `--color-background` | `#0a0a0a` | Base sections |
| `--color-band` | `#0f1013` | The alternating section, one step up |
| `--color-card` | `#16171b` | Raised objects only — cards, panels, tiles |
| `--color-card-hover` | `#1c1d22` | Hover on a raised object |
| `--color-foreground` | `#ededed` | Body and headings |
| `--color-muted` | `#a3a3a3` | Secondary copy |
| `--color-border` | `#262626` | Every border |
| `--color-accent` | `#2563eb` | The only accent. Links, CTAs, rules, numerals |
| `--color-accent-hover` | `#1d4ed8` | Accent hover |

**The three tones have distinct jobs and the distinction is the system.** Base
and band alternate down the page so the eye gets a regular beat. A raised object
is always `--color-card`, which is lighter than either section tone, so it lifts
off whichever band it lands on. Before 17 Aug every section was base except one,
which read as an accident rather than a rhythm.

### Typography

**Inter throughout.** Loaded via `next/font/google`, variable `--font-inter`.

🔴 **Monospace on this site means "this is code".** It is reserved for code
blocks and inline code in prose, and must not be borrowed for small labels —
doing so was rejected on 17 Aug on two grounds: it is someone else's voice, and
it collides with a meaning the site already assigns.

The house small-label treatment is: **Inter, semibold, uppercase, `0.18em`
tracking**, in accent or muted. Used for the hero eyebrow, `WHAT WE COVER`, and
the numerals in `How This Works`.

⚠️ **The image assets do not follow this rule.** See [Open](#open).

### Layout

| Decision | Detail |
|---|---|
| Content width | `max-w-5xl`, `px-6`. Prose sits narrower |
| Section rhythm | `py-14 md:py-16`, alternating base/band — `src/components/section.tsx` |
| Hero | Exactly one viewport minus the nav: `min-h-[calc(100svh-var(--nav-h))]`. Content-sized before 17 Aug, which let the next section bleed into first paint and spoiled the Wall as a reveal |
| Nav | A bordered pill around the links; the header itself is transparent. **Matt's call: the emphasis is on the tabs, not a full-width grey band across the top.** From `md` up only — a phone has no pill to carry a surface, so below `md` the bar takes a backdrop on scroll |
| `--nav-h` | `76px`, `70px` from `md`. **Measured, not guessed.** The hero subtracts it, so an error here shows the next section above the fold |
| Touch targets | **44px minimum** on anything tappable |
| Motion | Framer Motion reveals, and everything respects `prefers-reduced-motion`. The hero is deliberately unanimated with no client JS, so the type is there on first paint |

### The mark

A pixel-drawn **MW** monogram in `--color-accent`, on near-black. Used in the
favicons, the apple touch icon and the OG card. It is the only element of the
identity that is a mark rather than type, and it has been in use since the
beginning.

---

## 4. Assets

Everything in `public/`.

| File | What it is | Status |
|---|---|---|
| `favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png` | MW monogram, accent on near-black | Current |
| `apple-touch-icon.png` | 180×180 monogram | Current |
| `og-image.png` | 1200×630 share card — monogram, `Matt Wilson`, `Bespoke software and automations`, `mattwilson.tech`. Pixel font | ⚠️ Wording differs from the site's category line, which says *development and* automations. See [Open](#open) |
| `og/blog/*.png` | Per-post and per-tag share cards, generated by `scripts/generate-og-images.ts` | Generated at build, and **stale cards are pruned in the same pass** so the folder always matches live content. Carry `Blog · Matt Wilson` |
| `headshot.png` | Used by the About component | ✅ Rendered. `/about` is live |
| `linkedin-cover.png` / `.svg` | LinkedIn banner | 🔴 He is not happy with how it reads. Gates the launch |
| `matt-wilson-resume*.*` | Résumés, including the Phantom one | ✅ **Resolved.** Gitignored and untracked, so they stay local and are never published from the site |
| `site.webmanifest` | PWA manifest | ✅ **Current.** `name` is `Matt Wilson, independent software engineer`, `background_color` is `#0a0a0a`, `theme_color` is the accent |

### Generating

- Blog OG cards regenerate on every build (`prebuild` → `generate-og-images.ts`)
- `og-image.png` is static and hand-made; nothing regenerates it
- Feeds and sitemap regenerate on build (`generate-feeds.ts`)

---

## 5. Metadata

Set in `src/app/layout.tsx`. Title, description, Open Graph, Twitter card and
JSON-LD.

**The metadata is copy and goes stale like copy.** On 18 Aug it was still
carrying the hero as it read before the 17th — *"you know what the business
needs **built** … to something it can run on"* — in three places plus the OG
image alt, both phrases having been cut the day before. **When a headline
changes, the metadata changes in the same commit.**

Constraints worth knowing when writing a title: a browser tab truncates around
30 characters, Google around 60.

The JSON-LD is `@type: Person` with `makesOffer`. It previously carried
`seeks: Full-stack software engineering opportunities`, which stayed live for
months after the decision to stop looking for a job. **Structured data is
invisible, so it rots unwatched — check it whenever the positioning moves.**

Dropped from the description on 18 Aug and not yet replaced anywhere in
metadata: **"Fixed price, delivered in phases."** That was the only place the
phased/fixed-price framing appeared, and per the strategy the phasing *is* the
product.

---

## Open

Decisions not made. Nothing here should be treated as settled.

### 🔴 Do the image assets follow the site, or keep the mono?

**Matt's framing, and it is the load-bearing part: all or none.** A
half-converted set is the only clearly wrong answer.

- **For keeping mono:** it has been the identity since the beginning, and the
  pixel MW mark is the only asset anyone would recognise a second time. Inter on
  near-black is what every developer portfolio looks like.
- **For converting:** `hero.tsx` records that on this site monospace means "this
  is code", and the buyer is non-technical. The OG card is the first thing an
  internal champion sees in a feed, and a pixel font reads *developer* rather
  than *someone who absorbs the risk*.
- **Possible middle:** the mark stays mono, the words go Inter. Untested.

Deliberately parked, 18 Aug — this is the next branding decision.

### Also open

| | |
|---|---|
| LinkedIn cover | Updated and now on-brand — but **the avatar sits over the text on mobile**, so it reads "Bespoke software … ent and automations". LinkedIn always parks the photo bottom-left; the fix is in the image |
| X cover | **The text isn't bordered on mobile** — spotted 18 Aug, after the first thread went out. Fix later |
| `og-image.png` wording | Says *"Bespoke software and automations"*; the site's category line says *"Bespoke software development and automations"* |
| Nav consistency | Whether the wordmark and CTA should appear on every page rather than being hidden on home |
| `How This Works` | Has no discovery step, so the page and the funnel disagree |
| Footer email | Not resolved |

---

## Where the history lives

- **Why a decision was made, and what it replaced** — `~/development/business-log/log/`
- **Why a section says what it says** — the header comment in its own `src/data/*.ts` file
- **Current state of the business** — `~/development/business-log/STATUS.md`
