import Link from "next/link";
import { BlogPost } from "@/data/blog";
import { calculateReadingTime } from "@/lib/reading-time";

type BlogCardProps = Pick<
  BlogPost,
  "slug" | "title" | "date" | "excerpt" | "tags" | "content"
>;

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function BlogCard({
  slug,
  title,
  date,
  excerpt,
  tags,
  content,
}: BlogCardProps) {
  return (
    <div className="group relative flex h-full flex-col gap-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-6 transition-all duration-200 hover:scale-[1.02] hover:border-[var(--color-accent)]">
      {/* Stretched link covers the whole card — sits below tag links */}
      <Link
        href={`/blog/${slug}`}
        aria-label={`Read "${title}"`}
        className="absolute inset-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
      />

      <div className="relative flex flex-col gap-2">
        <h3 className="text-lg font-bold text-[var(--color-foreground)]">
          {title}
        </h3>
        <p className="text-sm text-[var(--color-muted)]">
          {formatDate(date)} &middot; {calculateReadingTime(content)}
        </p>
      </div>

      <p className="relative flex-1 text-sm leading-relaxed text-[var(--color-muted)]">
        {excerpt}
      </p>

      <div className="relative flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Link
            key={tag}
            href={`/blog/tag/${encodeURIComponent(tag)}`}
            aria-label={`View posts tagged ${tag}`}
            className="rounded-full border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-1 text-xs font-medium text-[var(--color-foreground)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
          >
            {tag}
          </Link>
        ))}
      </div>

      <Link
        href={`/blog/${slug}`}
        className="relative inline-block rounded-md px-3 py-2 text-xs font-medium text-[var(--color-accent)] transition-colors hover:bg-[var(--color-accent)]/10 hover:underline"
      >
        Read post →
      </Link>
    </div>
  );
}
