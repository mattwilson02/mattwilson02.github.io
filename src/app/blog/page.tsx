"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { blogPosts } from "@/data/blog";
import { BlogCard } from "@/components/blog-card";
import { TagFilter } from "@/components/tag-filter";
import { BlogSearch } from "@/components/blog-search";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { KeyboardNav } from "@/components/keyboard-nav";

const allTags = Array.from(new Set(blogPosts.flatMap((p) => p.tags))).sort();

export default function BlogPage() {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const searchInputRef = useRef<HTMLInputElement>(null);

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

  const isFiltered = Boolean(activeTag || searchQuery);

  const handleFocusSearch = useCallback(() => {
    searchInputRef.current?.focus();
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchInput("");
    setActiveTag(null);
  }, []);

  return (
    <div className="py-20 md:py-28">
      <KeyboardNav
        context="listing"
        onFocusSearch={handleFocusSearch}
        onClearFilters={handleClearFilters}
      />
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-4">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog" }]} />
        </div>
        <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">
          Blog
        </h1>
        <p className="mb-8 text-[var(--color-muted)]">
          Thoughts on building software, AI systems, and the engineering craft.
        </p>

        <div className="mb-6">
          <BlogSearch
            value={searchInput}
            onChange={setSearchInput}
            inputRef={searchInputRef}
          />
        </div>

        <div className="mb-6">
          <TagFilter
            tags={allTags}
            activeTag={activeTag}
            onTagSelect={setActiveTag}
          />
        </div>

        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-[var(--color-muted)]">
            {isFiltered
              ? `Showing ${filtered.length} of ${blogPosts.length} posts`
              : `${blogPosts.length} posts`}
          </p>
          {isFiltered && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-sm text-[var(--color-accent)] cursor-pointer hover:underline"
            >
              Clear filters
            </button>
          )}
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
                content={post.content}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
