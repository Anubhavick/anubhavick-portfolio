"use client";

import { useCallback } from "react";
import { resolveWindowMeta } from "./window-content";
import { useWindowStore, type WindowTarget } from "./window-store";

/**
 * Resolves a target's content metadata, captures the launching element's
 * rect for the scale-from-origin open animation, and opens (or focuses) the
 * window — the one path every launcher (desktop icon, dock icon, folder
 * child) goes through.
 */
export function useOpenWindow() {
  const openWindow = useWindowStore((s) => s.openWindow);

  return useCallback(
    (target: WindowTarget, launcherEl: HTMLElement | null) => {
      const meta = resolveWindowMeta(target);
      if (!meta) return;

      const rect = launcherEl?.getBoundingClientRect();
      const originRect = rect
        ? { x: rect.x, y: rect.y, width: rect.width, height: rect.height }
        : {
            x: window.innerWidth / 2 - 2,
            y: window.innerHeight / 2 - 2,
            width: 4,
            height: 4,
          };

      openWindow(target, {
        title: meta.title,
        icon: meta.icon,
        defaultSize: meta.defaultSize,
        originRect,
        launcherEl,
        singleton: meta.app ? meta.app.singleton : true,
      });
    },
    [openWindow],
  );
}
