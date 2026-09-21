import Link from "next/link";
import type { Project } from "@/content/schema";

interface ProjectDetailProps {
  project: Project;
  backHref: string;
}

/**
 * One project's full write-up — real semantic markup, used unchanged by
 * the Projects window (when its URL is /projects/[slug]) and the
 * /projects/[slug] route. No hooks, safe in a server or client tree.
 */
export function ProjectDetail({ project, backHref }: ProjectDetailProps) {
  const paragraphs = project.description.split("\n\n");

  return (
    <article className="flex flex-col gap-4 p-5">
      <Link
        href={backHref}
        className="w-fit text-sm text-accent underline-offset-4 hover:underline"
      >
        ← All projects
      </Link>

      <header className="flex flex-col gap-1.5">
        <h1 className="text-2xl text-ink">{project.title}</h1>
        <p className="font-mono text-xs text-ink-muted">
          {project.role} · {project.year} · {project.status}
        </p>
      </header>

      <div className="flex max-w-[68ch] flex-col gap-3 text-sm text-ink">
        {paragraphs.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      <div>
        <h2 className="text-xs uppercase tracking-wide text-ink-muted">Stack</h2>
        <ul className="mt-2 flex flex-wrap gap-1.5" aria-label={`${project.title} stack`}>
          {project.stack.map((tech) => (
            <li
              key={tech}
              className="rounded-control border border-hairline bg-surface-2/60 px-2 py-0.5 font-mono text-xs text-ink-muted"
            >
              {tech}
            </li>
          ))}
        </ul>
      </div>

      {project.links.length > 0 && (
        <div>
          <h2 className="text-xs uppercase tracking-wide text-ink-muted">Links</h2>
          <ul className="mt-2 flex flex-col gap-1">
            {project.links.map((link) => (
              <li key={link.url}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-accent underline-offset-4 hover:underline"
                >
                  {link.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
