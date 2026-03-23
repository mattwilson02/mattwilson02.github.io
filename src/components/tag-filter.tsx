"use client";

interface TagFilterProps {
  tags: string[];
  activeTag: string | null;
  onTagSelect: (tag: string | null) => void;
}

export function TagFilter({ tags, activeTag, onTagSelect }: TagFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onTagSelect(null)}
        aria-pressed={activeTag === null}
        className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
          activeTag === null
            ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
            : "cursor-pointer border-[var(--color-border)] bg-[var(--color-card)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
        }`}
      >
        All
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onTagSelect(activeTag === tag ? null : tag)}
          aria-pressed={activeTag === tag}
          className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
            activeTag === tag
              ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
              : "cursor-pointer border-[var(--color-border)] bg-[var(--color-card)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
