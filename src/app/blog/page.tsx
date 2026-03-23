"use client";

import { useState } from "react";
import { blogPosts } from "@/data/blog";
import { BlogCard } from "@/components/blog-card";
import { TagFilter } from "@/components/tag-filter";

const allTags = Array.from(new Set(blogPosts.flatMap((p) => p.tags))).sort();

export default function BlogPage() {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = activeTag
    ? blogPosts.filter((p) => p.tags.includes(activeTag))
    : blogPosts;

  return (
    <div className="py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">
          Blog
        </h1>
        <p className="mb-8 text-[var(--color-muted)]">
          Thoughts on building software, AI systems, and the engineering craft.
        </p>

        <div className="mb-10">
          <TagFilter
            tags={allTags}
            activeTag={activeTag}
            onTagSelect={setActiveTag}
          />
        </div>

        {filtered.length === 0 ? (
          <p className="text-[var(--color-muted)]">
            No posts found for this tag.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {filtered.map((post) => (
              <BlogCard
                key={post.slug}
                slug={post.slug}
                title={post.title}
                date={post.date}
                excerpt={post.excerpt}
                tags={post.tags}
                readingTime={post.readingTime}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
