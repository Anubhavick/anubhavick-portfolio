import { stackCategorySchema, type StackCategory } from "./schema";

/**
 * Real stack, grouped the same way the resume's Skills section groups it —
 * one category per resume line so this stays the single source of truth
 * without editorializing a different taxonomy on top.
 */
export const stackCategories: StackCategory[] = [
  {
    id: "languages",
    label: "Languages",
    monogram: "LNG",
    items: [
      { name: "JavaScript" },
      { name: "TypeScript" },
      { name: "C++" },
      { name: "Python" },
      { name: "Swift" },
      { name: "C" },
    ],
  },
  {
    id: "frontend",
    label: "Frontend",
    monogram: "FED",
    items: [
      { name: "React" },
      { name: "Next.js" },
      { name: "SwiftUI" },
      { name: "Tailwind CSS" },
      { name: "Redux" },
      { name: "Zustand" },
    ],
  },
  {
    id: "databases",
    label: "Databases",
    monogram: "DBS",
    items: [
      { name: "MongoDB" },
      { name: "PostgreSQL" },
      { name: "MySQL" },
      { name: "Redis" },
      { name: "Prisma ORM" },
      { name: "Supabase" },
    ],
  },
  {
    id: "backend",
    label: "Backend & APIs",
    monogram: "API",
    items: [
      { name: "Node.js" },
      { name: "Express.js" },
      { name: "FastAPI" },
      { name: "REST" },
      { name: "GraphQL" },
      { name: "WebSockets" },
    ],
  },
  {
    id: "testing",
    label: "Testing",
    monogram: "TST",
    items: [{ name: "Jest" }, { name: "Pytest" }, { name: "Vitest" }],
  },
  {
    id: "cloud-devops",
    label: "Cloud & DevOps",
    monogram: "OPS",
    items: [
      { name: "AWS (EC2, S3, Lambda)" },
      { name: "Docker" },
      { name: "Kubernetes" },
      { name: "Terraform" },
      { name: "CI/CD" },
      { name: "GitHub Actions" },
    ],
  },
  {
    id: "ai-ml",
    label: "AI/ML",
    monogram: "AIM",
    items: [
      { name: "LiteLLM" },
      { name: "OpenAI API" },
      { name: "Anthropic API" },
      { name: "LangChain" },
      { name: "Pinecone" },
      { name: "TensorFlow" },
      { name: "Vector Databases" },
    ],
  },
  {
    id: "tools",
    label: "Tools",
    monogram: "TLS",
    items: [
      { name: "Git" },
      { name: "Figma" },
      { name: "Framer" },
      { name: "RabbitMQ" },
    ],
  },
];

stackCategories.forEach((category) => stackCategorySchema.parse(category));
