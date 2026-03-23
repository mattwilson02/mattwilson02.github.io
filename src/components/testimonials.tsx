"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Section } from "./section";
import { testimonialsData } from "@/data/testimonials";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
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

export function Testimonials() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <Section id="testimonials">
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
          What People Say
        </motion.h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonialsData.map((testimonial) => (
            <motion.div
              key={testimonial.name}
              variants={itemVariants}
              className="flex flex-col gap-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-6"
            >
              <span
                className="text-5xl font-bold leading-none text-[var(--color-accent)] opacity-40"
                aria-hidden="true"
              >
                &ldquo;
              </span>
              <p className="flex-1 text-sm italic leading-relaxed text-[var(--color-muted)]">
                {testimonial.quote}
              </p>
              <div>
                <p className="font-semibold text-[var(--color-foreground)]">
                  {testimonial.name}
                </p>
                <p className="text-xs text-[var(--color-muted)]">
                  {testimonial.role}, {testimonial.company}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </Section>
  );
}
