"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Section } from "./section";
import { BlogCard } from "./blog-card";
import { blogPosts } from "@/data/blog";

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

export function LatestPosts() {
  const prefersReducedMotion = useReducedMotion();
  const posts = blogPosts.slice(0, 2);

  return (
    <Section id="writing">
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
          Latest Writing
        </motion.h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {posts.map((post) => (
            <motion.div key={post.slug} variants={itemVariants}>
              <BlogCard
                slug={post.slug}
                title={post.title}
                date={post.date}
                excerpt={post.excerpt}
                tags={post.tags}
                readingTime={post.readingTime}
              />
            </motion.div>
          ))}
        </div>

        <motion.div variants={itemVariants} className="mt-8">
          <Link
            href="/blog"
            className="text-sm font-medium text-[var(--color-accent)] hover:underline"
          >
            View All Posts →
          </Link>
        </motion.div>
      </motion.div>
    </Section>
  );
}
