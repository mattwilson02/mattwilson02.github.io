import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { blogPosts } from "@/data/blog";
import { RelatedPosts } from "@/components/related-posts";
import { BlogPostContent } from "@/components/blog-post-content";
import { ReadingProgress } from "@/components/reading-progress";
import { TableOfContents } from "@/components/table-of-contents";
import { extractHeadings } from "@/lib/extract-headings";
import { SharePost } from "@/components/share-post";

interface Props {
  params: Promise<{ slug: string }>;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return {};

  return {
    title: `${post.title} — Matt Wilson`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const headings = extractHeadings(post.content);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: {
      "@type": "Person",
      name: "Matt Wilson",
    },
    url: `https://mattwilson02.github.io/blog/${post.slug}`,
  };

  return (
    <div className="py-20 md:py-28">
      <ReadingProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-5xl px-6">
        <Link
          href="/blog"
          className="mb-8 inline-block text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-foreground)]"
        >
          ← Back to Blog
        </Link>

        <article>
          <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
            {post.title}
          </h1>

          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span className="text-sm text-[var(--color-muted)]">
              {formatDate(post.date)} &middot; {post.readingTime}
            </span>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-1 text-xs font-medium text-[var(--color-foreground)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <hr className="mb-8 border-[var(--color-border)]" />

          {headings.length > 0 && (
            <div className="mb-6 lg:hidden">
              <TableOfContents headings={headings} variant="mobile" />
            </div>
          )}

          <div
            className={
              headings.length > 0
                ? "lg:flex lg:items-start lg:gap-8"
                : undefined
            }
          >
            <div
              className={
                headings.length > 0 ? "min-w-0 flex-1" : undefined
              }
            >
              <BlogPostContent content={post.content} />
            </div>
            {headings.length > 0 && (
              <aside className="hidden w-[220px] shrink-0 lg:block">
                <TableOfContents headings={headings} variant="desktop" />
              </aside>
            )}
          </div>
        </article>

        <SharePost
          title={post.title}
          url={`https://mattwilson02.github.io/blog/${post.slug}`}
        />

        <RelatedPosts currentSlug={post.slug} currentTags={post.tags} />

        <div className="mt-12 border-t border-[var(--color-border)] pt-8">
          <Link
            href="/blog"
            className="text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-foreground)]"
          >
            ← Back to Blog
          </Link>
        </div>
      </div>
    </div>
  );
}
