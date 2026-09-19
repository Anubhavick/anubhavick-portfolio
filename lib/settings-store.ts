"use client";

import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Theme and accent, written to attributes on <html> (see CLAUDE.md ->
 * "Theme and accent switching"). `theme: null` means "no explicit
 * data-theme attribute" i.e. follow prefers-color-scheme.
 */
export type Theme = "light" | "dark" | null;
export type Accent = "powder" | "system" | "ocean" | "midnight";

export const ACCENTS: Accent[] = ["powder", "system", "ocean", "midnight"];

interface SettingsState {
  theme: Theme;
  accent: Accent;
  setTheme: (theme: Theme) => void;
  setAccent: (accent: Accent) => void;
  toggleTheme: () => void;
}

/** Resolves the *effective* light/dark theme when `theme` is null. */
function effectiveTheme(theme: Theme): "light" | "dark" {
  if (theme) return theme;
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      theme: null,
      accent: "system",
      setTheme: (theme) => set({ theme }),
      setAccent: (accent) => set({ accent }),
      toggleTheme: () =>
        set({ theme: effectiveTheme(get().theme) === "dark" ? "light" : "dark" }),
    }),
    { name: "settings" },
  ),
);

function subscribeToSystemScheme(onChange: () => void) {
  const mql = window.matchMedia("(prefers-color-scheme: dark)");
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

function getSystemScheme(): "light" | "dark" {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/**
 * The theme actually rendered right now: "light" | "dark". Backed by
 * useSyncExternalStore so the system-scheme subscription is hydration-safe
 * out of the box — the server snapshot (null) matches the client's first
 * render, then it resolves to the real value.
 */
export function useEffectiveTheme(): "light" | "dark" | null {
  const theme = useSettingsStore((s) => s.theme);
  const system = useSyncExternalStore(subscribeToSystemScheme, getSystemScheme, () => null);
  return theme ?? system;
}

/** Applies the current store state to <html> data-theme / data-accent. */
export function applySettingsToDocument(state: {
  theme: Theme;
  accent: Accent;
}) {
  const root = document.documentElement;
  if (state.theme) {
    root.setAttribute("data-theme", state.theme);
  } else {
    root.removeAttribute("data-theme");
  }
  root.setAttribute("data-accent", state.accent);
}

/**
 * Inline script text run in <head> before hydration so the persisted
 * theme/accent apply before first paint — no flash of the wrong theme.
 * Reads the same "settings" key zustand/middleware's persist writes.
 */
export const noFlashScript = `
(function () {
  try {
    var raw = localStorage.getItem("settings");
    if (!raw) return;
    var state = JSON.parse(raw).state;
    if (!state) return;
    var root = document.documentElement;
    if (state.theme) root.setAttribute("data-theme", state.theme);
    if (state.accent) root.setAttribute("data-accent", state.accent);
  } catch (e) {}
})();
`;
