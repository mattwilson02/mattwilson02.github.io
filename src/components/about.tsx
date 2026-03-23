"use client";

import { motion, useReducedMotion } from "framer-motion";
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

export function About() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <Section id="about">
      <motion.div
        variants={containerVariants}
        initial={prefersReducedMotion ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
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
            <Avatar size={96} />

            <div className="flex w-full flex-col gap-4">
              {aboutData.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3"
                >
                  <div className="text-2xl font-bold text-[var(--color-foreground)]">
                    {stat.value}
                  </div>
                  <div className="text-sm text-[var(--color-muted)]">
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
              className="mt-2 border-t border-[var(--color-border)] pt-4 text-sm italic text-[var(--color-muted)]"
            >
              Beyond the code — {aboutData.beyondTheCode}
            </motion.p>
          </div>
        </div>
      </motion.div>
    </Section>
  );
}
