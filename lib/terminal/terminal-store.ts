import { create } from "zustand";
import { persist } from "zustand/middleware";
import { HOME } from "@/content/fs";
import type { ScrollbackEntry } from "./types";

export function entryId(): string {
  return `${Date.now().toString(36)}:${Math.random().toString(36).slice(2, 7)}`;
}

interface TerminalState {
  cwd: string;
  scrollback: ScrollbackEntry[];
  history: string[];
  /** -1 means "not currently navigating history" (editing a fresh line). */
  historyIndex: number;
  /** The in-progress line, saved when history navigation starts so ArrowDown
   * can return to it instead of an empty string. */
  draft: string;
  setCwd: (cwd: string) => void;
  pushEntries: (entries: ScrollbackEntry[]) => void;
  clearScrollback: () => void;
  pushHistory: (input: string) => void;
  setHistoryIndex: (index: number) => void;
  setDraft: (draft: string) => void;
  resetHistoryNav: () => void;
}

export const useTerminalStore = create<TerminalState>()(
  persist(
    (set) => ({
      cwd: HOME,
      scrollback: [],
      history: [],
      historyIndex: -1,
      draft: "",

      setCwd: (cwd) => set({ cwd }),

      pushEntries: (entries) =>
        set((state) => ({ scrollback: [...state.scrollback, ...entries] })),

      clearScrollback: () => set({ scrollback: [] }),

      pushHistory: (input) =>
        set((state) => ({
          history: input.trim() ? [...state.history, input] : state.history,
          historyIndex: -1,
          draft: "",
        })),

      setHistoryIndex: (historyIndex) => set({ historyIndex }),
      setDraft: (draft) => set({ draft }),
      resetHistoryNav: () => set({ historyIndex: -1, draft: "" }),
    }),
    {
      name: "terminal-history",
      partialize: (state) => ({ history: state.history }),
    },
  ),
);
