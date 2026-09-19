import { projectSchema, type Project } from "./schema";

/**
 * Placeholder projects — 3 fake entries satisfying `projectSchema`. Phase 4
 * replaces the values, not the shape.
 */
export const projects: Project[] = [
  {
    id: "proj-aperture",
    slug: "aperture",
    title: "Aperture",
    summary: "A placeholder one-line summary of the Aperture project.",
    description:
      "A placeholder longer description of Aperture: the problem, the approach, and the outcome. Replace with real project content in Phase 4.",
    role: "Full-stack developer",
    year: 2025,
    status: "shipped",
    featured: true,
    stack: ["Next.js", "TypeScript", "PostgreSQL"],
    links: [
      { label: "Live", url: "https://example.com/aperture", kind: "live" },
      {
        label: "Source",
        url: "https://github.com/placeholder-user/aperture",
        kind: "repo",
      },
    ],
  },
  {
    id: "proj-northwind",
    slug: "northwind",
    title: "Northwind",
    summary: "A placeholder one-line summary of the Northwind project.",
    description:
      "A placeholder longer description of Northwind. Replace with real project content in Phase 4.",
    role: "Backend developer",
    year: 2024,
    status: "in-progress",
    featured: false,
    stack: ["Node.js", "Express", "Redis"],
    links: [
      {
        label: "Source",
        url: "https://github.com/placeholder-user/northwind",
        kind: "repo",
      },
    ],
  },
  {
    id: "proj-vellum",
    slug: "vellum",
    title: "Vellum",
    summary: "A placeholder one-line summary of the Vellum project.",
    description:
      "A placeholder longer description of Vellum. Replace with real project content in Phase 4.",
    role: "Designer & developer",
    year: 2023,
    status: "archived",
    featured: false,
    stack: ["React", "Figma", "Tailwind CSS"],
    links: [],
  },
];

projects.forEach((project) => projectSchema.parse(project));
