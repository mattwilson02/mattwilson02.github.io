import { blogPosts } from "@/data/blog";
import { BlogCard } from "@/components/blog-card";

export default function BlogPage() {
  return (
    <div className="py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">
          Blog
        </h1>
        <p className="mb-12 text-[var(--color-muted)]">
          Thoughts on building software, AI systems, and the engineering craft.
        </p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {blogPosts.map((post) => (
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
      </div>
    </div>
  );
}
