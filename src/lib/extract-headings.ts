export interface TocHeading {
  level: 2 | 3;
  text: string;
  id: string;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export function extractHeadings(markdown: string): TocHeading[] {
  const headings: TocHeading[] = [];
  const lines = markdown.split("\n");

  for (const line of lines) {
    const h3Match = line.match(/^### (.+)$/);
    if (h3Match) {
      const text = h3Match[1].trim();
      headings.push({ level: 3, text, id: slugify(text) });
      continue;
    }

    const h2Match = line.match(/^## (.+)$/);
    if (h2Match) {
      const text = h2Match[1].trim();
      headings.push({ level: 2, text, id: slugify(text) });
    }
  }

  return headings;
}
