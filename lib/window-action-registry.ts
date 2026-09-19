interface WindowActions {
  close: () => void;
  minimize: () => void;
}

/**
 * Lets global keyboard shortcuts (Cmd/Ctrl+W, Escape) trigger a window's
 * animated close/minimize — the same GSAP timeline the traffic lights use —
 * instead of the store removing it instantly.
 */
const registry = new Map<string, WindowActions>();

export function registerWindowActions(id: string, actions: WindowActions) {
  registry.set(id, actions);
}

export function unregisterWindowActions(id: string) {
  registry.delete(id);
}

export function getWindowActions(id: string): WindowActions | null {
  return registry.get(id) ?? null;
}
