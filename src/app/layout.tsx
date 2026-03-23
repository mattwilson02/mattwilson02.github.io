import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { themeScript } from "@/lib/theme";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const siteUrl = "https://mattwilson02.github.io";

export const metadata: Metadata = {
  title: "Matt Wilson — Senior Full Stack & AI Engineer",
  description:
    "Senior Full Stack & AI Engineer specialising in TypeScript, React, Next.js, and production AI systems. Self-taught, 4 years shipping software that handles real money.",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "Matt Wilson — Senior Full Stack & AI Engineer",
    description:
      "Senior Full Stack & AI Engineer specialising in TypeScript, React, Next.js, and production AI systems.",
    type: "website",
    url: siteUrl,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Matt Wilson — Senior Full Stack & AI Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Matt Wilson — Senior Full Stack & AI Engineer",
    description:
      "Senior Full Stack & AI Engineer specialising in TypeScript, React, Next.js, and production AI systems.",
    images: ["/og-image.png"],
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Matt Wilson",
  jobTitle: "Senior Full Stack & AI Engineer",
  url: siteUrl,
  sameAs: [
    "https://github.com/mattwilson02",
    "https://www.linkedin.com/in/matt-wilson-16a671212/",
  ],
  knowsAbout: [
    "TypeScript",
    "JavaScript",
    "Python",
    "React",
    "Next.js",
    "React Native",
    "NestJS",
    "Node.js",
    "AI Engineering",
    "LLM Integration",
    "RAG Pipelines",
    "Azure",
    "Docker",
    "Full Stack Development",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
