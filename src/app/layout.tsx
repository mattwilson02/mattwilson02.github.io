import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { themeScript } from "@/lib/theme";
import { ErrorBoundary } from "@/components/error-boundary";

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
    types: {
      "application/rss+xml": "/feed.xml",
    },
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
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
};

const PLAUSIBLE_DOMAIN = "mattwilson02.github.io";

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
  seeks: {
    "@type": "Demand",
    description: "Full-stack engineering and AI development opportunities",
  },
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
        <script
          defer
          data-domain={PLAUSIBLE_DOMAIN}
          src="https://plausible.io/js/script.js"
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  );
}
