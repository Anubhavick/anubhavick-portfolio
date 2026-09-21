import Link from "next/link";
import type { Project } from "@/content/schema";

interface ProjectListProps {
  projects: Project[];
}

/**
 * The full project list — real semantic markup (article/ul/a), used
 * unchanged by the Projects window, the /projects route, and nowhere else.
 * No hooks, so it's safe to render from either a server or a client tree.
 */
export function ProjectList({ projects }: ProjectListProps) {
  return (
    <ul className="flex flex-col gap-3 p-5">
      {projects.map((project) => (
        <li key={project.id}>
          <article className="rounded-window border border-hairline bg-surface-1 p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h3 className="text-lg text-ink">
                <Link
                  href={`/projects/${project.slug}`}
                  className="underline-offset-4 hover:text-accent hover:underline"
                >
                  {project.title}
                </Link>
              </h3>
              <span className="font-mono text-xs text-ink-muted">
                {project.year} · {project.status}
              </span>
            </div>

            <p className="mt-1.5 max-w-[68ch] text-sm text-ink-muted">{project.summary}</p>

            <ul className="mt-3 flex flex-wrap gap-1.5" aria-label={`${project.title} stack`}>
              {project.stack.map((tech) => (
                <li
                  key={tech}
                  className="rounded-control border border-hairline bg-surface-2/60 px-2 py-0.5 font-mono text-xs text-ink-muted"
                >
                  {tech}
                </li>
              ))}
            </ul>

            {project.links.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                {project.links.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-accent underline-offset-4 hover:underline"
                  >
                    {link.label} ↗
                  </a>
                ))}
              </div>
            )}
          </article>
        </li>
      ))}
    </ul>
  );
}
