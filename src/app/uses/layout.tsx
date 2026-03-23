import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Uses — Matt Wilson",
  description:
    "Tools, software, and hardware I use for full-stack development and AI engineering.",
};

export default function UsesLayout({
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
