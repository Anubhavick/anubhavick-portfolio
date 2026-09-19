import { stackCategorySchema, type StackCategory } from "./schema";

/**
 * Placeholder stack categories — 4 fake entries satisfying
 * `stackCategorySchema`. Phase 4 replaces the values, not the shape.
 */
export const stackCategories: StackCategory[] = [
  {
    id: "languages",
    label: "Languages",
    monogram: "LNG",
    items: [
      { name: "TypeScript" },
      { name: "Python" },
      { name: "Go" },
      { name: "C++" },
    ],
  },
  {
    id: "frontend",
    label: "Frontend",
    monogram: "FED",
    items: [
      { name: "React" },
      { name: "Next.js" },
      { name: "Tailwind CSS" },
      { name: "GSAP" },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    monogram: "BAK",
    items: [
      { name: "Node.js" },
      { name: "Express" },
      { name: "PostgreSQL" },
      { name: "Redis" },
    ],
  },
  {
    id: "tooling",
    label: "Tooling & DevOps",
    monogram: "OPS",
    items: [
      { name: "Docker" },
      { name: "Git" },
      { name: "Vercel" },
      { name: "Linux" },
    ],
  },
];

stackCategories.forEach((category) => stackCategorySchema.parse(category));
