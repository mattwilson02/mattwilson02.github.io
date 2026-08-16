/**
 * Temporary holding page.
 *
 * The real site lives on the `site-rebuild-v2` branch. This is deliberately
 * the whole site: /blog is removed from the build and robots is set to
 * disallow, so nothing is reachable or indexable while the content is being
 * rewritten.
 *
 * To restore: revert the holding-page commit, or merge site-rebuild-v2.
 */
export default function HoldingPage() {
  return (
    <main
      id="main-content"
      className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
    >
      <span aria-hidden="true" className="mb-8 text-4xl">
        🚧
      </span>

      <h1 className="text-2xl font-medium tracking-tight sm:text-3xl">
        Building in progress
      </h1>

      <p className="mt-4 max-w-sm text-sm leading-relaxed text-[var(--color-muted)]">
        This site is being rewritten. It will be back shortly.
      </p>

      <a
        href="mailto:matt@mattwilson.tech"
        className="mt-10 border-b border-[var(--color-border)] pb-0.5 text-sm transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
      >
        matt@mattwilson.tech
      </a>
    </main>
  );
}
