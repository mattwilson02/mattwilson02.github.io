import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ErrorBoundary } from "@/components/error-boundary";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const siteUrl = "https://mattwilson.tech";

export const metadata: Metadata = {
  title: "Matt Wilson, independent software engineer",
  // Matt's line, and it is the hero verbatim. The old one was the hero as it
  // read before 17 Aug — it still said "needs built" and "to something it can
  // run on", both of which he cut. The page changed and the metadata didn't.
  description:
    "You know what the business needs. I take the idea the rest of the way.",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: siteUrl,
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
  openGraph: {
    title: "Matt Wilson, independent software engineer",
    description:
      "You know what the business needs. I take the idea the rest of the way.",
    type: "website",
    url: siteUrl,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Matt Wilson, independent software engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Matt Wilson, independent software engineer",
    description:
      "You know what the business needs. I take the idea the rest of the way.",
    images: ["/og-image.png"],
  },
  themeColor: "#0a0a0a",
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

const PLAUSIBLE_DOMAIN = "mattwilson.tech";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Matt Wilson",
  jobTitle: "Independent Software Engineer",
  url: siteUrl,
  sameAs: [
    "https://github.com/mattwilson02",
    "https://www.linkedin.com/in/matt-wilson-16a671212/",
  ],
  knowsAbout: [
    "TypeScript",
    "JavaScript",
    "React",
    "Next.js",
    "React Native",
    "NestJS",
    "Node.js",
    "Azure",
    "Docker",
    "Full Stack Development",
    "Fintech",
    "Mobile Development",
  ],
  // `seeks: Demand` described someone looking for a job and was still live
  // on 17 Aug, months after the business decision. Replaced with what the
  // business actually offers.
  makesOffer: {
    "@type": "Offer",
    itemOffered: {
      "@type": "Service",
      name: "Bespoke software development and automations",
      serviceType: "Custom software development",
      provider: { "@type": "Person", name: "Matt Wilson" },
      areaServed: "Isle of Man, United Kingdom, remote",
    },
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
