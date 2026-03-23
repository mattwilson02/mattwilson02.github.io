"use client";

import { useEffect, useState } from "react";
import { ThemeToggle } from "./theme-toggle";
import { homeNavLinks, blogNavLinks } from "@/data/navigation";

interface NavProps {
  showBlogLink?: boolean;
}

export function Nav({ showBlogLink = false }: NavProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState("home");

  const navLinks = showBlogLink ? blogNavLinks : homeNavLinks;

  useEffect(() => {
    function onScroll() {
      setIsScrolled(window.scrollY > 8);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (showBlogLink) return;

    const sectionIds = homeNavLinks.map((l) => l.id);
    const offset = 120;

    function updateActive() {
      if (window.scrollY < 100) {
        setActiveId("home");
        return;
      }

      let closest: string | null = null;
      let closestDist = Infinity;

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top - offset;
        if (top <= 0 && Math.abs(top) < closestDist) {
          closestDist = Math.abs(top);
          closest = id;
        }
      }

      if (closest) setActiveId(closest);
    }

    window.addEventListener("scroll", updateActive, { passive: true });
    updateActive();

    return () => window.removeEventListener("scroll", updateActive);
  }, [showBlogLink]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  function handleLinkClick() {
    setMenuOpen(false);
  }

  function linkClass(id: string) {
    return !showBlogLink && activeId === id
      ? "text-sm font-medium text-[var(--color-foreground)] transition-colors"
      : "text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-foreground)]";
  }

  function mobileLinkClass(id: string) {
    return !showBlogLink && activeId === id
      ? "block py-3 text-sm font-medium text-[var(--color-foreground)] transition-colors"
      : "block py-3 text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-foreground)]";
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full backdrop-blur-md transition-all duration-200 ${
        isScrolled
          ? "border-b border-[var(--color-border)] bg-[var(--color-background)]/90"
          : "bg-[var(--color-background)]/80"
      }`}
    >
      <nav
        aria-label="Main navigation"
        className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4"
      >
        {/* Logo */}
        <a
          href={showBlogLink ? "/" : "#home"}
          className="text-base font-semibold tracking-tight transition-colors hover:text-[var(--color-accent)]"
          onClick={handleLinkClick}
        >
          Matt Wilson
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-5 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} className={linkClass(link.id)}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right: theme toggle + hamburger */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {/* Hamburger — mobile only */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:bg-[var(--color-card)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] md:hidden"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {menuOpen ? (
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
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
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
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="border-t border-[var(--color-border)] bg-[var(--color-background)]/95 backdrop-blur-md md:hidden"
        >
          <ul className="mx-auto flex max-w-5xl flex-col px-6 py-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={handleLinkClick}
                  className={mobileLinkClass(link.id)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
