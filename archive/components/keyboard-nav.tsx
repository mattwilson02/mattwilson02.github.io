"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface KeyboardNavProps {
  context: "listing" | "post";
  // For listing context:
  onFocusSearch?: () => void;
  onClearFilters?: () => void;
  // For post context:
  previousSlug?: string;
  nextSlug?: string;
}

export function KeyboardNav({
  context,
  onFocusSearch,
  onClearFilters,
  previousSlug,
  nextSlug,
}: KeyboardNavProps) {
  const router = useRouter();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      const isTyping =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.getAttribute("contenteditable") === "true";

      if (context === "listing") {
        // Escape works even when focused in an input
        if (e.key === "Escape") {
          onClearFilters?.();
          if (isTyping) (target as HTMLInputElement).blur?.();
          return;
        }
        if (isTyping) return;
        if (e.key === "/") {
          e.preventDefault();
          onFocusSearch?.();
        }
      } else if (context === "post") {
        if (isTyping && e.key !== "Escape") return;
        if (e.key === "j") {
          if (nextSlug) router.push(`/blog/${nextSlug}`);
        } else if (e.key === "k") {
          if (previousSlug) router.push(`/blog/${previousSlug}`);
        } else if (e.key === "b" || e.key === "Escape") {
          router.push("/blog");
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [context, onFocusSearch, onClearFilters, previousSlug, nextSlug, router]);

  return null;
}
