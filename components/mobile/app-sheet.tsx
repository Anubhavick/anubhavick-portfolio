"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { renderIcon } from "@/lib/icons";
import { createWindowCloseTimeline, createWindowOpenTimeline, DURATION, type Rect } from "@/lib/motion";
import { resolveWindowMeta } from "@/lib/window-content";
import type { WindowTarget } from "@/lib/window-store";
import { WindowBody } from "@/components/window/window-body";

const DISMISS_THRESHOLD = 120;

interface AppSheetProps {
  target: WindowTarget;
  originRect: Rect;
  onRequestClose: () => void;
}

export function AppSheet({ target, originRect, onRequestClose }: AppSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [dragY, setDragY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const meta = resolveWindowMeta(target);

  useEffect(() => {
    if (!sheetRef.current) return;
    const tl = createWindowOpenTimeline({ windowEl: sheetRef.current, origin: originRect });
    tl.play();
    return () => {
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function closeWithShrink() {
    if (!sheetRef.current) {
      onRequestClose();
      return;
    }
    const tl = createWindowCloseTimeline({ windowEl: sheetRef.current, origin: originRect });
    tl.eventCallback("onComplete", onRequestClose);
    tl.play();
  }

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    // Don't capture the pointer immediately — that retargets the click
    // event to this handle, so a plain tap on the Back button inside it
    // would never fire. Only start capturing once an actual drag begins.
    if ((e.target as HTMLElement).closest("button")) return;

    const header = e.currentTarget;
    const pointerId = e.pointerId;
    const startY = e.clientY;
    let capturing = false;
    let lastDy = 0;

    function handleMove(ev: PointerEvent) {
      lastDy = Math.max(0, ev.clientY - startY);
      if (!capturing && lastDy > 4) {
        capturing = true;
        header.setPointerCapture(pointerId);
        setDragging(true);
      }
      if (capturing) setDragY(lastDy);
    }

    function handleUp() {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      if (!capturing) return;
      setDragging(false);
      if (lastDy > DISMISS_THRESHOLD) {
        onRequestClose();
      } else {
        setDragY(0);
      }
    }

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
  }

  if (!meta) return null;

  return (
    <div
      ref={sheetRef}
      role="dialog"
      aria-label={meta.title}
      className="fixed inset-0 z-50 flex flex-col bg-surface-0"
      style={{
        transform: `translateY(${dragY}px)`,
        transition: dragging ? "none" : `transform ${DURATION.fast}s ease-out`,
      }}
    >
      <div
        className="flex h-11 shrink-0 touch-none items-center gap-2 border-b border-hairline bg-surface-1 px-2 pt-[env(safe-area-inset-top)]"
        onPointerDown={handlePointerDown}
      >
        <button
          type="button"
          aria-label="Back"
          onClick={closeWithShrink}
          className="flex items-center gap-1 rounded-control px-2 py-1 text-ink outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <ChevronLeft size={18} strokeWidth={1.8} />
          <span className="text-sm">Back</span>
        </button>
        <span className="mx-auto flex items-center gap-1.5 pr-14 font-mono text-xs text-ink-muted">
          {renderIcon(meta.icon, { size: 13, strokeWidth: 1.6 })}
          {meta.title}
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-auto">
        <WindowBody target={target} />
      </div>
    </div>
  );
}
