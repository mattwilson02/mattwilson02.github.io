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
    slug: "ralphs-got-rails",
    title: "Ralph's Got Rails",
    date: "2026-09-01",
    excerpt:
      "An autonomous agent built a complete tax compliance application and got every number right. Two things had changed since the build before it, and only the evidence ledger could tell me which of them mattered.",
    tags: ["AI", "Agents", "Governance"],
    readingTime: "5 min read",
    content: `Ralph built an entire tax compliance application. 14 sprints, unsupervised, in a domain where being wrong is expensive and quiet.

I went through the finished thing by hand afterwards, hunting for defects. Every rate, every threshold, every statutory form: correct. Zero correctness bugs in the whole build.

The build before it had fifteen.

## Two things changed, not one

I want to be straight about this, because it is the part a post like this usually skips.

Between the two builds I added a harness: control-flow gates, risk-based autonomy, scope containment, a per-sprint evidence ledger, and GitHub's own machinery on the repo side. That took two months.

I also upgraded the models, eight hours before the second run started.

So I cannot hand you a clean experiment. Two variables moved. Anyone who tells you a result like this proves their tooling, on one project, with one evaluator, is selling you something.

What I can tell you is what the evidence trail showed, because that is the part that does not depend on which variable you believe.

## What the harness actually caught

Across the 14 sprints, 8 shipped clean and 6 stopped and escalated to a human rather than guessing. Every stop was resolved, and all 14 sprints' work reached main.

That is the part worth pointing at, and it does not need a hypothetical to make it. Without those gates the six carry on quietly, and I meet them at the end as wrong work built on top of wrong work. Which is precisely what the build before it did: 19 sprints, every check green, and fifteen correctness bugs that only surfaced when I went through the finished thing by hand.

One of those stops is the one worth reading. Sprint 12 changed 56 files outside the scope its spec declared. It was stopped, escalated, re-run, and shipped clean.

That is a specific, checkable thing the control plane did. It did not make the model cleverer. It made an overreach visible before it merged.

## What the ledger then told me about my own harness

Ten escalation reasons across those six sprints. I read them back nine days later because the ledgers were still on disk.

Four were a 45 minute wall-clock timeout killing a sprint that was working fine. Three were my auditor's own output failing to parse, from a greedy regex that broke on trailing prose. Two were the fix loop giving up after one of its three permitted attempts.

Nine of ten were mine, not the model's.

There was a better one hiding underneath. Sprint 1's ledger records zero verification checks *run*. Not zero passed. The project scanner read the directory once at launch, found no test script because there was not one yet, and cached that. Sprint 1 then wrote the test script. Every sprint after it still believed there was nothing to run.

I only know any of that because each sprint wrote down what it did at the time. Without the ledger, "six sprints escalated" is a fact about the agent. With it, it is a fact about me.

## What shipped

The scanner re-reads the project at the top of every sprint. The timeout is now a backstop behind an effort budget and a stall detector, so a slow but advancing sprint hits none of them. The audit parser is brace-balanced instead of greedy.

And the judge stopped taking Ralph's word for anything.

It used to score six of its nine checks out of Ralph's own evidence ledger. A ledger written by the thing being judged is a statement, not evidence. It now verifies that the ledger names the branch it is attached to, that every commit it cites is in the pull request, that CI's own check runs agree, and it recomputes scope containment from the PR's file list rather than reading the agent's account of it.

The joke is that the judge could never read its evidence at all. Ralph wrote \`.ralph/\` into \`.gitignore\`, so the ledger was never committed, so it did not exist in CI's fresh checkout. Every judge run on that project failed, for the one reason it was unable to report.

## What is left

The application was correct and its first screen was overloaded: 2,769 visible words on one page, and 48 internal specification references rendered into the interface, because the spec asked for traceability and the builder gave it literally.

That is a fixable finding, and it is a better problem than fifteen bugs. But it marks the boundary precisely.

Every gate I have built decides whether work proceeds. None of them decide what reaches the screen. That is the next one, and I do not yet know what it looks like.

## Try it

    npx ralph-agent@next
    ralph init --governance

[npmjs.com/package/ralph-agent](https://www.npmjs.com/package/ralph-agent)`,
  },
  {
    slug: "athena-product-overview",
    title: "Athena: A Personal AI That Actually Knows You",
    date: "2026-03-23",
    excerpt:
      "A deep dive into Athena, a personal AI built on a living knowledge graph that reasons across your goals, relationships, finances, and decisions.",
    tags: ["AI", "Python", "Product"],
    readingTime: "8 min read",
    content: `Every AI assistant I've used has the same problem: it doesn't know anything about me. I can have the most sophisticated model in the world on the other end, and it still starts every conversation from zero. No context about my goals, my commitments, who matters to me, what I'm working through. Just a blank slate that happens to be articulate.

I wanted something different. Not a smarter chatbot. An AI that actually builds up a picture of my life over time, reasons across it, and gives advice that's informed by real context. So I started building Athena.

## The Knowledge Graph

The core idea is simple: every conversation feeds a living knowledge graph. Mention a person, a goal, a financial decision, a fear, and Athena captures it as a structured node and connects it to everything related. Over time this becomes a map of your life. 180+ nodes so far across seven domains: Self, People, Knowledge, Life, Planning, Places, Finance.

This isn't note-taking. The graph is queryable. Ask "what am I neglecting right now?" and Athena can actually answer that. It knows your active commitments, your recent patterns, what's overdue. Ask about a person and it pulls up not just who they are but how the relationship has been trending, when you last mentioned them, what context they appear in.

## The Part That Changed Everything

The feature that surprised me most wasn't retrieval or the graph itself. It was conflict detection.

I built what I call the Guardian Protocol. Before Athena responds, it checks whether what you just said contradicts your stated goals, values, or habits. Say you're committed to saving money and then propose an expensive trip, and Athena flags it. Not aggressively. It follows a defined escalation: flag the conflict, explain why it matters, challenge you to reconcile it, then accept your decision if you push back. One challenge, no nagging.

This turned out to be the thing that makes Athena feel fundamentally different from a chatbot. It has a position. It remembers what you said you wanted and holds you to it. Hard conflicts get direct pushback. Soft tensions get a lighter mention. You can always override it, but you have to consciously choose to.

Tradeoff awareness works similarly. Propose a new commitment when you're already stretched across multiple goals? Athena surfaces the full picture and asks what gives to make room. It doesn't just say "great idea". It asks whether you've thought about what you're trading.

## How It Adapts

Not every message needs the same treatment. Athena classifies each message and shifts its approach. A quick factual question gets a direct answer, in mirror mode. Planning a decision gets advisor mode. Contradicting yourself triggers guardian mode. And for big life questions like career changes, relationship decisions and identity shifts, it enters dialectic mode, where it challenges your assumptions instead of agreeing with them.

This matters because the wrong mode at the wrong time is worse than no AI at all. When you're burned out and venting, you don't want strategic analysis. When you're making a major decision, you don't want cheerful agreement. Athena reads the room from message length, timing and tone patterns, then adjusts.

State inference feeds into this too. Short, terse messages signal stress. 2am activity flags sleep issues. The AI won't pile on when you're running low.

## Memory That Actually Works

Most AI memory is flat. Everything has equal weight. Athena uses permanence scoring. Core values and identity nodes outweigh yesterday's task list when deciding what context to inject. Your fundamental beliefs stay present even when tactical noise piles up.

This has a real consequence: attempting to change a core value triggers a challenge ladder. Five escalating steps. You have to earn the change. This sounds aggressive but it's the right call. Your values shouldn't shift because you had a bad Tuesday.

On the retrieval side, queries get classified by intent. A broad temporal question ("what happened this month?") pulls up to 15 nodes with compact summaries. A focused question about a specific person uses metadata-filtered vector search. The retrieval strategy adapts to what you're actually asking, rather than running top-5 similarity every time.

## Accountability

This is the other feature that makes Athena feel real. Commitment tracking, habit streaks, consequence surfacing. "You said you'd do X by Friday." Friday passes, Athena surfaces it and shows the downstream impact. Broken streaks and overdue deadlines don't silently disappear.

It also monitors what I call fundamentals: movement, sleep, nutrition, connection, purpose, financial stability. Neglect one for two weeks and Athena brings it up proactively. Not a notification. A conversation about why it matters and what's getting in the way.

## The Stack

Python and Flask for the backend. NetworkX for the knowledge graph. ChromaDB for vector storage and semantic search. Claude API for the reasoning layer. Svelte 5 for the frontend, running streaming chat with a force-directed graph visualisation where you can see all your nodes and their connections. Docker for deployment. And Ralph, my autonomous sprint runner, is handling the remaining development work.

Every line of code, every architectural decision, solo-built.

## Where It's Going

Right now Athena thinks and plans. The next stage is action: calendar integration, notifications, layered scheduling, voice ingestion, what-if simulation. Moving from "here's what you should consider" to "here's what's on your plate today and here's what I'd move."

The long-term vision is depth of context as the product. Month one, Athena gives decent advice based on what you've told it. Month six, it catches things you didn't think to ask about. Year two, it understands you better than most people in your life.

This isn't a second brain. Tools like Notion and Obsidian store information but don't reason about it. Athena thinks with your knowledge. It's a second mind.`,
  },
];
