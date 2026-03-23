"use client";

import { isValidElement, Children, useRef, useState } from "react";

const LANGUAGE_DISPLAY_NAMES: Record<string, string> = {
  typescript: "TypeScript",
  javascript: "JavaScript",
  json: "JSON",
  python: "Python",
  bash: "Bash",
  tsx: "TSX",
  jsx: "JSX",
  css: "CSS",
  html: "HTML",
  go: "Go",
  rust: "Rust",
  yaml: "YAML",
  sql: "SQL",
};

function getLanguageLabel(children: React.ReactNode): string | null {
  for (const child of Children.toArray(children)) {
    if (isValidElement(child)) {
      const className =
        (child.props as { className?: string }).className ?? "";
      const match = className.match(/\blanguage-(\w+)\b/);
      if (match) {
        const lang = match[1];
        return LANGUAGE_DISPLAY_NAMES[lang] ?? lang.charAt(0).toUpperCase() + lang.slice(1);
      }
    }
  }
  return null;
}

interface CodeBlockProps {
  children?: React.ReactNode;
}

export function CodeBlock({ children }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);
  const language = getLanguageLabel(children);

  const handleCopy = () => {
    const text = preRef.current?.textContent ?? "";
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="relative">
      <pre ref={preRef} className={language ? "pt-8" : undefined}>
        {children}
      </pre>
      {language && (
        <span className="absolute left-3 top-2 select-none text-xs text-[var(--color-muted)] pointer-events-none">
          {language}
        </span>
      )}
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
