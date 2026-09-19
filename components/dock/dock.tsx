"use client";

import { useRef, useState } from "react";
import { appDefinitions } from "@/content";
import type { AppDefinition, AppId } from "@/content/schema";
import { registerLaunchIcon } from "@/lib/dock-icon-registry";
import { createDockMagnifyTimeline } from "@/lib/motion";
import { useOpenWindow } from "@/lib/use-open-window";
import { useWindowStore } from "@/lib/window-store";
import { DockIcon } from "./dock-icon";

const MAGNIFY_RADIUS = 110;
const MAGNIFY_PEAK = 0.55;

export function Dock() {
  const windows = useWindowStore((s) => s.windows);
  const focusedId = useWindowStore((s) => s.focusedId);
  const focusWindow = useWindowStore((s) => s.focusWindow);
  const toggleMinimize = useWindowStore((s) => s.toggleMinimize);
  const openWindow = useOpenWindow();

  const iconRefs = useRef<Map<AppId, HTMLButtonElement>>(new Map());
  const tweenRefs = useRef<Map<AppId, gsap.core.Timeline>>(new Map());
  const rafRef = useRef<number | null>(null);
  const [focusIndex, setFocusIndex] = useState(0);

  function moveFocus(direction: "left" | "right") {
    const next = Math.min(
      Math.max(focusIndex + (direction === "right" ? 1 : -1), 0),
      appDefinitions.length - 1,
    );
    setFocusIndex(next);
    iconRefs.current.get(appDefinitions[next].id)?.focus();
  }

  function windowFor(appId: AppId) {
    return windows.find((w) => w.target.kind === "app" && w.target.appId === appId);
  }

  function playMagnify(appId: AppId, el: HTMLElement, scale: number) {
    tweenRefs.current.get(appId)?.kill();
    const tl = createDockMagnifyTimeline({ iconEl: el, scale });
    tweenRefs.current.set(appId, tl);
    tl.play();
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (rafRef.current !== null) return;
    const clientX = e.clientX;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      for (const [appId, el] of iconRefs.current) {
        const rect = el.getBoundingClientRect();
        const center = rect.left + rect.width / 2;
        const distance = Math.abs(clientX - center);
        const falloff = Math.max(0, 1 - distance / MAGNIFY_RADIUS);
        playMagnify(appId, el, 1 + falloff * MAGNIFY_PEAK);
      }
    });
  }

  function handlePointerLeave() {
    for (const [appId, el] of iconRefs.current) playMagnify(appId, el, 1);
  }

  function handleActivate(app: AppDefinition, el: HTMLButtonElement) {
    const win = windowFor(app.id);
    if (!win) {
      openWindow({ kind: "app", appId: app.id }, el);
      return;
    }
    if (win.id === focusedId && !win.minimised) {
      toggleMinimize(win.id);
    } else {
      focusWindow(win.id);
    }
  }

  return (
    <div
      role="toolbar"
      aria-label="Dock"
      className="fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 items-end gap-2 rounded-dock border border-hairline bg-surface-1/85 px-3 py-2.5 shadow-window backdrop-blur"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {appDefinitions.map((app, i) => {
        const win = windowFor(app.id);
        return (
          <DockIcon
            key={app.id}
            app={app}
            running={!!win}
            focused={!!win && win.id === focusedId && !win.minimised}
            tabIndex={i === focusIndex ? 0 : -1}
            onFocus={() => setFocusIndex(i)}
            registerRef={(el) => {
              if (el) {
                iconRefs.current.set(app.id, el);
                registerLaunchIcon(`app:${app.id}`, el);
              } else {
                iconRefs.current.delete(app.id);
                registerLaunchIcon(`app:${app.id}`, null);
              }
            }}
            onActivate={(el) => handleActivate(app, el)}
            onArrow={moveFocus}
          />
        );
      })}
    </div>
  );
}
