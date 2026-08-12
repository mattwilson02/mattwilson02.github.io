"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Section } from "./section";
import { BlogCard } from "./blog-card";
import { revealViewport, containerVariants, itemVariants } from "@/lib/motion";
import { blogPosts } from "@/data/blog";

/**
 * Column count follows the post count.
 *
 * A three-column grid holding one post leaves it stranded in the left third
 * and reads as something that failed to load. As posts accumulate this opens
 * up on its own.
 */
function gridClassFor(count: number) {
  if (count <= 1) return "grid-cols-1 max-w-xl";
  if (count === 2) return "grid-cols-1 md:grid-cols-2 max-w-3xl";
  return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
}

export function LatestPosts() {
  const prefersReducedMotion = useReducedMotion();
  const posts = blogPosts.slice(0, 3);

  if (posts.length === 0) return null;

  return (
    <Section id="writing">
      <motion.div
        variants={containerVariants}
        initial={prefersReducedMotion ? false : "hidden"}
        whileInView="visible"
        viewport={revealViewport}
      >
        <motion.h2
          variants={itemVariants}
          className="mb-10 text-3xl font-bold tracking-tight md:text-4xl"
        >
          Writing
        </motion.h2>

        <div className={`grid gap-6 ${gridClassFor(posts.length)}`}>
          {posts.map((post) => (
            <motion.div key={post.slug} variants={itemVariants}>
              <BlogCard
                slug={post.slug}
                title={post.title}
                date={post.date}
                excerpt={post.excerpt}
                tags={post.tags}
                content={post.content}
              />
            </motion.div>
          ))}
        </div>

        {blogPosts.length > posts.length && (
          <motion.div variants={itemVariants} className="mt-8">
            <Link
              href="/blog"
              className="text-sm font-medium text-[var(--color-accent)] hover:underline"
            >
              All writing →
            </Link>
          </motion.div>
        )}
      </motion.div>
    </Section>
  );
}
