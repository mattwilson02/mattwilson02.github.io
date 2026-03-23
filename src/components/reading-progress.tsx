"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;
      const value = Math.min(1, Math.max(0, window.scrollY / scrollHeight));
      setProgress(value);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed left-0 top-0 z-[60] h-[3px] bg-[var(--color-accent)]${
        prefersReducedMotion ? "" : " transition-[width] duration-150 ease-out"
      }`}
      style={{ width: `${progress * 100}%` }}
    />
  );
}
