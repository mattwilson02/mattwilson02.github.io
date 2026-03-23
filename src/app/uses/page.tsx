import { usesCategories } from "@/data/uses";

export default function UsesPage() {
  return (
    <div className="py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">
          Uses
        </h1>
        <p className="mb-12 text-[var(--color-muted)]">
          Tools, software, and hardware I use daily. Opinionated choices,
          briefly explained.
        </p>

        <div className="flex flex-col gap-12">
          {usesCategories.map((category) => (
            <section
              key={category.category}
              className="border-b border-[var(--color-border)] pb-12 last:border-b-0 last:pb-0"
            >
              <h2 className="mb-6 text-xl font-semibold">
                {category.category}
              </h2>
              <dl className="flex flex-col gap-4">
                {category.items.map((tool) => (
                  <div key={tool.name} className="flex flex-col gap-1">
                    <dt className="font-semibold text-[var(--color-foreground)]">
                      {tool.link ? (
                        <a
                          href={tool.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="transition-colors hover:text-[var(--color-accent)]"
                        >
                          {tool.name}
                        </a>
                      ) : (
                        tool.name
                      )}
                    </dt>
                    <dd className="text-sm leading-relaxed text-[var(--color-muted)]">
                      {tool.description}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
