"use client";

import { useState } from "react";
import type { TocHeading } from "@/lib/extract-headings";

interface TableOfContentsProps {
  headings: TocHeading[];
  variant?: "mobile" | "desktop";
}

export function TableOfContents({ headings, variant = "mobile" }: TableOfContentsProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (headings.length === 0) return null;

  const links = (
    <ul className="space-y-1">
      {headings.map((heading) => (
        <li key={heading.id} className={heading.level === 3 ? "pl-4" : ""}>
          <a
            href={`#${heading.id}`}
            className="text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-foreground)]"
          >
            {heading.text}
          </a>
        </li>
      ))}
    </ul>
  );

  if (variant === "desktop") {
    return (
      <div className="sticky top-24">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
          On this page
        </p>
        {links}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between text-sm font-medium text-[var(--color-foreground)]"
      >
        On this page
        <svg
          className={`h-4 w-4 transition-transform${isOpen ? " rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen && <div className="mt-3">{links}</div>}
    </div>
  );
}
