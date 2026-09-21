import { create } from "zustand";

/**
 * Whether the search overlay is open — its own tiny store (not React state
 * owned by the overlay component) so other global keydown handlers, notably
 * WindowManager's Escape handling, can check it without prop drilling.
 */
interface SearchState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export const useSearchStore = create<SearchState>()((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));
