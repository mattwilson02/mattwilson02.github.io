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
 * The terms panel.
 *
 * Built like a code block: a header strip carrying the label and the copy
 * action, then the content. The copy control belongs *on* the thing being
 * copied — as a button floating below the table it read as an orphan and
 * nobody would know what it referred to.
 *
 * Cells sit a shade lighter than the page on hairline dividers, so the panel
 * reads as a raised object rather than a flat grid drawn on the background.
 */
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

        <motion.div
          variants={itemVariants}
          className="mt-10 overflow-hidden rounded-xl border border-[var(--color-border)] shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset,0_16px_40px_-24px_rgba(0,0,0,0.9)]"
        >
          {/* Header strip — label left, copy action right */}
          <div className="flex items-center justify-between gap-4 border-b border-[var(--color-border)] bg-[var(--color-card)] px-5 py-3">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">
              The terms
            </span>
            <CopySummary text={howThisWorksData.forwardableSummary} />
          </div>

          <dl className="grid grid-cols-1 gap-px bg-[var(--color-border)] md:grid-cols-2">
            {howThisWorksData.points.map((point) => (
              <div
                key={point.label}
                className="group bg-[var(--color-card)] p-6 transition-colors hover:bg-[var(--color-background)]"
              >
                <dt className="font-semibold text-[var(--color-accent)]">
                  {point.label}
                </dt>
                <dd className="mt-2 leading-relaxed text-[var(--color-muted)]">
                  {point.body}
                </dd>
              </div>
            ))}
          </dl>
        </motion.div>

        <motion.p
          variants={itemVariants}
          className="mt-6 max-w-3xl text-sm italic leading-relaxed text-[var(--color-muted)]"
        >
          {howThisWorksData.intro}
        </motion.p>
      </motion.div>
    </Section>
  );
}
