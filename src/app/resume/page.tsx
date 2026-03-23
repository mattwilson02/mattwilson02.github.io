import { resumeConfig } from "@/data/resume";
import { experienceData } from "@/data/experience";
import { skillCategories } from "@/data/skills";
import { certificationsData } from "@/data/certifications";
import { PrintButton } from "./print-button";

export default function ResumePage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
      {/* Print button — hidden in print */}
      <div className="print:hidden mb-6 flex justify-end">
        <PrintButton />
      </div>

      {/* Header */}
      <header className="mb-6 border-b border-[var(--color-border)] pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--color-foreground)]">
          {resumeConfig.name}
        </h1>
        <p className="mt-1 text-base text-[var(--color-muted)]">
          {resumeConfig.title}
        </p>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-[var(--color-muted)]">
          <a
            href={`mailto:${resumeConfig.email}`}
            className="transition-colors hover:text-[var(--color-foreground)]"
          >
            {resumeConfig.email}
          </a>
          <a
            href={`https://${resumeConfig.github}`}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-[var(--color-foreground)]"
          >
            {resumeConfig.github}
          </a>
          <a
            href={`https://${resumeConfig.linkedin}`}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-[var(--color-foreground)]"
          >
            {resumeConfig.linkedin}
          </a>
          <span>{resumeConfig.location}</span>
        </div>
      </header>

      {/* Summary */}
      <section className="mb-6 resume-section">
        <h2 className="mb-2 border-b border-[var(--color-border)] pb-1 text-sm font-bold uppercase tracking-wide text-[var(--color-foreground)]">
          Summary
        </h2>
        <p className="text-sm leading-relaxed text-[var(--color-muted)]">
          {resumeConfig.summary}
        </p>
      </section>

      {/* Experience */}
      <section className="mb-6 resume-section">
        <h2 className="mb-3 border-b border-[var(--color-border)] pb-1 text-sm font-bold uppercase tracking-wide text-[var(--color-foreground)]">
          Experience
        </h2>
        <div className="space-y-5">
          {experienceData.map((entry) => (
            <div key={entry.company} className="resume-entry">
              <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
                <span className="text-sm font-bold text-[var(--color-foreground)]">
                  {entry.company}
                </span>
                <span className="text-xs text-[var(--color-muted)]">
                  {entry.period}
                </span>
              </div>
              <p className="mb-2 text-xs text-[var(--color-muted)]">
                {entry.role}
              </p>
              <div className="space-y-3">
                {entry.projects.map((project) => (
                  <div key={project.name}>
                    <p className="mb-1 text-xs font-semibold text-[var(--color-foreground)]">
                      {project.name}
                    </p>
                    <ul className="mb-1 list-disc pl-4 text-xs leading-relaxed text-[var(--color-muted)]">
                      {project.highlights.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                    <p className="text-xs text-[var(--color-muted)] opacity-75">
                      {project.techSummary}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className="mb-6 resume-section">
        <h2 className="mb-3 border-b border-[var(--color-border)] pb-1 text-sm font-bold uppercase tracking-wide text-[var(--color-foreground)]">
          Skills
        </h2>
        <div className="grid grid-cols-1 gap-1.5 md:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((cat) => (
            <div key={cat.category} className="text-xs">
              <span className="font-semibold text-[var(--color-foreground)]">
                {cat.category}:{" "}
              </span>
              <span className="text-[var(--color-muted)]">
                {cat.skills.join(", ")}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Certifications */}
      <section className="mb-6 resume-section">
        <h2 className="mb-3 border-b border-[var(--color-border)] pb-1 text-sm font-bold uppercase tracking-wide text-[var(--color-foreground)]">
          Certifications
        </h2>
        <ul className="space-y-1">
          {certificationsData.map((cert) => (
            <li key={cert.name} className="text-xs text-[var(--color-muted)]">
              <span className="font-semibold text-[var(--color-foreground)]">
                {cert.name}
              </span>{" "}
              — {cert.issuer}, {cert.date}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
