export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  readingTime: string;
  content: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "building-an-autonomous-ai-developer-agent",
    title: "Building an Autonomous AI Developer Agent",
    date: "2026-03-15",
    excerpt:
      "How I built Ralph — an autonomous agent that reads your codebase, generates sprint specs, and ships features end-to-end without manual orchestration.",
    tags: ["AI", "TypeScript", "Developer Tools"],
    readingTime: "7 min read",
    content: `## The Problem

Every developer using AI tools today runs the same loop: open a chat window, paste some code, get a suggestion, copy it back, run tests, find an error, paste the error back, get another suggestion. The model is doing real work, but the developer is the glue — manually orchestrating the entire cycle.

I got tired of being the glue.

The question I kept returning to: what would it look like if the AI could run the full pipeline itself? Not just suggest a function — but read the codebase, understand the task, write the code, run the build, fix the failures, and ship a PR?

That question became Ralph.

## What Ralph Does

Ralph is a zero-config autonomous sprint runner. You point it at a repository and give it a spec. It handles everything else:

1. **Codebase ingestion** — reads your directory structure, key files, and recent git history to build a working model of the project
2. **Spec generation** — if you don't have a spec, it interviews you and generates one
3. **Code generation** — writes the implementation, following patterns it observed in your existing code
4. **Verification** — runs your build, lint, and test commands; captures failures
5. **Auto-fix loop** — if verification fails, it reads the errors and tries again (up to a configurable retry limit)
6. **PR creation** — opens a pull request with a clean commit and description

The agent that built this website — including this very blog post you're reading — is Ralph.

Every agent response conforms to a typed schema. No free-form prose to parse, no ambiguity about what the agent intended.

\`\`\`typescript
interface SprintResult {
  files: Array<{
    path: string;
    action: "create" | "modify" | "delete";
    content: string;
  }>;
  commands: string[];
  commitMessage: string;
}
\`\`\`

## The Architecture Decision That Mattered Most

Early prototypes used a single model for everything. That was wrong.

The insight was that different parts of the pipeline have fundamentally different requirements:

- **Strategic decisions** (how should this feature be architectured? what files need to change?) require deep reasoning and context retention. Cost matters less here because you make these decisions rarely.
- **Code generation** (write this component, implement this function) needs speed and instruction-following. You make these decisions constantly in a sprint.
- **Error analysis** (why is this TypeScript error happening?) needs concise, fast responses.

The solution was multi-tier LLM routing: Opus handles strategy and spec generation, Sonnet handles code generation and error analysis, and a lightweight model handles the scaffolding work between calls.

The routing is explicit and typed. Each task type maps to a model and temperature that matches the cognitive demand.

\`\`\`typescript
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
\`\`\`

This cut runtime significantly while improving output quality — not just cost optimization, but accuracy optimization. Forcing Sonnet to do architectural reasoning was actually making it worse.

## What I Learned About Agentic Systems

**Context is everything.** The single most important factor in output quality is how much relevant context the agent has before it starts writing. I spent more engineering effort on context ingestion than on the generation loop itself. An agent with good context and a mediocre model beats an agent with poor context and the best model.

**Structured outputs beat free-form.** Early versions let the agent respond in prose and I parsed it out. That was brittle. Switching to structured JSON schemas for every agent response — \`{ files: [{path, content}], commands: string[] }\` — made the system dramatically more reliable.

**The retry loop is where you learn.** The first working implementation of any feature is almost never the fifth attempt at a single LLM call. It's the second attempt after reading a real compiler error. Design for failure and iteration from the start.

**Determinism matters more than you think.** Non-deterministic agents are hard to debug and hard to trust. Ralph pins its prompts, seeds where possible, and logs every LLM call to a structured trace file. When something goes wrong, I can replay the exact sequence.

## What's Next

Ralph currently handles TypeScript, Python, Go, and Rust projects. The next major piece is eval harnesses — the ability to verify that a feature actually works semantically, not just compiles. That's the gap between "it builds" and "it's correct."

If you want to see the code or follow along, it's on GitHub.`,
  },
  {
    slug: "self-taught-to-senior-engineer",
    title: "Self-Taught to Senior Engineer in 4 Years",
    date: "2026-02-20",
    excerpt:
      "The honest account of going from zero programming knowledge to shipping production fintech — what actually mattered, what didn't, and what's still driving me.",
    tags: ["Career", "Learning"],
    readingTime: "5 min read",
    content: `## How It Started

In 2022 I got interested in Bitcoin. Not as a trade — as a technology. I started reading about how it actually worked: UTXOs, the scripting language, consensus rules, why the 21 million cap is enforced. That led to the whitepaper, which led to reading about distributed systems, which led to: I want to understand this at the code level.

I had no programming background. I opened a Python tutorial and started at line one.

## What Worked

**Reading real codebases early.** The tutorial phase lasted maybe three months before I decided it was making me worse, not better. Tutorials teach you to recognize patterns in controlled environments. Real codebases teach you to navigate ambiguity, understand constraints, and read code that wasn't written for you to understand.

I cloned repositories I cared about and read them. When I didn't understand something I looked it up specifically. This is slower than a tutorial at first and much faster after month six.

**Shipping under pressure.** The gap between "I can write code that works in isolation" and "I can contribute to a production system" is enormous. The only way I found to close it was to be in situations where something broke and I had to fix it, where a deadline was real, where someone else depended on what I shipped.

I found those situations by being direct about what I wanted: real work, real stakes, feedback from people who'd been doing this longer than me. I was lucky enough to find that at Stonehage Fleming.

**Picking a direction and going deep.** TypeScript and Node.js for backend, React for frontend. I didn't try to learn Python web frameworks and Ruby and Java concurrently. I went deep on one stack until I understood why things were done the way they were, then the second stack was mostly just syntax.

## What Didn't Work

**Tutorial hell.** I spent about six weeks bouncing between courses before I stopped. The problem with tutorials is they give you the sensation of learning without the substance. You follow along, it works, you feel good. Then you close the tab and try to build something and realise you absorbed almost nothing.

**Chasing frameworks.** In 2022-2023, a new JavaScript framework launched roughly every two weeks (this felt accurate). I wasted time tracking them. The frameworks that matter are the ones used in production at companies you want to work at. Everything else is noise.

**Waiting until I was "ready."** There's no such thing. I applied for my first engineering role before I felt ready. I shipped my first production code before I felt ready. The feeling of readiness is not a signal that you're ready — it's just the absence of recent failure. Recent failure is how you learn.

## Where I Am Now

Four years in, I've shipped production fintech, I'm building autonomous AI tooling, and I'm working toward contributing to Bitcoin Core — which is where this started. The Bitcoin Core goal is still years away. The codebase is large, the review bar is high, and C++ at that level requires genuine depth. I'm working on it.

The self-taught path is real, but it's not a shortcut. It took four years of consistent work, deliberate practice, and a lot of shipped code to get here. The advantage isn't speed — it's that you actually understand what you're building and why, because no one handed it to you.`,
  },
  {
    slug: "specs-over-keystrokes",
    title: "Specs Over Keystrokes: How AI Changes What Engineers Do",
    date: "2026-01-10",
    excerpt:
      "The engineering job is shifting from writing code to writing precise specifications and evaluating output. Here's what that looks like in practice — and why it demands more rigour, not less.",
    tags: ["AI", "Engineering", "Opinion"],
    readingTime: "5 min read",
    content: `## A Concrete Example

This website was built by an AI agent. I wrote the specs. The agent wrote the code, ran the builds, fixed the failures, and opened the PRs. I reviewed diffs, caught issues, and wrote the next spec.

That's not a future projection. That's what happened, sprint by sprint, over the last two months. The agent (Ralph, which I also built) is running TypeScript Next.js code it's never seen before and shipping working features against a design spec I wrote.

The most important work I did wasn't typing code. It was writing specs precise enough that the agent could execute them correctly.

## What Precise Specs Actually Look Like

A vague spec produces vague output. "Add a blog section" will get you something that technically meets the description and misses everything that matters: the existing component patterns, the theming conventions, the animation system, the SEO requirements, the exact section ordering.

A precise spec eliminates ambiguity at the decision points that matter. It says:

- Here's the file to create and why
- Here's the interface to define
- Here's the exact pattern to follow from an existing component
- Here are the acceptance criteria that define done

\`\`\`yaml
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
\`\`\`

That level of precision eliminates ambiguity at the decision points. The agent doesn't have to guess what "active pill styling" means — it's specified.

Writing that spec requires you to understand the system deeply enough to make every decision before the agent starts. If you don't understand it, you'll write an underspecified spec, and the agent will fill the gaps in ways that seem reasonable in isolation but diverge from what you actually wanted.

The spec is the engineering work. The code is the output of the spec.

## Why This Demands More Rigour, Not Less

A common concern: if AI writes the code, does the engineer need to understand the code? My answer from building with agents: more than before, not less.

When you write every line yourself, you catch problems as you go. You write a function, notice a bug, fix it. The understanding is embedded in the process.

When an agent generates code, you're reviewing a diff, not writing a draft. To review well — to catch the subtle type error, the missing edge case, the pattern violation — you need to understand the system at least as well as if you'd written it yourself. You need to know what correct looks like before you can identify what's wrong.

The engineers who will be most effective with these tools are the ones who can write genuinely precise specs and who have the technical depth to evaluate the output. Those are both hard skills. Neither gets easier with AI assistance.

## What Shifts

The ratio shifts. The allocation of time changes. More time thinking, specifying, reviewing. Less time on the mechanical act of typing code. This is good — the mechanical typing was the least intellectually interesting part of the job.

What doesn't change: you need to understand what you're building. You need to be able to read code and evaluate it accurately. You need to make architectural decisions. You need to know what correct behaviour looks like.

What does change: the leverage. A single engineer with strong spec-writing and evaluation skills, working with capable agents, can ship what previously required a team. Not because the work is easier, but because the bottleneck is no longer typing speed — it's thinking speed.

## The Opportunity

I'm not arguing AI is going to replace engineers. I'm arguing that the job is changing shape, and the engineers who understand that are ahead. Writing specs for autonomous agents requires exactly the skills that make someone a good senior engineer: system thinking, precision, clarity about requirements, ability to evaluate outputs against intent.

If you've been building software by typing every line yourself, the transition is jarring. If you approach it as a new way to apply the same underlying skills — think precisely, specify completely, evaluate rigorously — it's one of the most interesting periods to be building software.

I'm building with these tools every day. The work is harder and more interesting than it was two years ago.`,
  },
];
