import { writeFileSync } from "fs";
import { join } from "path";
import { blogPosts } from "../src/data/blog";

const siteUrl = "https://mattwilson02.github.io";
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

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${siteUrl}/blog</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
${postUrls}
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

const publicDir = join(process.cwd(), "public");

writeFileSync(join(publicDir, "sitemap.xml"), generateSitemap(), "utf-8");
console.log("✓ Generated public/sitemap.xml");

writeFileSync(join(publicDir, "feed.xml"), generateRss(), "utf-8");
console.log("✓ Generated public/feed.xml");
