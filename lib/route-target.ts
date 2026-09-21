import type { AppId } from "@/content/schema";
import type { WindowTarget } from "./window-store";

/**
 * Maps a content route to the window it should boot with open. A direct
 * visit to /projects/[slug] resolves to the same "projects" app window —
 * the Projects window body figures out list-vs-detail from the URL itself
 * (see components/content/projects-window-content.tsx), so this only
 * needs to know which app owns the route, not the slug.
 */
const ROUTE_APP_IDS: Record<string, AppId> = {
  "/about": "about",
  "/projects": "projects",
  "/experience": "experience",
  "/stack": "stack",
  "/contact": "contact",
  "/terminal": "terminal",
  "/help": "help",
};

export function resolveRouteTarget(pathname: string): WindowTarget | null {
  const direct = ROUTE_APP_IDS[pathname];
  if (direct) return { kind: "app", appId: direct };

  if (/^\/projects\/[^/]+\/?$/.test(pathname)) {
    return { kind: "app", appId: "projects" };
  }

  return null;
}
