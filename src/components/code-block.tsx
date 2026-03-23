"use client";

import { useRef, useState } from "react";

interface CodeBlockProps {
  children?: React.ReactNode;
}

export function CodeBlock({ children }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  const handleCopy = () => {
    const text = preRef.current?.textContent ?? "";
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="relative">
      <pre ref={preRef}>{children}</pre>
      <button
        onClick={handleCopy}
        aria-label="Copy code to clipboard"
        className="absolute right-2 top-2 rounded bg-[var(--color-border)] px-2 py-1 text-xs text-[var(--color-foreground)] transition-colors hover:opacity-80"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}
