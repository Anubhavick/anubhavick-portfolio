"use client";

import { useCallback, useState } from "react";
import { desktopFiles } from "@/content";
import type { DesktopFile } from "@/content/schema";
import {
  GRID_SIZE,
  useDesktopLayoutStore,
} from "@/lib/desktop-layout-store";
import { useOpenWindow } from "@/lib/use-open-window";
import { MENU_BAR_HEIGHT } from "@/lib/window-store";
import { DesktopIcon } from "./desktop-icon";

const PADDING = { x: 24, y: MENU_BAR_HEIGHT + 24 };

function defaultPosition(file: DesktopFile) {
  const cell = file.position ?? { x: 0, y: 0 };
  return { x: PADDING.x + cell.x * GRID_SIZE, y: PADDING.y + cell.y * GRID_SIZE };
}

export function Desktop() {
  const positions = useDesktopLayoutStore((s) => s.positions);
  const setPosition = useDesktopLayoutStore((s) => s.setPosition);
  const openWindow = useOpenWindow();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const resolvePosition = useCallback(
    (file: DesktopFile) => positions[file.id] ?? defaultPosition(file),
    [positions],
  );

  function handleOpen(file: DesktopFile, el: HTMLElement) {
    if (file.kind === "link" && file.href) {
      window.open(file.href, "_blank", "noopener,noreferrer");
      return;
    }
    if (file.kind === "folder") {
      openWindow({ kind: "folder", fileId: file.id }, el);
      return;
    }
    if (file.kind === "app" && file.appId) {
      openWindow({ kind: "app", appId: file.appId }, el);
    }
  }

  function handleArrowKey(
    id: string,
    direction: "up" | "down" | "left" | "right",
  ) {
    const current = desktopFiles.find((f) => f.id === id);
    if (!current) return;
    const currentPos = resolvePosition(current);

    let best: DesktopFile | null = null;
    let bestScore = Infinity;

    for (const file of desktopFiles) {
      if (file.id === id) continue;
      const pos = resolvePosition(file);
      const dx = pos.x - currentPos.x;
      const dy = pos.y - currentPos.y;

      const aligned =
        direction === "up" || direction === "down"
          ? dy !== 0 && (direction === "down" ? dy > 0 : dy < 0)
          : dx !== 0 && (direction === "right" ? dx > 0 : dx < 0);
      if (!aligned) continue;

      const primary = direction === "up" || direction === "down" ? Math.abs(dy) : Math.abs(dx);
      const secondary = direction === "up" || direction === "down" ? Math.abs(dx) : Math.abs(dy);
      const score = primary * 10 + secondary;
      if (score < bestScore) {
        bestScore = score;
        best = file;
      }
    }

    if (best) setSelectedId(best.id);
  }

  return (
    <div
      role="listbox"
      aria-label="Desktop"
      className="absolute inset-0"
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) setSelectedId(null);
      }}
    >
      {desktopFiles.map((file, i) => {
        const pos = resolvePosition(file);
        const selected = selectedId === file.id;
        const tabIndex =
          selectedId === null ? (i === 0 ? 0 : -1) : selected ? 0 : -1;
        return (
          <DesktopIcon
            key={file.id}
            file={file}
            x={pos.x}
            y={pos.y}
            selected={selected}
            tabIndex={tabIndex}
            onSelect={setSelectedId}
            onOpen={handleOpen}
            onDragEnd={setPosition}
            onArrowKey={handleArrowKey}
          />
        );
      })}
    </div>
  );
}
