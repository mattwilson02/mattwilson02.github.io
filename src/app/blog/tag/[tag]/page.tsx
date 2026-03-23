import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { blogPosts } from "@/data/blog";
import { BlogCard } from "@/components/blog-card";
import { Breadcrumbs } from "@/components/breadcrumbs";

interface Props {
  params: Promise<{ tag: string }>;
}

export function generateStaticParams() {
  const allTags = Array.from(new Set(blogPosts.flatMap((p) => p.tags)));
  return allTags.map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);

  return {
    title: `${decodedTag} — Blog — Matt Wilson`,
    description: `Blog posts about ${decodedTag} by Matt Wilson.`,
    openGraph: {
      title: `${decodedTag} — Blog — Matt Wilson`,
      description: `Blog posts about ${decodedTag} by Matt Wilson.`,
      images: [
        {
          url: `/og/blog/tag/${encodeURIComponent(decodedTag)}.png`,
          width: 1200,
          height: 630,
          alt: `Posts tagged "${decodedTag}"`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${decodedTag} — Blog — Matt Wilson`,
      description: `Blog posts about ${decodedTag} by Matt Wilson.`,
      images: [`/og/blog/tag/${encodeURIComponent(decodedTag)}.png`],
    },
  };
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);

  const filtered = blogPosts.filter((p) => p.tags.includes(decodedTag));

  if (filtered.length === 0) {
    notFound();
  }

  return (
    <div className="py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-4">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Blog", href: "/blog" },
              { label: decodedTag },
            ]}
          />
        </div>

        <h1 className="mb-2 text-3xl font-bold tracking-tight md:text-4xl">
          {decodedTag}
        </h1>
        <p className="mb-10 text-[var(--color-muted)]">
          {filtered.length} post{filtered.length !== 1 ? "s" : ""}
        </p>

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

        <div className="mt-12 border-t border-[var(--color-border)] pt-8">
          <Link
            href="/blog"
            className="text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-foreground)]"
          >
            ← All posts
          </Link>
        </div>
      </div>
    </div>
  );
}
