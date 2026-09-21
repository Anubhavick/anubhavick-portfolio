/**
 * The accent enum on its own, with no "use client" boundary — settings-store
 * (which owns theme/accent *state*) is client-only, but this pure constant
 * also needs to be importable from server-rendered code (the terminal
 * command definitions render into the static /terminal and /help routes).
 * settings-store re-exports both names, so existing client imports are
 * unaffected.
 */
export type Accent = "powder" | "system" | "ocean" | "midnight";

export const ACCENTS: Accent[] = ["powder", "system", "ocean", "midnight"];
