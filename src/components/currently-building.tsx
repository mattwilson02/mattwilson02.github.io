"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Section } from "./section";
import { currentProjects, type ProjectStatus } from "@/data/currently-building";

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

const STATUS_CONFIG: Record<
  ProjectStatus,
  { dot: string; label: string }
> = {
  active: { dot: "bg-green-500", label: "Active" },
  paused: { dot: "bg-amber-500", label: "Paused" },
  shipped: { dot: "bg-blue-500", label: "Shipped" },
};

export function CurrentlyBuilding() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <Section id="building">
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
          Currently Building
        </motion.h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {currentProjects.map((project) => {
            const status = STATUS_CONFIG[project.status];
            return (
              <motion.div key={project.name} variants={itemVariants}>
                <div
                  className={`rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-6 transition-colors duration-200${project.link ? " hover:border-[var(--color-accent)]" : ""}`}
                >
                  {/* Status indicator */}
                  <div className="mb-3 flex items-center gap-2">
                    <span
                      className={`inline-block h-2 w-2 rounded-full ${status.dot}`}
                    />
                    <span className="text-xs text-[var(--color-muted)]">
                      {status.label}
                    </span>
                  </div>

                  {/* Project name */}
                  <h3 className="mb-2 text-lg font-semibold">
                    {project.link ? (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[var(--color-accent)] transition-colors duration-150"
                      >
                        {project.name}
                      </a>
                    ) : (
                      project.name
                    )}
                  </h3>

                  {/* Description */}
                  <p className="mb-4 text-sm text-[var(--color-muted)]">
                    {project.description}
                  </p>

                  {/* Tech pills */}
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-1 text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </Section>
  );
}
