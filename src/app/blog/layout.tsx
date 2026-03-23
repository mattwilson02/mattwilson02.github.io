import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Blog — Matt Wilson",
  description:
    "Writing about AI engineering, developer tools, and the craft of building software.",
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav showBlogLink={true} />
      <main id="main-content">{children}</main>
      <Footer />
    </>
  );
}
