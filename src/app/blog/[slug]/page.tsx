import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { ScrollToTop } from "@/components/scroll-to-top";
import { Section } from "@/components/section";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { BlogPostContent } from "@/components/blog-post-content";
import { TableOfContents } from "@/components/table-of-contents";
import { ReadingProgress } from "@/components/reading-progress";
import { SharePost } from "@/components/share-post";
import { RelatedPosts } from "@/components/related-posts";
import { PostNavigation } from "@/components/post-navigation";
import { extractHeadings } from "@/lib/extract-headings";
import { formatDateLong } from "@/lib/format-date";
import { blogPosts } from "@/data/blog";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) return { title: "Not found · Matt Wilson" };

  return {
    title: `${post.title} · Matt Wilson`,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      url: `/blog/${post.slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) notFound();

  const headings = extractHeadings(post.content);

  return (
    <>
      <ReadingProgress />
      <Nav />
      <main id="main-content">
        <Section id="post" className="pt-28 md:pt-32">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Writing", href: "/blog" },
              { label: post.title },
            ]}
          />

          <article className="mt-6">
            <header className="max-w-3xl">
              <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl">
                {post.title}
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-[var(--color-muted)]">
                <time dateTime={post.date}>{formatDateLong(post.date)}</time>
                <span aria-hidden="true">·</span>
                <span>{post.readingTime}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </header>

            <div className="mt-10 lg:grid lg:grid-cols-[1fr_240px] lg:gap-12">
              <div>
                <TableOfContents headings={headings} variant="mobile" />
                <BlogPostContent content={post.content} />
                <SharePost
                  title={post.title}
                  url={`https://mattwilson.tech/blog/${post.slug}/`}
                />
              </div>

              <aside className="hidden lg:block">
                <div className="sticky top-28">
                  <TableOfContents headings={headings} variant="desktop" />
                </div>
              </aside>
            </div>
          </article>

          <PostNavigation currentSlug={post.slug} />
          <RelatedPosts currentSlug={post.slug} currentTags={post.tags} />
        </Section>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
