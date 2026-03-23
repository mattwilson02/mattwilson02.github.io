import Link from "next/link";
import { BlogPost } from "@/data/blog";

type BlogCardProps = Pick<
  BlogPost,
  "slug" | "title" | "date" | "excerpt" | "tags" | "readingTime"
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
  readingTime,
}: BlogCardProps) {
  return (
    <Link
      href={`/blog/${slug}`}
      aria-label={`Read "${title}"`}
      className="group flex h-full flex-col gap-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-6 transition-all duration-200 hover:scale-[1.02] hover:border-[var(--color-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
    >
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold text-[var(--color-foreground)]">
          {title}
        </h3>
        <p className="text-sm text-[var(--color-muted)]">
          {formatDate(date)} &middot; {readingTime}
        </p>
      </div>

      <p className="flex-1 text-sm leading-relaxed text-[var(--color-muted)]">
        {excerpt}
      </p>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-1 text-xs font-medium text-[var(--color-foreground)]"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="text-xs font-medium text-[var(--color-accent)] group-hover:underline">
        Read post →
      </div>
    </Link>
  );
}
