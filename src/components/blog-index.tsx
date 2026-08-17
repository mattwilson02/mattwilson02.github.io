"use client";

import { useMemo, useState } from "react";
import { Section } from "./section";
import { BlogCard } from "./blog-card";
import { BlogSearch } from "./blog-search";
import { TagFilter } from "./tag-filter";
import { Breadcrumbs } from "./breadcrumbs";
import { blogPosts } from "@/data/blog";

/** Column count follows the post count — see latest-posts.tsx. */
function gridClassFor(count: number) {
  if (count <= 1) return "grid-cols-1 max-w-xl";
  if (count === 2) return "grid-cols-1 md:grid-cols-2 max-w-3xl";
  return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
}

export function BlogIndex() {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const allTags = useMemo(
    () => Array.from(new Set(blogPosts.flatMap((p) => p.tags))).sort(),
    [],
  );

  const posts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return blogPosts.filter((post) => {
      const matchesTag = activeTag ? post.tags.includes(activeTag) : true;
      const matchesQuery = q
        ? post.title.toLowerCase().includes(q) ||
          post.excerpt.toLowerCase().includes(q) ||
          post.tags.some((t) => t.toLowerCase().includes(q))
        : true;
      return matchesTag && matchesQuery;
    });
  }, [query, activeTag]);

  return (
    <>
      {/* Header band, then the list on base — the same alternating rhythm the
          home page uses. It was one flat base section end to end, so nothing
          separated the masthead from the posts and the page read as a single
          slab of black. */}
      <Section id="writing" tone="band" className="pt-28 md:pt-32">
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "Writing" }]}
        />

        <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-5xl">
          Writing
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-[var(--color-muted)]">
          Notes on building software with AI agents, running an independent
          practice, and what breaks along the way.
        </p>

        <div className="mt-10 flex flex-col gap-5">
          <BlogSearch value={query} onChange={setQuery} />
          {allTags.length > 0 && (
            <TagFilter
              tags={allTags}
              activeTag={activeTag}
              onTagSelect={setActiveTag}
            />
          )}
        </div>
      </Section>

      <Section id="posts">
        {posts.length === 0 ? (
          <p className="text-[var(--color-muted)]">Nothing matches that yet.</p>
        ) : (
          <div className={`grid gap-6 ${gridClassFor(posts.length)}`}>
            {posts.map((post) => (
              <BlogCard
                key={post.slug}
                slug={post.slug}
                title={post.title}
                date={post.date}
                excerpt={post.excerpt}
                tags={post.tags}
                content={post.content}
              />
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
