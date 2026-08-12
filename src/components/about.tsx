"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { Section } from "./section";
import { Avatar } from "./avatar";
import { aboutData } from "@/data/about";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
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

const StatIcon = ({ label }: { label: string }) => {
  if (label === "Coffees Consumed")
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
        <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
        <line x1="6" y1="2" x2="6" y2="4" />
        <line x1="10" y1="2" x2="10" y2="4" />
        <line x1="14" y1="2" x2="14" y2="4" />
      </svg>
    );
  if (label === "Location")
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    );
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
};

export function About() {
  const prefersReducedMotion = useReducedMotion();
  const [coffeeCount, setCoffeeCount] = useState(1000);

  useEffect(() => {
    const interval = setInterval(() => {
      setCoffeeCount((c) => c + 1);
    }, 3_600_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Section id="about">
      <motion.div
        variants={containerVariants}
        initial={prefersReducedMotion ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, margin: "150px" }}
      >
        <motion.h2
          variants={itemVariants}
          className="mb-12 text-3xl font-bold tracking-tight md:text-4xl"
        >
          About
        </motion.h2>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-[240px_1fr] md:gap-16">
          {/* Left column: avatar + stats */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center gap-8 md:items-start"
          >
            <Avatar size={96} src={aboutData.avatarSrc} />

            <div className="flex w-full flex-col gap-4">
              {aboutData.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3"
                >
                  <div className="text-2xl font-bold text-[var(--color-foreground)]">
                    {stat.ticker ? `${coffeeCount.toLocaleString()}+` : stat.value}
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-sm text-[var(--color-muted)]">
                    <StatIcon label={stat.label} />
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right column: bio + beyond the code */}
          <div className="flex flex-col gap-5">
            {aboutData.bio.map((paragraph, i) => (
              <motion.p
                key={i}
                variants={itemVariants}
                className="text-base leading-relaxed text-[var(--color-muted)] md:text-lg"
              >
                {paragraph}
              </motion.p>
            ))}

            <motion.p
              variants={itemVariants}
              className="mt-2 border-t border-[var(--color-border)] pt-4 text-sm italic text-(--color-muted)"
            >
              Beyond the code — {aboutData.beyondTheCode}
            </motion.p>
          </div>
        </div>
      </motion.div>
    </Section>
  );
}
