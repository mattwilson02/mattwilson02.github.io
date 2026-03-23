import Link from "next/link";
import { blogPosts } from "@/data/blog";

interface PostNavigationProps {
  currentSlug: string;
}

export function PostNavigation({ currentSlug }: PostNavigationProps) {
  const currentIndex = blogPosts.findIndex((p) => p.slug === currentSlug);

  if (currentIndex === -1) return null;

  // blogPosts sorted newest-first: lower index = newer, higher index = older
  const nextPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null;
  const prevPost =
    currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null;

  if (!nextPost && !prevPost) return null;

  return (
    <div className="mt-8 border-t border-[var(--color-border)] pt-8">
      <div className="flex justify-between gap-4">
        <div className="flex-1">
          {prevPost && (
            <Link
              href={`/blog/${prevPost.slug}`}
              className="group flex flex-col gap-1"
            >
              <span className="text-xs uppercase tracking-wide text-[var(--color-muted)]">
                ← Previous
              </span>
              <span className="text-sm font-medium text-[var(--color-foreground)] transition-colors group-hover:text-[var(--color-accent)]">
                {prevPost.title}
              </span>
            </Link>
          )}
        </div>
        <div className="flex-1 text-right">
          {nextPost && (
            <Link
              href={`/blog/${nextPost.slug}`}
              className="group flex flex-col gap-1 items-end"
            >
              <span className="text-xs uppercase tracking-wide text-[var(--color-muted)]">
                Next →
              </span>
              <span className="text-sm font-medium text-[var(--color-foreground)] transition-colors group-hover:text-[var(--color-accent)]">
                {nextPost.title}
              </span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
