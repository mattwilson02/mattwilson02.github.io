import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { ScrollToTop } from "@/components/scroll-to-top";
import { BlogIndex } from "@/components/blog-index";

export const metadata: Metadata = {
  title: "Writing — Matt Wilson",
  description:
    "Notes on building software, working with AI agents, and running an independent practice.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  return (
    <>
      <Nav />
      <main id="main-content">
        <BlogIndex />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
