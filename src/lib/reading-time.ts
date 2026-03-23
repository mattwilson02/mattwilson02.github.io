export function calculateReadingTime(content: string): string {
  // Strip fenced code blocks
  let text = content.replace(/```[\s\S]*?```/g, " ");
  // Strip inline code
  text = text.replace(/`[^`]*`/g, " ");
  // Strip images: ![alt](url)
  text = text.replace(/!\[[^\]]*\]\([^)]*\)/g, " ");
  // Strip links: [text](url) → keep text
  text = text.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1");
  // Strip heading markers
  text = text.replace(/^#{1,6}\s+/gm, "");
  // Strip bold/italic markers
  text = text.replace(/[*_]{1,3}/g, " ");
  // Strip horizontal rules
  text = text.replace(/^---+$/gm, " ");

  const wordCount = text.split(/\s+/).filter((w) => w.length > 0).length;
  const minutes = Math.max(1, Math.ceil(wordCount / 238));
  return `${minutes} min read`;
}
