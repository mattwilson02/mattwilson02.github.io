"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Section } from "./section";
import { experienceData } from "@/data/experience";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.05 },
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

export function Experience() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <Section id="experience">
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
          Experience
        </motion.h2>

        <div className="flex flex-col gap-12">
          {experienceData.map((entry) => (
            <motion.div
              key={entry.company}
              variants={itemVariants}
              className="relative pl-0 md:border-l md:border-[var(--color-border)] md:pl-8"
            >
              {/* Timeline dot — desktop only */}
              <div className="absolute -left-[5px] top-1.5 hidden h-2.5 w-2.5 rounded-full border-2 border-[var(--color-accent)] bg-[var(--color-background)] md:block" />

              {/* Role header */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-[var(--color-foreground)]">
                  {entry.company}
                </h3>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-[var(--color-accent)]">
                    {entry.role}
                  </span>
                  <span className="text-sm text-[var(--color-muted)]">·</span>
                  <span className="text-sm text-[var(--color-muted)]">
                    {entry.period}
                  </span>
                </div>
              </div>

              {/* Sub-projects */}
              <div className="flex flex-col gap-8">
                {entry.projects.map((project) => (
                  <div key={project.name} className="flex flex-col gap-3">
                    <div>
                      <h4 className="text-base font-semibold text-[var(--color-foreground)]">
                        {project.name}
                      </h4>
                      <p className="mt-0.5 text-xs text-[var(--color-muted)]">
                        {project.techSummary}
                      </p>
                    </div>
                    <ul className="flex flex-col gap-2">
                      {project.highlights.map((highlight, i) => (
                        <li
                          key={i}
                          className="flex gap-3 text-sm leading-relaxed text-[var(--color-muted)]"
                        >
                          <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--color-border)]" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </Section>
  );
}
