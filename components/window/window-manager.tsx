"use client";

import { useCallback, useEffect, useState } from "react";
import { getWindowActions } from "@/lib/window-action-registry";
import type { Rect } from "@/lib/motion";
import { useSearchStore } from "@/lib/search/search-store";
import { useWindowStore } from "@/lib/window-store";
import { Window } from "./window";

function isMac() {
  if (typeof navigator === "undefined") return false;
  return /Mac|iPhone|iPad/.test(navigator.platform ?? navigator.userAgent);
}

export function WindowManager() {
  const windows = useWindowStore((s) => s.windows);
  const focusedId = useWindowStore((s) => s.focusedId);
  const clampAllToViewport = useWindowStore((s) => s.clampAllToViewport);
  const cycleWindows = useWindowStore((s) => s.cycleWindows);
  const [snapPreview, setSnapPreview] = useState<Rect | null>(null);

  useEffect(() => {
    function handleResize() {
      clampAllToViewport(window.innerWidth, window.innerHeight);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [clampAllToViewport]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const mod = isMac() ? e.metaKey : e.ctrlKey;

      if (mod && e.key.toLowerCase() === "w") {
        const currentFocusedId = useWindowStore.getState().focusedId;
        if (!currentFocusedId) return;
        e.preventDefault();
        getWindowActions(currentFocusedId)?.close();
        return;
      }

      if (mod && e.key === "`") {
        e.preventDefault();
        cycleWindows();
        return;
      }

      if (e.key === "Escape") {
        // The search overlay handles its own Escape (to close itself)
        // without touching windows underneath it.
        if (useSearchStore.getState().isOpen) return;
        const { windows } = useWindowStore.getState();
        const top = windows
          .filter((w) => !w.minimised)
          .reduce<(typeof windows)[number] | null>(
            (max, w) => (!max || w.zIndex > max.zIndex ? w : max),
            null,
          );
        if (top) {
          e.preventDefault();
          getWindowActions(top.id)?.close();
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cycleWindows]);

  const handleSnapPreviewChange = useCallback((rect: Rect | null) => {
    setSnapPreview(rect);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0">
      {windows.map((win) => (
        <div key={win.id} className="pointer-events-auto">
          <Window
            win={win}
            focused={win.id === focusedId}
            onSnapPreviewChange={handleSnapPreviewChange}
          />
        </div>
      ))}

      {snapPreview && (
        <div
          className="absolute rounded-window border-2 border-accent bg-accent/15 transition-none"
          style={{
            left: snapPreview.x,
            top: snapPreview.y,
            width: snapPreview.width,
            height: snapPreview.height,
            zIndex: 9999,
          }}
        />
      )}
    </div>
  );
}
