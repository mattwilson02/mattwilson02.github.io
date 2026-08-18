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

  // Links sit inside a pill, so each one gets its own rounded hit area and the
  // active one is filled rather than just brightened.
  const desktopClass = (link: NavLink) =>
    isActive(link)
      ? "rounded-full bg-[var(--color-accent)]/15 px-3.5 py-1.5 text-sm font-medium text-[var(--color-foreground)] transition-colors"
      : "rounded-full px-3.5 py-1.5 text-sm text-[var(--color-muted)] transition-colors hover:bg-[var(--color-accent)]/10 hover:text-[var(--color-foreground)]";

  // min-h-11 is 44px — the smallest target a thumb reliably hits. py-3 alone
  // gave 40px rows.
  const mobileClass = (link: NavLink) =>
    isActive(link)
      ? "flex min-h-11 items-center text-sm font-medium text-[var(--color-foreground)] transition-colors"
      : "flex min-h-11 items-center text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-foreground)]";

  return (
    // The header itself is transparent. The emphasis lives on the pill around
    // the links, not on a full-width grey band across the top. Matt's call —
    // and it still holds at md and up.
    //
    // On a phone there is no pill to carry a background, so the bar was
    // genuinely transparent at every scroll position: the wordmark and the
    // menu icon printed straight over body copy. "Built for how you actually
    // work" and "Writing" both had "Matt Wilson" stamped across them. Mobile
    // therefore gets a backdrop once the page moves, or whenever the menu is
    // open; md and up is unchanged.
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        isScrolled || menuOpen
          ? "border-b border-[var(--color-border)] bg-[var(--color-background)]/90 backdrop-blur-md md:border-b-0 md:bg-transparent md:backdrop-blur-none"
          : ""
      }`}
    >
      <nav
        aria-label="Main navigation"
        className={`mx-auto flex max-w-5xl items-center px-6 py-4 ${
          isHome ? "justify-between md:justify-center md:gap-8" : "justify-between"
        }`}
      >
        {/* On home the wordmark is hidden from md up — the hero says the name
            at full size in the same viewport, so a second one is noise. On a
            phone the hero name sits well below the fold and the bar would
            otherwise hold nothing but a menu icon, so it stays. Every other
            page has no hero and keeps it at all widths. */}
        <Link
          href="/"
          className={`-my-2.5 py-2.5 text-base font-semibold tracking-tight transition-colors hover:text-[var(--color-accent)] ${
            isHome ? "md:hidden" : ""
          }`}
          onClick={() => setMenuOpen(false)}
        >
          Matt Wilson
        </Link>

        <ul
          className={`hidden items-center gap-1 rounded-full border border-[var(--color-accent)]/25 p-1.5 backdrop-blur-xl transition-all duration-200 md:flex ${
            isScrolled
              ? "border-[var(--color-accent)]/40 bg-[var(--color-band)]/90 shadow-[0_8px_24px_-16px_rgba(0,0,0,0.9)]"
              : "bg-[var(--color-background)]/50"
          }`}
        >
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
            className="-mr-2.5 flex h-11 w-11 items-center justify-center rounded-md transition-colors hover:bg-[var(--color-card)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] md:hidden"
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
          className="border-b border-[var(--color-border)] bg-[var(--color-background)]/90 backdrop-blur-md md:hidden"
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
                className="inline-flex min-h-11 items-center rounded-md bg-[var(--color-accent)] px-5 text-sm font-semibold text-white"
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
