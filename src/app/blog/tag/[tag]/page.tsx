import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { ScrollToTop } from "@/components/scroll-to-top";
import { Section } from "@/components/section";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { BlogCard } from "@/components/blog-card";
import { blogPosts } from "@/data/blog";

/**
 * Tag pages.
 *
 * `/blog` already filters by tag in the client, so this route is not about
 * filtering. It exists because the tag chips on every card linked here and got
 * a 404, and because `generate-og-images.ts` has been producing a share card
 * per tag all along for a URL nobody could open. A tag is a thing worth
 * sending someone, so it needs an address.
 */

const allTags = Array.from(new Set(blogPosts.flatMap((p) => p.tags)));

function resolveTag(param: string): string | null {
  const decoded = decodeURIComponent(param);
  return allTags.find((t) => t === decoded) ?? null;
}

export function generateStaticParams() {
  return allTags.map((tag) => ({ tag: encodeURIComponent(tag) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag: raw } = await params;
  const tag = resolveTag(raw);
  if (!tag) return { title: "Writing · Matt Wilson" };

  const count = blogPosts.filter((p) => p.tags.includes(tag)).length;
  const title = `${tag} · Matt Wilson`;
  const description = `${count} ${count === 1 ? "post" : "posts"} tagged ${tag}.`;
  const image = `/og/blog/tag/${encodeURIComponent(tag)}.png`;

  return {
    title,
    description,
    alternates: { canonical: `/blog/tag/${encodeURIComponent(tag)}` },
    openGraph: { title, description, images: [image], type: "website" },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag: raw } = await params;
  const tag = resolveTag(raw);
  if (!tag) notFound();

  const posts = blogPosts.filter((p) => p.tags.includes(tag));

  return (
    <>
      <Nav />
      <main id="main-content">
        <Section id="writing" tone="band" className="pt-28 md:pt-32">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Writing", href: "/blog" },
              { label: tag },
            ]}
          />
          <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-5xl">
            {tag}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-[var(--color-muted)]">
            {posts.length} {posts.length === 1 ? "post" : "posts"} tagged {tag}.{" "}
            <Link
              href="/blog"
              className="text-[var(--color-accent)] hover:underline"
            >
              All writing
            </Link>
          </p>
        </Section>

        <Section id="posts">
          <div
            className={`grid gap-6 ${
              posts.length <= 1
                ? "grid-cols-1 max-w-xl"
                : posts.length === 2
                  ? "grid-cols-1 md:grid-cols-2 max-w-3xl"
                  : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {posts.map((post) => (
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
        </Section>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
