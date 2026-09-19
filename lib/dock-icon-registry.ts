import type { Rect } from "./motion";

/**
 * Module-level map from a dock/launcher key to its current DOM rect, so a
 * window opening or minimizing can animate to/from the icon that represents
 * it in the dock — without threading refs through the window store.
 */
const registry = new Map<string, HTMLElement>();

export function registerLaunchIcon(key: string, el: HTMLElement | null) {
  if (el) registry.set(key, el);
  else registry.delete(key);
}

export function getLaunchIconRect(key: string): Rect | null {
  const el = registry.get(key);
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
}
