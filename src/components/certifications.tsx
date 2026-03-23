"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Section } from "./section";
import { certificationsData } from "@/data/certifications";

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

export function Certifications() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <Section id="certifications">
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
          Certifications
        </motion.h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {certificationsData.map((cert) => (
            <motion.div
              key={cert.name}
              variants={itemVariants}
              className="flex items-start gap-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-5"
            >
              <div className="mt-0.5 shrink-0 text-[var(--color-accent)]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-[var(--color-foreground)]">
                  {cert.name}
                </p>
                <p className="mt-1 text-sm text-[var(--color-muted)]">
                  {cert.issuer} · {cert.date}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </Section>
  );
}
