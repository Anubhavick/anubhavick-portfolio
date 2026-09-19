"use client";

import { useEffect, useRef } from "react";
import { X, Minus, Square } from "lucide-react";
import { renderIcon } from "@/lib/icons";
import { getLaunchIconRect } from "@/lib/dock-icon-registry";
import { registerWindowActions, unregisterWindowActions } from "@/lib/window-action-registry";
import {
  createWindowCloseTimeline,
  createWindowMinimizeTimeline,
  createWindowOpenTimeline,
  type Rect,
} from "@/lib/motion";
import {
  MENU_BAR_HEIGHT,
  MIN_WINDOW_SIZE,
  launchKey,
  useWindowStore,
  type WindowState,
} from "@/lib/window-store";
import { PlaceholderBody } from "./placeholder-body";

const EDGE_SNAP_THRESHOLD = 20;

type ResizeDir = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

const RESIZE_HANDLES: { dir: ResizeDir; className: string }[] = [
  { dir: "n", className: "-top-1 left-2 right-2 h-2 cursor-ns-resize" },
  { dir: "s", className: "-bottom-1 left-2 right-2 h-2 cursor-ns-resize" },
  { dir: "e", className: "-right-1 top-2 bottom-2 w-2 cursor-ew-resize" },
  { dir: "w", className: "-left-1 top-2 bottom-2 w-2 cursor-ew-resize" },
  { dir: "ne", className: "-top-1 -right-1 size-3 cursor-nesw-resize" },
  { dir: "sw", className: "-bottom-1 -left-1 size-3 cursor-nesw-resize" },
  { dir: "nw", className: "-top-1 -left-1 size-3 cursor-nwse-resize" },
  { dir: "se", className: "-bottom-1 -right-1 size-3 cursor-nwse-resize" },
];

interface WindowProps {
  win: WindowState;
  focused: boolean;
  onSnapPreviewChange: (rect: Rect | null) => void;
}

export function Window({ win, focused, onSnapPreviewChange }: WindowProps) {
  const elRef = useRef<HTMLDivElement>(null);
  const closeWindow = useWindowStore((s) => s.closeWindow);
  const minimizeWindow = useWindowStore((s) => s.minimizeWindow);
  const focusWindow = useWindowStore((s) => s.focusWindow);
  const moveWindow = useWindowStore((s) => s.moveWindow);
  const setRect = useWindowStore((s) => s.setRect);
  const toggleMaximize = useWindowStore((s) => s.toggleMaximize);

  const morphFromRect = useRef<Rect | null>(null);
  const isFirstMaximiseRender = useRef(true);

  // Grow out of the launching icon on mount, once.
  useEffect(() => {
    if (!elRef.current) return;
    const tl = createWindowOpenTimeline({ windowEl: elRef.current, origin: win.origin });
    tl.play();
    return () => {
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Morph between maximised <-> restored rects.
  useEffect(() => {
    if (isFirstMaximiseRender.current) {
      isFirstMaximiseRender.current = false;
      return;
    }
    if (!elRef.current || !morphFromRect.current) return;
    const tl = createWindowOpenTimeline({
      windowEl: elRef.current,
      origin: morphFromRect.current,
    });
    tl.play();
    morphFromRect.current = null;
  }, [win.maximised, win.width, win.height]);

  // Focus moves into the window on mount.
  useEffect(() => {
    elRef.current?.focus();
  }, []);

  // Let global shortcuts (Cmd/Ctrl+W, Escape) trigger the same animated
  // close/minimize the traffic lights use.
  useEffect(() => {
    registerWindowActions(win.id, { close: animatedClose, minimize: animatedMinimize });
    return () => unregisterWindowActions(win.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [win.id]);

  function animatedClose() {
    if (!elRef.current) {
      closeWindow(win.id);
      return;
    }
    const tl = createWindowCloseTimeline({ windowEl: elRef.current, origin: win.origin });
    tl.eventCallback("onComplete", () => closeWindow(win.id));
    tl.play();
  }

  function animatedMinimize() {
    if (!elRef.current) {
      minimizeWindow(win.id);
      return;
    }
    const dockRect = getLaunchIconRect(launchKey(win.target)) ?? win.origin;
    const tl = createWindowMinimizeTimeline({ windowEl: elRef.current, origin: dockRect });
    tl.eventCallback("onComplete", () => minimizeWindow(win.id));
    tl.play();
  }

  function doMaximizeToggle() {
    if (!elRef.current) return;
    morphFromRect.current = elRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    toggleMaximize(win.id, { x: 0, y: MENU_BAR_HEIGHT, width: vw, height: vh - MENU_BAR_HEIGHT });
  }

  function handleTitleBarPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (e.button !== 0) return;
    focusWindow(win.id);
    const el = elRef.current;
    if (!el) return;
    el.setPointerCapture(e.pointerId);

    const startClientX = e.clientX;
    const startClientY = e.clientY;
    const startLeft = win.x;
    const startTop = win.y;
    let currentX = startLeft;
    let currentY = startTop;
    let activeSnap: "left" | "right" | "top" | null = null;

    function handleMove(ev: PointerEvent) {
      const dx = ev.clientX - startClientX;
      const dy = ev.clientY - startClientY;
      currentX = startLeft + dx;
      currentY = Math.max(startTop + dy, MENU_BAR_HEIGHT);
      if (el) {
        el.style.left = `${currentX}px`;
        el.style.top = `${currentY}px`;
      }

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      if (ev.clientX <= EDGE_SNAP_THRESHOLD) {
        activeSnap = "left";
        onSnapPreviewChange({ x: 0, y: MENU_BAR_HEIGHT, width: vw / 2, height: vh - MENU_BAR_HEIGHT });
      } else if (ev.clientX >= vw - EDGE_SNAP_THRESHOLD) {
        activeSnap = "right";
        onSnapPreviewChange({ x: vw / 2, y: MENU_BAR_HEIGHT, width: vw / 2, height: vh - MENU_BAR_HEIGHT });
      } else if (ev.clientY <= MENU_BAR_HEIGHT + EDGE_SNAP_THRESHOLD) {
        activeSnap = "top";
        onSnapPreviewChange({ x: 0, y: MENU_BAR_HEIGHT, width: vw, height: vh - MENU_BAR_HEIGHT });
      } else {
        activeSnap = null;
        onSnapPreviewChange(null);
      }
    }

    function handleUp(ev: PointerEvent) {
      el?.releasePointerCapture(ev.pointerId);
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      onSnapPreviewChange(null);

      if (activeSnap === "top") {
        morphFromRect.current = { x: currentX, y: currentY, width: win.width, height: win.height };
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        toggleMaximize(win.id, { x: 0, y: MENU_BAR_HEIGHT, width: vw, height: vh - MENU_BAR_HEIGHT });
      } else if (activeSnap === "left" || activeSnap === "right") {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        setRect(win.id, {
          x: activeSnap === "left" ? 0 : vw / 2,
          y: MENU_BAR_HEIGHT,
          width: vw / 2,
          height: vh - MENU_BAR_HEIGHT,
        });
      } else {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const clampedX = Math.min(Math.max(currentX, 0), Math.max(vw - win.width, 0));
        const clampedY = Math.min(Math.max(currentY, MENU_BAR_HEIGHT), Math.max(vh - win.height, MENU_BAR_HEIGHT));
        moveWindow(win.id, clampedX, clampedY);
      }
    }

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
  }

  function handleResizePointerDown(dir: ResizeDir, e: React.PointerEvent<HTMLDivElement>) {
    e.stopPropagation();
    if (e.button !== 0) return;
    focusWindow(win.id);
    const el = elRef.current;
    if (!el) return;

    const startClientX = e.clientX;
    const startClientY = e.clientY;
    const start = { x: win.x, y: win.y, width: win.width, height: win.height };
    let final = { ...start };

    function handleMove(ev: PointerEvent) {
      const dx = ev.clientX - startClientX;
      const dy = ev.clientY - startClientY;
      let { x, y, width, height } = start;

      if (dir.includes("e")) width = Math.max(start.width + dx, MIN_WINDOW_SIZE.width);
      if (dir.includes("s")) height = Math.max(start.height + dy, MIN_WINDOW_SIZE.height);
      if (dir.includes("w")) {
        width = Math.max(start.width - dx, MIN_WINDOW_SIZE.width);
        x = start.x + (start.width - width);
      }
      if (dir.includes("n")) {
        height = Math.max(start.height - dy, MIN_WINDOW_SIZE.height);
        y = start.y + (start.height - height);
      }

      final = { x, y, width, height };
      if (el) {
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        el.style.width = `${width}px`;
        el.style.height = `${height}px`;
      }
    }

    function handleUp() {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      setRect(win.id, final);
    }

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
  }

  if (win.minimised) return null;

  return (
    <div
      ref={elRef}
      role="dialog"
      aria-label={win.title}
      tabIndex={-1}
      style={{
        position: "absolute",
        left: win.x,
        top: win.y,
        width: win.width,
        height: win.height,
        zIndex: win.zIndex,
      }}
      className={`flex flex-col overflow-hidden rounded-window border shadow-window outline-none ${
        focused ? "border-accent" : "border-hairline saturate-50"
      }`}
      onPointerDown={() => focusWindow(win.id)}
    >
      <div
        className={`flex h-9 shrink-0 items-center justify-between gap-2 border-b px-3 ${
          focused ? "border-accent/40 bg-accent-soft/15" : "border-hairline bg-surface-1"
        }`}
        onPointerDown={handleTitleBarPointerDown}
        onDoubleClick={doMaximizeToggle}
      >
        <span
          className={`flex min-w-0 items-center gap-1.5 truncate font-mono text-xs ${
            focused ? "text-ink" : "text-ink-muted"
          }`}
        >
          {renderIcon(win.icon, { size: 14, strokeWidth: 1.6, className: "shrink-0" })}
          <span className="truncate">{win.title}</span>
        </span>

        <div className="flex shrink-0 items-center gap-1.5" onPointerDown={(e) => e.stopPropagation()}>
          <button
            type="button"
            aria-label="Minimise"
            onClick={animatedMinimize}
            className="flex size-4 items-center justify-center rounded-full border border-hairline bg-surface-2/60 text-ink-muted outline-none hover:border-accent hover:text-accent focus-visible:ring-2 focus-visible:ring-accent"
          >
            <Minus size={9} strokeWidth={2.5} />
          </button>
          <button
            type="button"
            aria-label={win.maximised ? "Restore" : "Maximise"}
            onClick={doMaximizeToggle}
            className="flex size-4 items-center justify-center rounded-full border border-hairline bg-surface-2/60 text-ink-muted outline-none hover:border-accent hover:text-accent focus-visible:ring-2 focus-visible:ring-accent"
          >
            <Square size={8} strokeWidth={2.5} />
          </button>
          <button
            type="button"
            aria-label="Close"
            onClick={animatedClose}
            className="flex size-4 items-center justify-center rounded-full border border-hairline bg-surface-2/60 text-ink-muted outline-none hover:border-accent hover:text-accent focus-visible:ring-2 focus-visible:ring-accent"
          >
            <X size={9} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto bg-surface-0">
        <PlaceholderBody target={win.target} />
      </div>

      {RESIZE_HANDLES.map(({ dir, className }) => (
        <div
          key={dir}
          className={`absolute ${className}`}
          onPointerDown={(e) => handleResizePointerDown(dir, e)}
        />
      ))}
    </div>
  );
}
