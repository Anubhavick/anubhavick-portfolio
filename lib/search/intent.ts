import { appDefinitions, projects } from "@/content";
import type { AppDefinition } from "@/content/schema";
import { openWindowTarget } from "@/lib/use-open-window";
import { useSettingsStore } from "@/lib/settings-store";
import { useWindowStore } from "@/lib/window-store";
import { bestScore } from "./fuzzy";

export interface IntentMatch {
  label: string;
  run: () => void;
}

function findApp(query: string): AppDefinition | null {
  const q = query.trim();
  if (!q) return null;
  let best: { app: AppDefinition; score: number } | null = null;
  for (const app of appDefinitions) {
    const score = bestScore(q, [app.id, app.name]);
    if (score !== null && (!best || score > best.score)) best = { app, score };
  }
  return best?.app ?? null;
}

/**
 * A small rule-based parser over the search box's raw text — no LLM call:
 * this has to feel instant, and the vocabulary is deliberately narrow.
 * Returns the single best action for a recognized phrase, or null to fall
 * back to plain fuzzy matching.
 */
export function matchIntent(input: string): IntentMatch | null {
  const lower = input.trim().toLowerCase();
  if (!lower) return null;

  if (lower === "close all" || lower === "close all windows") {
    return { label: "Close all windows", run: () => useWindowStore.getState().closeAll() };
  }

  if (lower === "dark mode") {
    return { label: "Switch to dark theme", run: () => useSettingsStore.getState().setTheme("dark") };
  }
  if (lower === "light mode") {
    return { label: "Switch to light theme", run: () => useSettingsStore.getState().setTheme("light") };
  }

  let m = lower.match(/^(?:open|show|launch)\s+(.+)$/);
  if (m) {
    const app = findApp(m[1]);
    if (app) {
      return { label: `Open ${app.name}`, run: () => openWindowTarget({ kind: "app", appId: app.id }) };
    }
  }

  m = lower.match(/^close\s+(.+)$/);
  if (m) {
    const app = findApp(m[1]);
    if (app) {
      return {
        label: `Close ${app.name}`,
        run: () => {
          const win = useWindowStore
            .getState()
            .windows.find((w) => w.target.kind === "app" && w.target.appId === app.id);
          if (win) useWindowStore.getState().closeWindow(win.id);
        },
      };
    }
  }

  m = lower.match(/^go ?to\s+(.+)$/);
  if (m) {
    const query = m[1];
    const project = projects.find(
      (p) => p.title.toLowerCase().includes(query) || p.slug.toLowerCase().includes(query),
    );
    if (project) {
      return {
        label: `Go to ${project.title}`,
        run: () => openWindowTarget({ kind: "app", appId: "projects" }),
      };
    }
  }

  return null;
}
