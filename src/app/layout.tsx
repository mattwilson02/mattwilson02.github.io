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
  title: "Matt Wilson — Bespoke software development and automations",
  description:
    "Independent software engineer. You know what the business needs built — I take the idea the rest of the way, to something it can run on. Fixed price, delivered in phases.",
  metadataBase: new URL(siteUrl),
  // Holding page: keep it out of every index until the rebuild lands.
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "Matt Wilson — Bespoke software development and automations",
    description:
      "You know what the business needs built — I take the idea the rest of the way, to something it can run on.",
    type: "website",
    url: siteUrl,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Matt Wilson — bespoke software development and automations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Matt Wilson — Bespoke software development and automations",
    description:
      "You know what the business needs built — I take the idea the rest of the way, to something it can run on.",
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
  jobTitle: "Full Stack Engineer",
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
  seeks: {
    "@type": "Demand",
    description: "Full-stack software engineering opportunities",
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
