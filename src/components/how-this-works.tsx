"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Section } from "./section";
import {
  revealViewport,
  containerVariants,
  itemVariants,
} from "@/lib/motion";
import { CopySummary } from "./copy-summary";
import { howThisWorksData } from "@/data/how-this-works";

export function HowThisWorks() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <Section id="how-this-works">
      <motion.div
        variants={containerVariants}
        initial={prefersReducedMotion ? false : "hidden"}
        whileInView="visible"
        viewport={revealViewport}
      >
        <motion.h2
          variants={itemVariants}
          className="max-w-2xl text-3xl font-bold tracking-tight md:text-4xl"
        >
          {howThisWorksData.heading}
        </motion.h2>

        <dl className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-border)] md:grid-cols-2">
          {howThisWorksData.points.map((point) => (
            <motion.div
              key={point.label}
              variants={itemVariants}
              className="bg-[var(--color-background)] p-6"
            >
              <dt className="font-semibold">{point.label}</dt>
              <dd className="mt-2 leading-relaxed text-[var(--color-muted)]">
                {point.body}
              </dd>
            </motion.div>
          ))}
        </dl>

        <motion.p
          variants={itemVariants}
          className="mt-6 max-w-3xl text-sm italic leading-relaxed text-[var(--color-muted)]"
        >
          {howThisWorksData.intro}
        </motion.p>

        <motion.div variants={itemVariants} className="mt-8">
          <CopySummary text={howThisWorksData.forwardableSummary} />
        </motion.div>
      </motion.div>
    </Section>
  );
}
