import type { ExperienceEntry } from "@/content/schema";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function formatRange(entry: ExperienceEntry): string {
  const [startYear, startMonth] = entry.startDate.split("-");
  const start = `${MONTHS[Number(startMonth) - 1]} ${startYear}`;
  if (!entry.endDate) return `${start} – Present`;
  const [endYear, endMonth] = entry.endDate.split("-");
  return `${start} – ${MONTHS[Number(endMonth) - 1]} ${endYear}`;
}

interface ExperienceContentProps {
  entries: ExperienceEntry[];
}

/**
 * Full work history — used unchanged by the Experience window and the
 * /experience route. No hooks, safe in a server or client tree.
 */
export function ExperienceContent({ entries }: ExperienceContentProps) {
  return (
    <ol className="flex flex-col gap-5 p-5">
      {entries.map((entry) => (
        <li key={entry.id} className="border-b border-hairline pb-5 last:border-b-0 last:pb-0">
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <h3 className="text-lg text-ink">
              {entry.role} · {entry.organization}
            </h3>
            <span className="font-mono text-xs text-ink-muted">{formatRange(entry)}</span>
          </div>
          {entry.location && <p className="text-xs text-ink-muted">{entry.location}</p>}
          <p className="mt-2 max-w-[68ch] text-sm text-ink">{entry.summary}</p>
          {entry.highlights.length > 0 && (
            <ul className="mt-2 list-disc pl-5 text-sm text-ink-muted marker:text-accent">
              {entry.highlights.map((highlight, i) => (
                <li key={i}>{highlight}</li>
              ))}
            </ul>
          )}
          {entry.stack.length > 0 && (
            <ul className="mt-2 flex flex-wrap gap-1.5" aria-label={`${entry.organization} stack`}>
              {entry.stack.map((tech) => (
                <li
                  key={tech}
                  className="rounded-control border border-hairline bg-surface-2/60 px-2 py-0.5 font-mono text-xs text-ink-muted"
                >
                  {tech}
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ol>
  );
}
