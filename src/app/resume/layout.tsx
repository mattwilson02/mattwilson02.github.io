import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Resume — Matt Wilson",
  description:
    "Matt Wilson's professional resume — Senior Full Stack & AI Engineer with 4 years of production experience in TypeScript, React Native, Next.js, and AI systems.",
};

export default function ResumeLayout({
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
