"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Section } from "./section";
import {
  revealViewport,
  containerVariants,
  itemVariants,
} from "@/lib/motion";
import { wallData } from "@/data/wall";

export function Wall() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <Section id="the-wall" tone="band">
      <motion.div
        variants={containerVariants}
        initial={prefersReducedMotion ? false : "hidden"}
        whileInView="visible"
        viewport={revealViewport}
        className="max-w-2xl lg:max-w-3xl"
      >
        <motion.h2
          variants={itemVariants}
          className="mb-8 text-3xl font-bold tracking-tight md:text-4xl"
        >
          {wallData.heading}
        </motion.h2>

        <div className="flex flex-col gap-6">
          {wallData.body.map((para, i) => (
            <motion.p
              key={i}
              variants={itemVariants}
              className="text-base leading-relaxed text-[var(--color-muted)] md:text-lg"
            >
              {para}
            </motion.p>
          ))}
        </div>

        <motion.p
          variants={itemVariants}
          className="mt-10 border-l-2 border-[var(--color-accent)] pl-5 text-lg font-medium leading-relaxed text-[var(--color-foreground)] md:text-2xl"
        >
          {wallData.kicker}
        </motion.p>
      </motion.div>
    </Section>
  );
}
