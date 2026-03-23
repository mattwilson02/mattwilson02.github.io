"use client";

import { motion, useReducedMotion } from "framer-motion";
import { heroData } from "@/data/hero";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const DownloadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

export function Hero() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="home"
      className="flex min-h-[85vh] items-center py-20 md:py-28"
    >
      <div className="mx-auto w-full max-w-5xl px-6">
        <motion.div
          variants={containerVariants}
          initial={prefersReducedMotion ? false : "hidden"}
          animate="visible"
          className="flex flex-col gap-6"
        >
          {/* Availability badge */}
          {heroData.availability.status !== "unavailable" && (
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-2"
            >
              <span className="relative flex h-3 w-3">
                {!prefersReducedMotion && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
                )}
                <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500" />
              </span>
              <span className="text-sm text-[var(--color-muted)]">
                {heroData.availability.message}
              </span>
            </motion.div>
          )}

          {/* Name */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl text-shimmer"
          >
            {heroData.name}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="max-w-2xl text-xl text-[var(--color-muted)] md:text-2xl"
          >
            {heroData.subtitle}
          </motion.p>

          {/* Tagline */}
          <motion.p
            variants={itemVariants}
            className="max-w-xl text-base text-[var(--color-muted)] md:text-lg"
          >
            {heroData.tagline}
          </motion.p>

          {/* Tech badges */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-2">
            {heroData.badges.map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-1 text-xs font-medium text-[var(--color-foreground)]"
              >
                {badge}
              </span>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center gap-3 pt-2"
          >
            <a
              href={heroData.primaryCta.href}
              className="rounded-md bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
            >
              {heroData.primaryCta.label}
            </a>
            {heroData.secondaryLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border border-[var(--color-border)] px-5 py-2.5 text-sm font-semibold text-[var(--color-foreground)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
              >
                {link.label}
              </a>
            ))}
            <a
              href={heroData.resumeLink.href}
              download
              className="flex items-center gap-2 rounded-md border border-[var(--color-border)] px-5 py-2.5 text-sm font-semibold text-[var(--color-foreground)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
            >
              <DownloadIcon />
              {heroData.resumeLink.label}
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
