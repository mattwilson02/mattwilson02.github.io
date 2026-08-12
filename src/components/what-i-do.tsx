"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Section } from "./section";
import {
  revealViewport,
  containerVariants,
  itemVariants,
} from "@/lib/motion";
import { whatIDoData } from "@/data/what-i-do";

/**
 * Numbered cards, not prose.
 *
 * The wall above is three paragraphs and earns them — recognition needs the
 * specific detail. This section has to be the change of gear, or the page
 * reads as one continuous essay. Containers and 01/02/03 chips give the eye
 * something to move between.
 */
export function WhatIDo() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <Section id="what-i-do" className="bg-[var(--color-card)]">
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
          {whatIDoData.heading}
        </motion.h2>

        <motion.p
          variants={itemVariants}
          className="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--color-muted)]"
        >
          {whatIDoData.intro}
        </motion.p>

        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
          {whatIDoData.items.map((item, i) => (
            <motion.div
              key={item.title}
              variants={itemVariants}
              className="flex flex-col rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-6"
            >
              <span className="text-xs font-semibold tracking-widest text-[var(--color-accent)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 text-lg font-semibold leading-snug">
                {item.title}
              </h3>
              <p className="mt-3 leading-relaxed text-[var(--color-muted)]">
                {item.body}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </Section>
  );
}
