"use client";

import { useCallback } from "react";
import { resolveWindowMeta } from "./window-content";
import { useWindowStore, type WindowTarget } from "./window-store";

/**
 * A tiny rect at the center of the viewport — the origin used for the
 * open/close animation when there's no launching element to grow from
 * (a direct URL visit to a content route, rather than a click).
 */
export function centerOriginRect() {
  return {
    x: window.innerWidth / 2 - 2,
    y: window.innerHeight / 2 - 2,
    width: 4,
    height: 4,
  };
}

/**
 * Resolves a target's content metadata, captures the launching element's
 * rect for the scale-from-origin open animation, and opens (or focuses) the
 * window. The one path every launcher goes through — desktop icon, dock
 * icon, folder child, and non-component callers (terminal commands, search
 * results) that have no launcher element and no surrounding component tree
 * to call a hook from.
 */
export function openWindowTarget(target: WindowTarget, launcherEl: HTMLElement | null = null): string | null {
  const meta = resolveWindowMeta(target);
  if (!meta) return null;

  const rect = launcherEl?.getBoundingClientRect();
  const originRect = rect
    ? { x: rect.x, y: rect.y, width: rect.width, height: rect.height }
    : centerOriginRect();

  return useWindowStore.getState().openWindow(target, {
    title: meta.title,
    icon: meta.icon,
    defaultSize: meta.defaultSize,
    originRect,
    launcherEl,
    singleton: meta.app ? meta.app.singleton : true,
  });
}

export function useOpenWindow() {
  return useCallback(
    (target: WindowTarget, launcherEl: HTMLElement | null) => openWindowTarget(target, launcherEl),
    [],
  );
}
