"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { projects } from "@/content";
import { ProjectDetail } from "./project-detail";
import { ProjectList } from "./project-list";

/**
 * The Projects window's body. Reads the URL directly (rather than a
 * separate selection store) so visiting /projects/[slug] and clicking a
 * project card inside the already-open window are the exact same code
 * path: both just change the URL, and this re-renders off usePathname().
 */
export function ProjectsWindowContent() {
  const pathname = usePathname();
  const match = pathname.match(/^\/projects\/([^/]+)\/?$/);

  if (match) {
    const project = projects.find((p) => p.slug === match[1]);
    if (project) return <ProjectDetail project={project} backHref="/projects" />;
    return (
      <div className="flex flex-col items-center justify-center gap-2 p-6 text-center">
        <p className="text-sm text-ink-muted">No project matches &quot;{match[1]}&quot;.</p>
        <Link href="/projects" className="text-sm text-accent underline-offset-4 hover:underline">
          ← All projects
        </Link>
      </div>
    );
  }

  return <ProjectList projects={projects} />;
}
