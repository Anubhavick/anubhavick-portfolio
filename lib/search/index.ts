import { appDefinitions, desktopFiles, experience, projects, stackCategories } from "@/content";
import type { DesktopFile } from "@/content/schema";
import { openWindowTarget } from "@/lib/use-open-window";
import { bestScore } from "./fuzzy";
import type { ScoredEntry, SearchEntry } from "./types";

function flattenFiles(files: DesktopFile[]): DesktopFile[] {
  return files.flatMap((f) => (f.children ? [f, ...flattenFiles(f.children)] : [f]));
}

function fileRun(file: DesktopFile): () => void {
  return () => {
    if (file.kind === "link" && file.href) {
      window.open(file.href, "_blank", "noopener,noreferrer");
      return;
    }
    if (file.kind === "folder") {
      openWindowTarget({ kind: "folder", fileId: file.id });
      return;
    }
    if (file.kind === "app" && file.appId) {
      openWindowTarget({ kind: "app", appId: file.appId });
    }
  };
}

/** Built once at module load — content is static, so the index never goes stale. */
export const searchIndex: SearchEntry[] = [
  ...appDefinitions.map(
    (app): SearchEntry => ({
      id: `app:${app.id}`,
      kind: "app",
      title: app.name,
      subtitle: app.description,
      keywords: [app.id, app.name],
      icon: app.icon,
      run: () => openWindowTarget({ kind: "app", appId: app.id }),
    }),
  ),
  ...projects.map(
    (p): SearchEntry => ({
      id: `project:${p.id}`,
      kind: "project",
      title: p.title,
      subtitle: p.summary,
      keywords: [p.title, p.slug, p.role, ...p.stack],
      icon: "app-window",
      run: () => openWindowTarget({ kind: "app", appId: "projects" }),
    }),
  ),
  ...experience.map(
    (e): SearchEntry => ({
      id: `experience:${e.id}`,
      kind: "experience",
      title: `${e.role} · ${e.organization}`,
      subtitle: e.summary,
      keywords: [e.role, e.organization, ...e.stack],
      icon: "briefcase",
      run: () => openWindowTarget({ kind: "app", appId: "experience" }),
    }),
  ),
  ...flattenFiles(desktopFiles).map(
    (f): SearchEntry => ({
      id: `file:${f.id}`,
      kind: "file",
      title: f.name,
      subtitle: f.kind,
      keywords: [f.name],
      icon: f.icon,
      run: fileRun(f),
    }),
  ),
  ...stackCategories.flatMap((cat) =>
    cat.items.map(
      (item): SearchEntry => ({
        id: `stack:${cat.id}:${item.name}`,
        kind: "stack",
        title: item.name,
        subtitle: cat.label,
        keywords: [item.name, cat.label],
        icon: "cpu",
        run: () => openWindowTarget({ kind: "app", appId: "stack" }),
      }),
    ),
  ),
];

/** Ranked matches for `query` across the whole index, best score first. */
export function searchEntries(query: string): ScoredEntry[] {
  const q = query.trim();
  if (!q) return [];
  const scored: ScoredEntry[] = [];
  for (const entry of searchIndex) {
    const score = bestScore(q, [entry.title, entry.subtitle ?? "", ...entry.keywords]);
    if (score !== null) scored.push({ entry, score });
  }
  return scored.sort((a, b) => b.score - a.score);
}
