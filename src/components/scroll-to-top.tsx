"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    function onScroll() {
      setIsVisible(window.scrollY > 500);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleClick() {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  }

  return (
    <button
      onClick={handleClick}
      aria-label="Scroll to top"
      className={`fixed bottom-6 right-6 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-accent)] text-white shadow-md hover:bg-[var(--color-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 ${
        prefersReducedMotion ? "" : "transition-opacity duration-200"
      } ${isVisible ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="18 15 12 9 6 15" />
      </svg>
    </button>
  );
}
