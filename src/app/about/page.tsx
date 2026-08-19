import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { ScrollToTop } from "@/components/scroll-to-top";
import { About } from "@/components/about";
import { Close } from "@/components/close";

/**
 * The description is Matt's own sentence from the page, verbatim. The home
 * page's metadata used to carry hero copy he had already cut — the page moved
 * and the metadata didn't — so this takes a line straight out of the body.
 */
export const metadata: Metadata = {
  title: "About · Matt Wilson",
  description:
    "I work for myself now, building bespoke software for businesses that already know exactly what they need and have nobody to build it.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About · Matt Wilson",
    description:
      "I work for myself now, building bespoke software for businesses that already know exactly what they need and have nobody to build it.",
    type: "profile",
    url: "https://mattwilson.tech/about",
  },
};

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main id="main-content">
        <About />
        <Close />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
