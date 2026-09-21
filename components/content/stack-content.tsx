import type { StackCategory } from "@/content/schema";

interface StackContentProps {
  categories: StackCategory[];
}

/**
 * Languages/frameworks/tools grouped exactly like the resume's Skills
 * section. Used unchanged by the Stack window and the /stack route. No
 * hooks, safe in a server or client tree.
 */
export function StackContent({ categories }: StackContentProps) {
  return (
    <div className="flex flex-col gap-5 p-5">
      {categories.map((category) => (
        <section key={category.id} aria-labelledby={`stack-${category.id}`}>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-xl text-accent" aria-hidden="true">
              {category.monogram}
            </span>
            <h2 id={`stack-${category.id}`} className="text-sm text-ink-muted">
              {category.label}
            </h2>
          </div>
          <ul className="mt-2 flex flex-wrap gap-1.5" aria-label={category.label}>
            {category.items.map((item) => (
              <li
                key={item.name}
                className="rounded-control border border-hairline bg-surface-2/60 px-2 py-0.5 font-mono text-xs text-ink"
              >
                {item.name}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
