import { ProjectData } from "@/data/projects";

interface ProjectCardProps {
  project: ProjectData;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <a
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`View ${project.title} on GitHub`}
      className="group flex h-full flex-col gap-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-6 transition-all duration-200 hover:scale-[1.02] hover:border-[var(--color-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
    >
      <div>
        <h3 className="text-lg font-bold text-[var(--color-foreground)]">
          {project.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
          {project.description}
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-3">
        <div>
          <p className="mb-1 text-xs font-semibold text-[var(--color-foreground)]">
            Problem
          </p>
          <p className="text-xs leading-relaxed text-[var(--color-muted)]">
            {project.problem}
          </p>
        </div>
        <div>
          <p className="mb-1 text-xs font-semibold text-[var(--color-foreground)]">
            Results
          </p>
          <p className="text-xs leading-relaxed text-[var(--color-muted)]">
            {project.results}
          </p>
        </div>
      </div>

      {/* Tech pills */}
      <div className="flex flex-wrap gap-2">
        {project.tech.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-1 text-xs font-medium text-[var(--color-foreground)]"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="text-xs font-medium text-[var(--color-accent)] group-hover:underline">
        View on GitHub →
      </div>
    </a>
  );
}
