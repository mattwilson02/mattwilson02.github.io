"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  navLinks,
  anchorIds,
  calendlyUrl,
  type NavLink,
} from "@/data/navigation";

export function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeAnchor, setActiveAnchor] = useState("home");

  useEffect(() => {
    function onScroll() {
      setIsScrolled(window.scrollY > 8);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy — anchors only, home page only.
  useEffect(() => {
    if (!isHome) return;

    const offset = 120;

    function updateActive() {
      if (window.scrollY < 100) {
        setActiveAnchor("home");
        return;
      }

      let closest: string | null = null;
      let closestDist = Infinity;

      for (const id of anchorIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top - offset;
        if (top <= 0 && Math.abs(top) < closestDist) {
          closestDist = Math.abs(top);
          closest = id;
        }
      }

      setActiveAnchor(closest ?? "home");
    }

    window.addEventListener("scroll", updateActive, { passive: true });
    updateActive();
    return () => window.removeEventListener("scroll", updateActive);
  }, [isHome]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  function hrefFor(link: NavLink) {
    return isHome && link.anchor ? link.anchor : link.route;
  }

  function isActive(link: NavLink) {
    if (link.kind === "route") {
      // /blog should stay active on /blog/some-post
      return pathname === link.route || pathname.startsWith(`${link.route}/`);
    }
    return isHome && activeAnchor === link.id;
  }

  const desktopClass = (link: NavLink) =>
    isActive(link)
      ? "text-sm font-medium text-[var(--color-foreground)] transition-colors"
      : "text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-foreground)]";

  const mobileClass = (link: NavLink) =>
    isActive(link)
      ? "block py-3 text-sm font-medium text-[var(--color-foreground)] transition-colors"
      : "block py-3 text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-foreground)]";

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b backdrop-blur-xl transition-all duration-200 ${
        isScrolled
          ? "border-[var(--color-border)] bg-[var(--color-band)]/95 shadow-[0_8px_24px_-16px_rgba(0,0,0,0.9)]"
          : "border-transparent bg-[var(--color-band)]/70"
      }`}
    >
      <nav
        aria-label="Main navigation"
        className={`mx-auto flex max-w-5xl items-center px-6 py-4 ${
          isHome ? "justify-center md:gap-8" : "justify-between"
        }`}
      >
        {/* Wordmark and CTA are dropped on the home page — the hero says both,
            and saying them twice in one viewport is why the centred hero felt
            crowded. Every other page has no hero, so they stay there. */}
        {!isHome && (
          <Link
            href="/"
            className="text-base font-semibold tracking-tight transition-colors hover:text-[var(--color-accent)]"
            onClick={() => setMenuOpen(false)}
          >
            Matt Wilson
          </Link>
        )}

        <ul className="hidden items-center gap-5 md:flex">
          {navLinks.map((link) => (
            <li key={link.id}>
              <a
                href={hrefFor(link)}
                className={desktopClass(link)}
                aria-current={isActive(link) ? "page" : undefined}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className={`flex items-center gap-3 ${isHome ? "md:hidden" : ""}`}>
          {!isHome && (
            <a
              href={calendlyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-md bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 md:inline-flex"
            >
              Book a call
            </a>
          )}
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

      {menuOpen && (
        <div
          id="mobile-menu"
          className="border-t border-[var(--color-border)] bg-[var(--color-background)]/95 backdrop-blur-md md:hidden"
        >
          <ul className="mx-auto flex max-w-5xl flex-col px-6 py-4">
            {navLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={hrefFor(link)}
                  onClick={() => setMenuOpen(false)}
                  className={mobileClass(link)}
                  aria-current={isActive(link) ? "page" : undefined}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="pt-3">
              <a
                href={calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="inline-flex rounded-md bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-white"
              >
                Book a call
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
