import { create } from "zustand";
import type { AppId } from "@/content/schema";
import type { Rect } from "./motion";

export const MIN_WINDOW_SIZE = { width: 320, height: 240 };
export const MAX_OPEN_WINDOWS = 6;
export const MENU_BAR_HEIGHT = 28;
const CASCADE_STEP = 28;
const CASCADE_BASE = { x: 96, y: MENU_BAR_HEIGHT + 48 };

export type WindowTarget =
  | { kind: "app"; appId: AppId }
  | { kind: "folder"; fileId: string };

export function launchKey(target: WindowTarget): string {
  return target.kind === "app" ? `app:${target.appId}` : `folder:${target.fileId}`;
}

export interface WindowState {
  id: string;
  target: WindowTarget;
  title: string;
  icon: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  minimised: boolean;
  maximised: boolean;
  /** Rect (in viewport coords) this window grows from / shrinks to. */
  origin: Rect;
  /** Saved rect to restore to when un-maximising. */
  preMaximizeRect: Rect | null;
  /** Element focus returns to when this window closes. */
  launcherEl: HTMLElement | null;
}

export interface OpenWindowOptions {
  title: string;
  icon: string;
  defaultSize: { width: number; height: number };
  originRect: Rect;
  launcherEl?: HTMLElement | null;
  /** Reuse + focus an existing window for this target instead of opening a
   * second one. Defaults to true (every app in content/apps.ts is
   * currently singleton). */
  singleton?: boolean;
}

interface WindowStoreState {
  windows: WindowState[];
  focusedId: string | null;
  nextZ: number;
  openWindow: (target: WindowTarget, opts: OpenWindowOptions) => string;
  closeWindow: (id: string) => void;
  closeFocusedWindow: () => void;
  closeTopWindow: () => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  toggleMinimize: (id: string) => void;
  toggleMaximize: (id: string, fullRect: Rect) => void;
  moveWindow: (id: string, x: number, y: number) => void;
  setRect: (id: string, rect: Rect) => void;
  cycleWindows: (direction?: 1 | -1) => void;
  closeAll: () => void;
  minimizeAll: () => void;
  cascadeAll: () => void;
  clampAllToViewport: (viewportWidth: number, viewportHeight: number) => void;
}

function nextCascadePosition(openCount: number) {
  const slot = openCount % 8;
  return {
    x: CASCADE_BASE.x + slot * CASCADE_STEP,
    y: CASCADE_BASE.y + slot * CASCADE_STEP,
  };
}

export const useWindowStore = create<WindowStoreState>()((set, get) => ({
  windows: [],
  focusedId: null,
  nextZ: 1,

  openWindow: (target, opts) => {
    const key = launchKey(target);
    const singleton = opts.singleton ?? true;

    if (singleton) {
      const existing = get().windows.find((w) => launchKey(w.target) === key);
      if (existing) {
        get().restoreWindow(existing.id);
        return existing.id;
      }
    }

    const id = `${key}:${Date.now().toString(36)}:${Math.random()
      .toString(36)
      .slice(2, 7)}`;
    const { x, y } = nextCascadePosition(get().windows.length);

    set((state) => {
      let windows = state.windows;
      let nextZ = state.nextZ;

      if (windows.length >= MAX_OPEN_WINDOWS) {
        const lru = windows.reduce((min, w) =>
          w.zIndex < min.zIndex ? w : min,
        );
        windows = windows.filter((w) => w.id !== lru.id);
      }

      const z = nextZ++;
      const win: WindowState = {
        id,
        target,
        title: opts.title,
        icon: opts.icon,
        x,
        y,
        width: opts.defaultSize.width,
        height: opts.defaultSize.height,
        zIndex: z,
        minimised: false,
        maximised: false,
        origin: opts.originRect,
        preMaximizeRect: null,
        launcherEl: opts.launcherEl ?? null,
      };

      return { windows: [...windows, win], focusedId: id, nextZ };
    });

    return id;
  },

  closeWindow: (id) => {
    set((state) => {
      const closing = state.windows.find((w) => w.id === id);
      const remaining = state.windows.filter((w) => w.id !== id);
      let focusedId = state.focusedId;
      if (focusedId === id) {
        const top = remaining
          .filter((w) => !w.minimised)
          .reduce<WindowState | null>(
            (max, w) => (!max || w.zIndex > max.zIndex ? w : max),
            null,
          );
        focusedId = top?.id ?? null;
      }
      if (closing?.launcherEl) {
        // Return focus to the icon/dock item that launched this window.
        queueMicrotask(() => closing.launcherEl?.focus());
      }
      return { windows: remaining, focusedId };
    });
  },

  closeFocusedWindow: () => {
    const { focusedId } = get();
    if (focusedId) get().closeWindow(focusedId);
  },

  closeTopWindow: () => {
    const top = get()
      .windows.filter((w) => !w.minimised)
      .reduce<WindowState | null>(
        (max, w) => (!max || w.zIndex > max.zIndex ? w : max),
        null,
      );
    if (top) get().closeWindow(top.id);
  },

  focusWindow: (id) => {
    set((state) => {
      const z = state.nextZ;
      return {
        nextZ: z + 1,
        focusedId: id,
        windows: state.windows.map((w) =>
          w.id === id ? { ...w, zIndex: z, minimised: false } : w,
        ),
      };
    });
  },

  minimizeWindow: (id) => {
    set((state) => {
      const windows = state.windows.map((w) =>
        w.id === id ? { ...w, minimised: true } : w,
      );
      let focusedId = state.focusedId;
      if (focusedId === id) {
        const top = windows
          .filter((w) => !w.minimised)
          .reduce<WindowState | null>(
            (max, w) => (!max || w.zIndex > max.zIndex ? w : max),
            null,
          );
        focusedId = top?.id ?? null;
      }
      return { windows, focusedId };
    });
  },

  restoreWindow: (id) => {
    get().focusWindow(id);
  },

  toggleMinimize: (id) => {
    const win = get().windows.find((w) => w.id === id);
    if (!win) return;
    if (win.minimised) get().restoreWindow(id);
    else get().minimizeWindow(id);
  },

  toggleMaximize: (id, fullRect) => {
    set((state) => ({
      windows: state.windows.map((w) => {
        if (w.id !== id) return w;
        if (w.maximised) {
          const restore = w.preMaximizeRect ?? {
            x: w.x,
            y: w.y,
            width: w.width,
            height: w.height,
          };
          return { ...w, maximised: false, preMaximizeRect: null, ...restore };
        }
        return {
          ...w,
          maximised: true,
          preMaximizeRect: { x: w.x, y: w.y, width: w.width, height: w.height },
          ...fullRect,
        };
      }),
    }));
  },

  moveWindow: (id, x, y) => {
    set((state) => ({
      windows: state.windows.map((w) => (w.id === id ? { ...w, x, y } : w)),
    }));
  },

  setRect: (id, rect) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id
          ? {
              ...w,
              x: rect.x,
              y: rect.y,
              width: Math.max(rect.width, MIN_WINDOW_SIZE.width),
              height: Math.max(rect.height, MIN_WINDOW_SIZE.height),
              maximised: false,
            }
          : w,
      ),
    }));
  },

  cycleWindows: (direction = 1) => {
    const { windows, focusedId } = get();
    if (windows.length < 2) return;
    const ordered = [...windows].sort((a, b) => a.zIndex - b.zIndex);
    const currentIndex = ordered.findIndex((w) => w.id === focusedId);
    const startIndex = currentIndex === -1 ? ordered.length - 1 : currentIndex;
    const nextIndex =
      (startIndex + direction + ordered.length) % ordered.length;
    get().restoreWindow(ordered[nextIndex].id);
  },

  closeAll: () => set({ windows: [], focusedId: null }),

  minimizeAll: () =>
    set((state) => ({
      windows: state.windows.map((w) => ({ ...w, minimised: true })),
      focusedId: null,
    })),

  cascadeAll: () =>
    set((state) => ({
      windows: state.windows.map((w, i) => {
        if (w.maximised) return w;
        const { x, y } = nextCascadePosition(i);
        return { ...w, x, y };
      }),
    })),

  clampAllToViewport: (viewportWidth, viewportHeight) => {
    set((state) => ({
      windows: state.windows.map((w) => {
        const width = Math.min(
          Math.max(w.width, MIN_WINDOW_SIZE.width),
          viewportWidth,
        );
        const height = Math.min(
          Math.max(w.height, MIN_WINDOW_SIZE.height),
          viewportHeight - MENU_BAR_HEIGHT,
        );
        const x = Math.min(Math.max(w.x, 0), Math.max(viewportWidth - width, 0));
        const y = Math.min(
          Math.max(w.y, MENU_BAR_HEIGHT),
          Math.max(viewportHeight - height, MENU_BAR_HEIGHT),
        );
        return w.maximised ? w : { ...w, x, y, width, height };
      }),
    }));
  },
}));
