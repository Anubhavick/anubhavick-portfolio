import { create } from "zustand";
import { persist } from "zustand/middleware";

export const GRID_SIZE = 96;

interface DesktopLayoutState {
  /** file id -> pixel position, snapped to GRID_SIZE. Only holds entries the
   * visitor has actually dragged; anything absent falls back to the
   * content-authored default grid cell. */
  positions: Record<string, { x: number; y: number }>;
  setPosition: (id: string, x: number, y: number) => void;
}

export function snapToGrid(value: number): number {
  return Math.round(value / GRID_SIZE) * GRID_SIZE;
}

export const useDesktopLayoutStore = create<DesktopLayoutState>()(
  persist(
    (set) => ({
      positions: {},
      setPosition: (id, x, y) =>
        set((state) => ({
          positions: {
            ...state.positions,
            [id]: { x: snapToGrid(x), y: snapToGrid(y) },
          },
        })),
    }),
    { name: "desktop-icon-positions" },
  ),
);
