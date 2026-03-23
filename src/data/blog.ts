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
    slug: "docker-in-production-lessons-hetzner",
    title: "Docker in Production: Lessons from Running Services on Hetzner",
    date: "2026-03-20",
    excerpt:
      "What actually matters when running Docker containers in production — networking, health checks, volume management, and the things that only break at 2am.",
    tags: ["Docker", "DevOps", "Python"],
    readingTime: "6 min read",
    content: `## The Setup

Imperium — my personal knowledge management platform — runs as a multi-service architecture: Custodes (the watcher), Sigillite (the processing layer), Cockpit (the web UI), and n8n for workflow automation. Not Kubernetes. Not AWS ECS. A single Hetzner VPS with Docker Compose.

This is a deliberate choice. For personal projects and small-team services, a single server with Docker Compose is simpler, cheaper, and more debuggable than managed container services. When something breaks at 2am, I'd rather SSH in and read a log file than navigate a cloud console.

Here's what I've learned running it in production.

## Docker Compose Patterns That Actually Matter

The most important thing I got wrong early: not using health checks. Without health checks, \`depends_on\` is useless — Compose will start dependent services the moment the upstream container starts, not when it's actually ready to accept connections.

\`\`\`yaml
services:
  sigillite:
    image: sigillite:latest
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 15s
    environment:
      - DATABASE_URL=\${DATABASE_URL}

  cockpit:
    image: cockpit:latest
    restart: unless-stopped
    depends_on:
      sigillite:
        condition: service_healthy
\`\`\`

The \`condition: service_healthy\` is the key line. Without it, Cockpit starts before Sigillite's database migrations have run. With it, the dependency is real.

\`restart: unless-stopped\` is the right default for everything except one-off jobs. \`always\` will restart even after a manual \`docker stop\` — which makes debugging painful.

## Networking and Reverse Proxy

My reverse proxy of choice is Caddy. For small deployments, Caddy's automatic HTTPS via Let's Encrypt is a significant advantage over nginx — no certbot cronjobs, no manual certificate renewal, no nginx config syntax errors at 2am.

\`\`\`
{
    email matt@example.com
}

cockpit.example.com {
    reverse_proxy cockpit:3000
}

n8n.example.com {
    reverse_proxy n8n:5678
    basicauth {
        matt JDJhJDE0J...
    }
}
\`\`\`

All services run on a shared Docker network. Caddy reaches them by container name. Nothing is exposed on the host except ports 80 and 443. This is the right way to do it — no reason to expose service ports to the public internet.

## The Things That Only Break in Production

**Volume permissions.** If your container runs as a non-root user (which it should), and your mounted volume is owned by root on the host, your container can't write to it. This breaks silently — the app starts, logs look fine, then something fails at write time. Fix: set the correct UID in your Dockerfile and \`chown\` the volume directory on the host.

**Log rotation.** Without limits, Docker container logs fill the disk. Set log rotation in your \`docker-compose.yml\` or globally in \`/etc/docker/daemon.json\`.

\`\`\`bash
# /etc/docker/daemon.json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
\`\`\`

**Cron-based backups.** Production data needs backups. I run a simple script via cron that dumps the Postgres database and uploads to Backblaze B2.

\`\`\`bash
#!/bin/bash
set -euo pipefail

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="/tmp/imperium_\${TIMESTAMP}.sql.gz"

docker exec postgres pg_dumpall -U postgres | gzip > "$BACKUP_FILE"

# Upload to B2 (via rclone)
rclone copy "$BACKUP_FILE" b2:imperium-backups/

rm "$BACKUP_FILE"
echo "Backup completed: imperium_\${TIMESTAMP}.sql.gz"
\`\`\`

**Resource limits.** Without memory limits, a runaway process can OOM the entire host, taking down all services. Set \`mem_limit\` on anything that does significant processing.

## The Takeaway

For personal projects and small team services: a single VPS with Docker Compose is the right choice. It's simpler, cheaper, and more debuggable than any managed container service. You know exactly where your data is, you can SSH in and look at it, and there's no platform-specific complexity to navigate.

The time to move to Kubernetes is when you have multiple servers and a team to manage the infrastructure. Until then, Docker Compose on a good Hetzner box is more than enough.`,
  },
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
    slug: "600-tests-and-what-they-caught",
    title: "600 Tests and What They Actually Caught",
    date: "2026-03-10",
    excerpt:
      "Writing 600+ tests across Vitest, Cypress, Jest, and Maestro taught me that the value of testing isn't preventing bugs — it's enabling fearless refactoring.",
    tags: ["Testing", "TypeScript", "Engineering"],
    readingTime: "5 min read",
    content: `## The Number Is Vanity

600+ tests across multiple projects. Vitest, Jest, Cypress, Maestro, Supertest. I tracked this stat partly because the accumulation felt significant, and partly because it forced me to think about what I was actually testing.

The number is vanity. What matters is what those tests enable.

## The Testing Pyramid in Practice

The triangle holds: lots of unit tests, fewer integration tests, even fewer E2E tests. Not because it's a canonical diagram — because it reflects the cost and value of each layer.

Unit tests (Vitest, Jest) are cheap and fast. They're where business logic lives.

\`\`\`typescript
import { describe, it, expect } from "vitest";
import { allocatePortfolioWeights } from "./portfolio";
import { buildPortfolio } from "../test/factories";

describe("allocatePortfolioWeights", () => {
  it("weights sum to 1 within floating point tolerance", () => {
    const portfolio = buildPortfolio({ holdings: 5 });
    const weighted = allocatePortfolioWeights(portfolio);
    const total = weighted.reduce((sum, h) => sum + h.weight, 0);
    expect(total).toBeCloseTo(1.0, 10);
  });

  it("zero-value holdings receive zero weight", () => {
    const portfolio = buildPortfolio({ holdings: [{ value: 0 }, { value: 100 }] });
    const weighted = allocatePortfolioWeights(portfolio);
    expect(weighted[0].weight).toBe(0);
  });
});
\`\`\`

Factory-based test data is important here. If you're calling \`new Portfolio({ ... })\` in every test, you'll spend more time maintaining test setup than writing assertions. Factories let you express only what's relevant to the test case.

Integration tests (Supertest) cover API contracts. Not every endpoint — just the ones where the behaviour depends on how multiple layers interact. Auth middleware, database transactions, third-party integrations.

E2E tests (Cypress for web, Maestro for mobile) cover critical user flows. Not every interaction — just the ones where a breakage would be visible and costly.

## Testing Mobile: Why Maestro

SF Mobile has 5 Maestro flows per platform. I chose Maestro over Detox for one reason: it runs reliably in CI without simulator flakiness. Detox requires careful native setup and can fail intermittently due to timing issues. Maestro's YAML-based flows run against a running app with straightforward assertions.

\`\`\`yaml
appId: com.sfmobile.app
---
- launchApp:
    clearState: true
- tapOn: "Sign In"
- inputText:
    id: "email-input"
    text: \${TEST_EMAIL}
- tapOn: "Continue"
- assertVisible: "Enter your verification code"
- inputText:
    id: "otp-input"
    text: "123456"
- tapOn: "Verify"
- assertVisible: "Your Portfolio"
\`\`\`

The YAML format is readable by non-engineers. When a product manager asks "what does the sign-in flow test?", I can show them the file.

## What Tests Actually Caught

Not "button renders correctly" tests. Those catch nothing worth catching.

The tests that saved production:

**Financial calculations in stored procedures.** A weight rounding edge case in portfolio normalisation would have displayed incorrect percentages for holdings under 0.1%. A unit test with 15 different portfolio compositions caught it during development.

**Auth state machine edge cases.** An expired token during biometric re-authentication could leave the app in a state where the user appeared logged in but API calls were silently failing. An integration test that stepped through the token refresh flow during biometric auth caught this before it reached a user.

**API contract changes.** When the backend team updated a response schema, the Supertest integration tests failed on the first CI run. Without them, the mobile app would have broken silently for users with certain account types.

## The Real Value

Tests give you confidence to refactor.

The codebase with 150 test files is the one you can restructure without fear. You change something, run the suite, and know immediately if you broke something. The codebase with zero tests is the one everyone's afraid to touch — where "don't break what's working" is the de facto architecture principle, and tech debt compounds because nobody wants to risk a regression.

Stop writing tests to hit a coverage number. Write tests for the code that, if broken, would cause real problems. Then write enough of them that you trust the suite.

That's what 600+ tests actually taught me.`,
  },
  {
    slug: "shipping-cross-platform-fintech-react-native",
    title: "Shipping a Cross-Platform Fintech App with React Native",
    date: "2026-03-01",
    excerpt:
      "Lessons from building SF Mobile — a cross-platform wealth management app with biometric auth, real-time portfolios, and 4-language localisation.",
    tags: ["React Native", "TypeScript", "Mobile"],
    readingTime: "6 min read",
    content: `## The Challenge

Building SF Mobile meant shipping a production fintech app — cross-platform, iOS and Android — for wealth management clients who expect banking-grade polish. No prototypes, no "MVP with rough edges." Real money, real clients, high stakes.

I was the lead engineer on a greenfield project. Here's what I learned.

## Auth Is the Hard Part

Wealth management apps don't get to cut corners on authentication. SF Mobile needed MFA with three factors: email OTP, SMS OTP, and biometric (Face ID on iOS, fingerprint on Android). On top of that, device recognition, and JWT session management with platform-specific secure credential storage.

The biometric flow alone has more edge cases than most features combined: enrollment state, fallback to PIN, cancellation handling, and lockout after failed attempts.

\`\`\`typescript
interface AuthSession {
  userId: string;
  deviceId: string;
  tokens: {
    access: string;
    refresh: string;
    expiresAt: number;
  };
  biometricEnrolled: boolean;
  mfaVerified: boolean;
}

async function authenticateWithBiometric(
  session: AuthSession
): Promise<boolean> {
  if (!session.biometricEnrolled) return false;
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: "Confirm your identity",
    fallbackLabel: "Use PIN",
    cancelLabel: "Cancel",
  });
  return result.success;
}
\`\`\`

The key architectural decision: keep auth state in a dedicated service layer, not scattered across screens. Every screen that needs identity data reads from a single source of truth.

## The Build Pipeline

For a cross-platform app shipping to the App Store and Google Play, the deployment pipeline is half the product. I chose Expo + EAS Build, which gives you managed builds in CI without owning a macOS build server.

TanStack Query handles server state — it's the right abstraction for the fetch-cache-sync pattern you need when displaying portfolio values that update in real time. For the API layer, I used Kubb to generate typed clients directly from our OpenAPI spec. No hand-written API functions, no type drift between frontend and backend.

\`\`\`typescript
// kubb.config.ts
import { defineConfig } from "@kubb/core";
import { pluginOas } from "@kubb/plugin-oas";
import { pluginTanstackQuery } from "@kubb/swagger-tanstack-query";

export default defineConfig({
  input: { path: "./openapi.json" },
  output: { path: "./src/generated" },
  plugins: [
    pluginOas(),
    pluginTanstackQuery({ framework: "react" }),
  ],
});
\`\`\`

Every API call in the app is generated. Type errors surface at build time, not at runtime in a client's portfolio view.

## Testing at Scale

SF Mobile has 52 Jest + React Native Testing Library test files and 5 Maestro E2E flows per platform. I picked Maestro over Detox because the YAML-based test format is readable by non-engineers and runs reliably in CI without simulator flakiness.

\`\`\`yaml
appId: com.sfmobile.app
---
- launchApp
- tapOn: "Sign In"
- inputText:
    id: email-input
    text: \${TEST_EMAIL}
- tapOn: "Continue"
- assertVisible: "Enter your verification code"
\`\`\`

Maestro flows run on every PR. Catching a broken auth flow in CI before it reaches a client is table stakes.

## What Made It Work

Treating mobile like a real engineering project: typed APIs, CI/CD from day one, automated tests before shipping features. The temptation with mobile is to "move fast and polish later." In fintech, later never comes.

The stack — Expo, TanStack Query, Kubb, Maestro — was chosen for production reliability, not hype. Each tool earns its place.`,
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
    slug: "building-rag-pipeline-that-works",
    title: "Building a RAG Pipeline That Actually Works",
    date: "2026-02-05",
    excerpt:
      "What I learned building Athena — a personal AI assistant with ChromaDB vector search and Claude. The gap between RAG tutorials and production RAG is wide.",
    tags: ["AI", "Python", "RAG"],
    readingTime: "6 min read",
    content: `## The Problem I Was Solving

My personal knowledge was scattered across hundreds of markdown files, code comments, saved articles, and meeting notes. grep works for exact matches. It doesn't work when you remember the concept but not the phrase.

I wanted to ask "what did I write about chunking strategies last month?" and get an answer. That's a retrieval problem, and RAG (retrieval-augmented generation) is the right architecture for it.

So I built Athena.

## How RAG Works (The Real Version)

The tutorial version of RAG has four steps: chunk documents, embed chunks, store in a vector database, retrieve at query time. That's accurate but omits most of what matters in practice.

The actual pipeline:

1. **Ingest** — read source documents (markdown, PDFs, code files)
2. **Chunk** — split into overlapping windows preserving sentence boundaries
3. **Embed** — convert text to vectors using an embedding model
4. **Store** — write vectors + metadata to ChromaDB
5. **Retrieve** — embed the query, find nearest vectors by cosine similarity
6. **Synthesize** — pass retrieved chunks as context to Claude, get a grounded answer

The retrieval + synthesis step is where the system either delivers or fails:

\`\`\`python
def query(question: str, n_results: int = 5) -> str:
    collection = client.get_collection("athena")
    results = collection.query(
        query_texts=[question],
        n_results=n_results,
        include=["documents", "metadatas", "distances"],
    )

    chunks = results["documents"][0]
    sources = [m["source"] for m in results["metadatas"][0]]
    distances = results["distances"][0]

    # skip retrieval if best match is too distant
    if distances[0] > RELEVANCE_THRESHOLD:
        return "I don't have relevant notes on that topic."

    context = "\\n\\n---\\n\\n".join(
        f"[{src}]\\n{chunk}" for src, chunk in zip(sources, chunks)
    )

    response = anthropic.messages.create(
        model="claude-opus-4-6",
        max_tokens=1024,
        messages=[{
            "role": "user",
            "content": f"Answer using only the context below.\\n\\n{context}\\n\\nQuestion: {question}"
        }],
    )
    return response.content[0].text
\`\`\`

The \`distances\` field matters. If the nearest match has a distance above your threshold, the document probably doesn't contain the answer — and you should say so rather than letting the LLM confabulate.

## Chunking Is Where Most Implementations Break

Naive chunking — split every N characters — produces chunks that cut mid-sentence, split code blocks, and lose the surrounding context that makes a passage meaningful.

What actually works: overlap windows with sentence-boundary awareness and metadata preservation.

\`\`\`python
def chunk_document(text: str, chunk_size: int = 512, overlap: int = 64) -> list[dict]:
    sentences = sent_tokenize(text)
    chunks = []
    current, current_len = [], 0

    for sentence in sentences:
        words = len(sentence.split())
        if current_len + words > chunk_size and current:
            chunks.append(" ".join(current))
            # keep overlap sentences for context continuity
            overlap_sentences = current[-3:]
            current = overlap_sentences
            current_len = sum(len(s.split()) for s in overlap_sentences)
        current.append(sentence)
        current_len += words

    if current:
        chunks.append(" ".join(current))

    return [{"text": chunk, "index": i} for i, chunk in enumerate(chunks)]
\`\`\`

The overlap ensures a concept that spans a chunk boundary still gets retrieved when queried. Without it, you'll have invisible gaps in coverage.

## What Tutorials Don't Tell You

**Embedding drift.** If you re-embed documents after changing your embedding model, your existing vectors become incomparable. Keep the model version in your metadata and re-index when you upgrade.

**Stale documents.** A file you ingested six months ago may have changed. Track file modification times and re-embed on change.

**Relevance thresholds matter more than recall.** Better to return 2 highly relevant chunks than 10 mediocre ones. Tune your distance threshold empirically against real queries.

**The LLM often already knows.** For factual questions about well-documented topics, retrieval adds noise, not signal. Build an escape hatch for when retrieval confidence is low.

## Practical Takeaways

Start simple: one collection, one embedding model, no re-ranking. Measure retrieval quality — are the right chunks coming back? — before optimising generation quality. ChromaDB is fine for personal scale. You don't need a distributed vector database for a few thousand documents.

The gap between "RAG tutorial" and "RAG that's actually useful" is mostly just measurement. Once you know what's failing, fixing it is straightforward.`,
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
