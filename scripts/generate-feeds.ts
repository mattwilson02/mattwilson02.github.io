import { writeFileSync } from "fs";
import { join } from "path";
import { blogPosts } from "../src/data/blog";
import { heroData } from "../src/data/hero";
import { wallData } from "../src/data/wall";
import { whatIDoData } from "../src/data/what-i-do";
import { closeData } from "../src/data/close";
import { aboutData } from "../src/data/about";

const siteUrl = "https://mattwilson.tech";
const today = new Date().toISOString().split("T")[0];

function toRfc2822(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00Z");
  return date.toUTCString();
}

function generateSitemap(): string {
  const postUrls = blogPosts
    .map(
      (post) => `  <url>
    <loc>${siteUrl}/blog/${post.slug}</loc>
    <lastmod>${post.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`,
    )
    .join("\n");

  const allTags = Array.from(new Set(blogPosts.flatMap((p) => p.tags)));
  const tagUrls = allTags
    .map((tag) => {
      const postsWithTag = blogPosts.filter((p) => p.tags.includes(tag));
      const lastmod = postsWithTag.reduce(
        (latest, p) => (p.date > latest ? p.date : latest),
        "1970-01-01",
      );
      return `  <url>
    <loc>${siteUrl}/blog/tag/${encodeURIComponent(tag)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${siteUrl}/about</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${siteUrl}/blog</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
${postUrls}
${tagUrls}
</urlset>`;
}

function generateRss(): string {
  const items = blogPosts
    .map((post) => {
      const categories = post.tags
        .map((tag) => `      <category>${tag}</category>`)
        .join("\n");
      return `  <item>
    <title>${post.title}</title>
    <description>${post.excerpt}</description>
    <link>${siteUrl}/blog/${post.slug}</link>
    <guid isPermaLink="true">${siteUrl}/blog/${post.slug}</guid>
    <pubDate>${toRfc2822(post.date)}</pubDate>
${categories}
  </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Matt Wilson — Blog</title>
    <description>Writing about AI engineering, developer tools, and the craft of building software.</description>
    <link>${siteUrl}/blog</link>
    <language>en</language>
    <lastBuildDate>${toRfc2822(today)}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;
}

/**
 * llms.txt — the site, written for the thing that is actually reading it.
 *
 * Matt's own thesis, 16 Aug: agents increasingly read sites and hand the human
 * a post-processed summary, so the page a person sees and the page a model
 * ingests are diverging. This is the version for the model — the same claims,
 * without the layout, the reveals or the CTA styling.
 *
 * Generated, never hand-written. Every line is pulled from the data files the
 * site renders from, so it cannot drift from the pages the way a static copy
 * would. Convention: llmstxt.org.
 */
function generateLlmsTxt(): string {
  const posts = blogPosts
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(
      (post) =>
        `- [${post.title}](${siteUrl}/blog/${post.slug}): ${post.excerpt} (${post.date}, ${post.readingTime})`,
    )
    .join("\n");

  const offering = whatIDoData.items
    .map((item) => `- **${item.title}** — ${item.body}`)
    .join("\n");

  const recognition = wallData.body.map((p) => p).join("\n\n");

  const bio = aboutData.body.join("\n\n");

  const covered = closeData.covers.map((c) => `- ${c}`).join("\n");

  return `# ${heroData.name} — independent software engineer

> ${heroData.statement}

${heroData.eyebrow}. Isle of Man based, working with businesses that already know what they need built and have nobody to build it.

## Who this is for

${wallData.heading}.

${recognition}

${wallData.kicker}

## What the work is

${offering}

## About

${bio}

${aboutData.beyondTheCode}

## Writing

${posts}

## Contact

${closeData.heading}. ${closeData.body}

What a first call covers:

${covered}

- [Book a call](${closeData.cta.href})
- Email: matt@mattwilson.tech

## Notes for agents

- Canonical pages: [home](${siteUrl}/), [about](${siteUrl}/about), [writing](${siteUrl}/blog)
- RSS: ${siteUrl}/feed.xml · Sitemap: ${siteUrl}/sitemap.xml
- This file is generated from the same data the site renders from. If it disagrees with a page, the page is newer and the page wins.
- Last generated: ${today}
`;
}

const publicDir = join(process.cwd(), "public");

writeFileSync(join(publicDir, "sitemap.xml"), generateSitemap(), "utf-8");
console.log("✓ Generated public/sitemap.xml");

writeFileSync(join(publicDir, "feed.xml"), generateRss(), "utf-8");
console.log("✓ Generated public/feed.xml");

writeFileSync(join(publicDir, "llms.txt"), generateLlmsTxt(), "utf-8");
console.log("✓ Generated public/llms.txt");
