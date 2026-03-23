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
    slug: "athena-product-overview",
    title: "Athena: A Personal AI That Actually Knows You",
    date: "2026-03-23",
    excerpt:
      "A deep dive into Athena — a personal AI built on a living knowledge graph that reasons across your goals, relationships, finances, and decisions.",
    tags: ["AI", "Python", "Product"],
    readingTime: "8 min read",
    content: `Every AI assistant I've used has the same problem: it doesn't know anything about me. I can have the most sophisticated model in the world on the other end, and it still starts every conversation from zero. No context about my goals, my commitments, who matters to me, what I'm working through. Just a blank slate that happens to be articulate.

I wanted something different. Not a smarter chatbot — an AI that actually builds up a picture of my life over time, reasons across it, and gives advice that's informed by real context. So I started building Athena.

## The Knowledge Graph

The core idea is simple: every conversation feeds a living knowledge graph. Mention a person, a goal, a financial decision, a fear — Athena captures it as a structured node and connects it to everything related. Over time this becomes a map of your life. 180+ nodes so far across seven domains: Self, People, Knowledge, Life, Planning, Places, Finance.

This isn't note-taking. The graph is queryable. Ask "what am I neglecting right now?" and Athena can actually answer that — it knows your active commitments, your recent patterns, what's overdue. Ask about a person and it pulls up not just who they are but how the relationship has been trending, when you last mentioned them, what context they appear in.

## The Part That Changed Everything

The feature that surprised me most wasn't retrieval or the graph itself — it was conflict detection.

I built what I call the Guardian Protocol. Before Athena responds, it checks whether what you just said contradicts your stated goals, values, or habits. Say you're committed to saving money and then propose an expensive trip — Athena flags it. Not aggressively. It follows a defined escalation: flag the conflict, explain why it matters, challenge you to reconcile it, then accept your decision if you push back. One challenge, no nagging.

This turned out to be the thing that makes Athena feel fundamentally different from a chatbot. It has a position. It remembers what you said you wanted and holds you to it. Hard conflicts get direct pushback. Soft tensions get a lighter mention. You can always override it — but you have to consciously choose to.

Tradeoff awareness works similarly. Propose a new commitment when you're already stretched across multiple goals? Athena surfaces the full picture and asks what gives to make room. It doesn't just say "great idea" — it asks whether you've thought about what you're trading.

## How It Adapts

Not every message needs the same treatment. Athena classifies each message and shifts its approach. A quick factual question gets a direct answer — mirror mode. Planning a decision gets advisor mode. Contradicting yourself triggers guardian mode. And for big life questions — career changes, relationship decisions, identity shifts — it enters dialectic mode, where it challenges your assumptions instead of agreeing with them.

This matters because the wrong mode at the wrong time is worse than no AI at all. When you're burned out and venting, you don't want strategic analysis. When you're making a major decision, you don't want cheerful agreement. Athena reads the room — message length, timing, tone patterns — and adjusts.

State inference feeds into this too. Short, terse messages signal stress. 2am activity flags sleep issues. The AI won't pile on when you're running low.

## Memory That Actually Works

Most AI memory is flat — everything has equal weight. Athena uses permanence scoring. Core values and identity nodes outweigh yesterday's task list when deciding what context to inject. Your fundamental beliefs stay present even when tactical noise piles up.

This has a real consequence: attempting to change a core value triggers a challenge ladder. Five escalating steps. You have to earn the change. This sounds aggressive but it's the right call — your values shouldn't shift because you had a bad Tuesday.

On the retrieval side, queries get classified by intent. A broad temporal question ("what happened this month?") pulls up to 15 nodes with compact summaries. A focused question about a specific person uses metadata-filtered vector search. The retrieval strategy adapts to what you're actually asking — not just top-5 similarity every time.

## Accountability

This is the other feature that makes Athena feel real. Commitment tracking, habit streaks, consequence surfacing. "You said you'd do X by Friday" — Friday passes, Athena surfaces it and shows the downstream impact. Broken streaks and overdue deadlines don't silently disappear.

It also monitors what I call fundamentals — movement, sleep, nutrition, connection, purpose, financial stability. Neglect one for two weeks and Athena brings it up proactively. Not a notification — a conversation about why it matters and what's getting in the way.

## The Stack

Python and Flask for the backend. NetworkX for the knowledge graph. ChromaDB for vector storage and semantic search. Claude API for the reasoning layer. Svelte 5 for the frontend — streaming chat with a force-directed graph visualisation where you can see all your nodes and their connections. Docker for deployment. And Ralph — my autonomous sprint runner — is handling the remaining development work.

Every line of code, every architectural decision, solo-built.

## Where It's Going

Right now Athena thinks and plans. The next stage is action — calendar integration, notifications, layered scheduling, voice ingestion, what-if simulation. Moving from "here's what you should consider" to "here's what's on your plate today and here's what I'd move."

The long-term vision is depth of context as the product. Month one, Athena gives decent advice based on what you've told it. Month six, it catches things you didn't think to ask about. Year two, it understands you better than most people in your life.

This isn't a second brain. Tools like Notion and Obsidian store information but don't reason about it. Athena thinks with your knowledge. It's a second mind.`,
  },
];
