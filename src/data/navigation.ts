/**
 * Navigation.
 *
 * Anchors and routes are different things and must not share a code path —
 * mixing them is what broke the active state (an in-page anchor id can never
 * match a route, and the scroll-spy was tracking both).
 *
 *  - `anchor` links point at a section on the home page. They get their active
 *    state from the scroll-spy, and only while you are on the home page.
 *  - `route` links point at another page. They get their active state from the
 *    pathname, never from scrolling.
 */

export type NavLinkKind = "anchor" | "route";

export interface NavLink {
  label: string;
  id: string;
  kind: NavLinkKind;
  /** Used when rendered on the home page. Anchors only. */
  anchor?: string;
  /** Used everywhere else, and always for route links. */
  route: string;
}

export const navLinks: NavLink[] = [
  { label: "Home", id: "home", kind: "anchor", anchor: "#home", route: "/" },
  // Linked 19 Aug — the copy exists now and /about no longer 404s. Second in
  // the menu, not last: Matt's call. A stranger arriving from a post wants to
  // know who this is before they read how the engagement runs.
  { label: "About", id: "about", kind: "route", route: "/about" },
  { label: "Writing", id: "writing", kind: "route", route: "/blog" },
];

// "How it works" was removed from the nav on 19 Aug — Matt's call. Once /about
// existed, the menu held three routes and one in-page anchor, and a link that
// scrolls sits oddly beside three that navigate. The section itself is
// untouched and still does its job on the home page; only the menu entry went.

/** Section ids the scroll-spy is allowed to track. */
export const anchorIds = navLinks
  .filter((l) => l.kind === "anchor")
  .map((l) => l.id);

export const calendlyUrl = "https://calendly.com/mattwilsontech/discovery";
