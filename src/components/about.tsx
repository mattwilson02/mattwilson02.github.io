"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Section } from "./section";
import { Avatar } from "./avatar";
import { Breadcrumbs } from "./breadcrumbs";
import { revealViewport, containerVariants, itemVariants } from "@/lib/motion";
import { aboutData } from "@/data/about";

/**
 * ABOUT — its own page, not a home-page section.
 *
 * It was a two-column block with a headshot, three stat tiles and the
 * employability bio, and nothing rendered it. What replaced it is a single
 * measured column, because the page is 209 words of prose and a grid around
 * that much text is scaffolding with nothing to hold up.
 *
 * Header band → prose on base → Close on band, which is the same alternating
 * rhythm the home page and /blog already use.
 *
 * The last paragraph is separated by a rule rather than a "Beyond the code"
 * label. Stark's About does the same thing and the shift in register does the
 * signposting on its own.
 */
export function About() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <>
      <Section id="about" tone="band" className="pt-28 md:pt-32">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />

        <motion.div
          initial={prefersReducedMotion ? false : "hidden"}
          animate="visible"
          variants={containerVariants}
          className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8"
        >
          <motion.div variants={itemVariants} className="shrink-0">
            <Avatar size={88} src={aboutData.avatarSrc} />
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl font-bold tracking-tight md:text-5xl"
          >
            About
          </motion.h1>
        </motion.div>
      </Section>

      <Section id="about-body">
        <motion.div
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView="visible"
          viewport={revealViewport}
          variants={containerVariants}
          className="flex max-w-2xl flex-col gap-6"
        >
          {aboutData.body.map((paragraph) => (
            <motion.p
              key={paragraph.slice(0, 32)}
              variants={itemVariants}
              className="text-base leading-relaxed text-[var(--color-muted)] md:text-lg"
            >
              {paragraph}
            </motion.p>
          ))}

          <motion.p
            variants={itemVariants}
            className="mt-4 border-t border-[var(--color-border)] pt-6 text-base leading-relaxed text-[var(--color-muted)] md:text-lg"
          >
            {aboutData.beyondTheCode}
          </motion.p>
        </motion.div>
      </Section>
    </>
  );
}
