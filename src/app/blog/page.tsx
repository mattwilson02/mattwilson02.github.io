"use client";

import { useState, useEffect } from "react";
import { blogPosts } from "@/data/blog";
import { BlogCard } from "@/components/blog-card";
import { TagFilter } from "@/components/tag-filter";
import { BlogSearch } from "@/components/blog-search";

const allTags = Array.from(new Set(blogPosts.flatMap((p) => p.tags))).sort();

export default function BlogPage() {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  let filtered = activeTag
    ? blogPosts.filter((p) => p.tags.includes(activeTag))
    : blogPosts;

  if (searchQuery) {
    filtered = filtered.filter((post) =>
      `${post.title} ${post.excerpt} ${post.tags.join(" ")}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
    );
  }

  return (
    <div className="py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">
          Blog
        </h1>
        <p className="mb-8 text-[var(--color-muted)]">
          Thoughts on building software, AI systems, and the engineering craft.
        </p>

        <div className="mb-6">
          <BlogSearch value={searchInput} onChange={setSearchInput} />
        </div>

        <div className="mb-10">
          <TagFilter
            tags={allTags}
            activeTag={activeTag}
            onTagSelect={setActiveTag}
          />
        </div>

        {filtered.length === 0 ? (
          <p className="text-[var(--color-muted)]">No posts found.</p>
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
