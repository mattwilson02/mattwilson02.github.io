import Link from "next/link";
import { Section } from "./section";
import { BlogCard } from "./blog-card";
import { blogPosts } from "@/data/blog";

/**
 * Column count follows the post count.
 *
 * A three-column grid holding one post leaves it stranded in the left third
 * and reads as something that failed to load. As posts accumulate this opens
 * up on its own.
 */
function gridClassFor(count: number) {
  if (count <= 1) return "grid-cols-1 max-w-xl";
  if (count === 2) return "grid-cols-1 md:grid-cols-2 max-w-3xl";
  return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
}

export function LatestPosts() {
  const posts = blogPosts.slice(0, 3);

  if (posts.length === 0) return null;

  return (
    <Section id="writing">
      <div>
        <h2
          data-reveal
          className="mb-10 text-3xl font-bold tracking-tight md:text-4xl"
        >
          Writing
        </h2>

        <div className={`grid gap-6 ${gridClassFor(posts.length)}`}>
          {posts.map((post) => (
            <div key={post.slug} data-reveal>
              <BlogCard
                slug={post.slug}
                title={post.title}
                date={post.date}
                excerpt={post.excerpt}
                tags={post.tags}
                content={post.content}
              />
            </div>
          ))}
        </div>

        {blogPosts.length > posts.length && (
          <div data-reveal className="mt-8">
            <Link
              href="/blog"
              className="text-sm font-medium text-[var(--color-accent)] hover:underline"
            >
              All writing →
            </Link>
          </div>
        )}
      </div>
    </Section>
  );
}
