import { blogPosts } from "@/data/blog";
import { BlogCard } from "@/components/blog-card";

interface RelatedPostsProps {
  currentSlug: string;
  currentTags: string[];
}

export function RelatedPosts({ currentSlug, currentTags }: RelatedPostsProps) {
  const otherPosts = blogPosts.filter((p) => p.slug !== currentSlug);

  if (otherPosts.length === 0) return null;

  const scored = otherPosts.map((post) => ({
    post,
    overlap: post.tags.filter((t) => currentTags.includes(t)).length,
  }));

  scored.sort((a, b) => b.overlap - a.overlap);

  const related = scored.slice(0, 2).map((s) => s.post);

  return (
    <div className="mt-12 border-t border-[var(--color-border)] pt-8">
      <h2 className="mb-6 text-xl font-semibold">Related Posts</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {related.map((post) => (
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
    </div>
  );
}
