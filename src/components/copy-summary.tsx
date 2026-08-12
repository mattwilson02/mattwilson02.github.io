"use client";

import { useState } from "react";

const CopyIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const TickIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

/**
 * The forwardable summary, as an action rather than a paragraph.
 *
 * It restates the terms it sits above, which is exactly right for something
 * pasted to someone who has never seen the page — and pure bloat printed
 * underneath the list it repeats. So it lives on the clipboard instead.
 *
 * It's also the one interaction that admits what the section is for: the
 * reader usually isn't the decision-maker, they're the person who has to
 * convince one.
 */
export function CopySummary({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      // Clipboard unavailable (insecure context, permissions) — fail quietly
      // rather than throwing an error at someone reading a marketing page.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-live="polite"
      title="Copy a short summary of these terms"
      className="inline-flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-[var(--color-muted)] transition-colors hover:bg-[var(--color-background)] hover:text-[var(--color-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
    >
      {copied ? <TickIcon /> : <CopyIcon />}
      {copied ? "Copied" : "Copy summary"}
    </button>
  );
}
