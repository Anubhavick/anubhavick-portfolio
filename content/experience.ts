import { experienceEntrySchema, type ExperienceEntry } from "./schema";

/**
 * Placeholder experience — 2 fake entries satisfying `experienceEntrySchema`.
 * Phase 4 replaces the values, not the shape.
 */
export const experience: ExperienceEntry[] = [
  {
    id: "exp-placeholder-co",
    organization: "Placeholder Co.",
    role: "Software Engineering Intern",
    location: "Remote",
    startDate: "2024-05",
    endDate: "2024-08",
    summary:
      "Placeholder summary of this internship. Replace with real content in Phase 4.",
    highlights: [
      "Placeholder highlight about a feature shipped.",
      "Placeholder highlight about a measurable improvement made.",
    ],
    stack: ["TypeScript", "React", "PostgreSQL"],
  },
  {
    id: "exp-placeholder-labs",
    organization: "Placeholder Labs",
    role: "Student Developer",
    location: "Faridabad, India",
    startDate: "2023-08",
    summary:
      "Placeholder summary of ongoing student work. Replace with real content in Phase 4.",
    highlights: ["Placeholder highlight about a campus project."],
    stack: ["Next.js", "Python"],
  },
];

experience.forEach((entry) => experienceEntrySchema.parse(entry));
