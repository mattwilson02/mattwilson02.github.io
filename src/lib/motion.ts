/**
 * Shared motion config.
 *
 * One place to tune reveal behaviour so sections can't drift apart.
 *
 * The bug this fixes: `margin: "-100px"` SHRINKS the observer root, so an
 * element had to be 100px *inside* the viewport before it started fading in.
 * Scrolling therefore revealed empty space and the content caught up behind
 * you. A positive margin EXPANDS the root, so the reveal starts before the
 * section arrives and it's already solid by the time you're looking at it.
 */

/** Start revealing ~150px before the section enters the viewport. */
export const revealViewport = { once: true, margin: "150px" } as const;

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0 },
  },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] },
  },
};
