interface SectionProps {
  id: string;
  /**
   * Which of the two section tones this one sits on. The page alternates
   * base → band → base → band so the eye gets a regular beat. Before this
   * every section was base except one, which read as an accident.
   */
  tone?: "base" | "band";
  className?: string;
  children: React.ReactNode;
}

const toneClass = {
  base: "bg-[var(--color-background)]",
  band: "bg-[var(--color-band)]",
} as const;

export function Section({
  id,
  tone = "base",
  className = "",
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      className={`py-14 md:py-16 ${toneClass[tone]} ${className}`}
    >
      <div className="mx-auto max-w-5xl px-6">{children}</div>
    </section>
  );
}
