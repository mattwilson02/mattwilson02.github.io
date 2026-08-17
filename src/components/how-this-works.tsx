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

/**
 * The terms.
 *
 * ⚠️ REBUILT 17 Aug. It was a bordered panel with a header strip and cells on
 * 1px dividers — which is precisely a code block, and it read as one. These
 * are commercial terms meant to reassure a stranger's boss; rendering them as
 * a machine artefact was the wrong register entirely.
 *
 * Now six raised tiles on the section band, with the label and copy action
 * sitting above them next to the heading. The copy control still reads as
 * belonging to the terms because it sits in their header row, not orphaned
 * below the grid.
 *
 * The intro line was deleted, not moved — Matt's call, 17 Aug. It explained
 * what the section was about to demonstrate, which the six points do on their
 * own. `forwardableSummary` is still what the copy button carries.
 */
export function HowThisWorks() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <Section id="how-this-works" tone="band">
      <motion.div
        variants={containerVariants}
        initial={prefersReducedMotion ? false : "hidden"}
        whileInView="visible"
        viewport={revealViewport}
      >
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap items-center justify-between gap-4"
        >
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            {howThisWorksData.heading}
          </h2>
          <CopySummary text={howThisWorksData.forwardableSummary} />
        </motion.div>

        <dl className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
          {howThisWorksData.points.map((point) => (
            <motion.div
              key={point.label}
              variants={itemVariants}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset,0_12px_32px_-20px_rgba(0,0,0,0.9)] transition-colors duration-200 hover:bg-[var(--color-card-hover)]"
            >
              <dt className="font-semibold text-[var(--color-accent)]">
                {point.label}
              </dt>
              <dd className="mt-2 leading-relaxed text-[var(--color-muted)]">
                {point.body}
              </dd>
            </motion.div>
          ))}
        </dl>
      </motion.div>
    </Section>
  );
}
