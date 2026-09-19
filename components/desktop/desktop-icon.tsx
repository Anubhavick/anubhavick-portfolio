"use client";

import { useRef } from "react";
import type { DesktopFile } from "@/content/schema";
import { GRID_SIZE, snapToGrid } from "@/lib/desktop-layout-store";
import { IconTile } from "@/components/icon-tile";

const DRAG_THRESHOLD = 4;

interface DesktopIconProps {
  file: DesktopFile;
  x: number;
  y: number;
  selected: boolean;
  tabIndex: number;
  onSelect: (id: string) => void;
  onOpen: (file: DesktopFile, el: HTMLElement) => void;
  onDragEnd: (id: string, x: number, y: number) => void;
  onArrowKey: (id: string, direction: "up" | "down" | "left" | "right") => void;
}

interface DragState {
  pointerId: number;
  startClientX: number;
  startClientY: number;
  startLeft: number;
  startTop: number;
  moved: boolean;
  currentLeft: number;
  currentTop: number;
}

export function DesktopIcon({
  file,
  x,
  y,
  selected,
  tabIndex,
  onSelect,
  onOpen,
  onDragEnd,
  onArrowKey,
}: DesktopIconProps) {
  const elRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (e.button !== 0) return;
    onSelect(file.id);
    dragRef.current = {
      pointerId: e.pointerId,
      startClientX: e.clientX,
      startClientY: e.clientY,
      startLeft: x,
      startTop: y,
      moved: false,
      currentLeft: x,
      currentTop: y,
    };
    elRef.current?.setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    const dx = e.clientX - drag.startClientX;
    const dy = e.clientY - drag.startClientY;
    if (!drag.moved && Math.abs(dx) + Math.abs(dy) < DRAG_THRESHOLD) return;
    drag.moved = true;
    drag.currentLeft = drag.startLeft + dx;
    drag.currentTop = drag.startTop + dy;
    if (elRef.current) {
      elRef.current.style.left = `${drag.currentLeft}px`;
      elRef.current.style.top = `${drag.currentTop}px`;
      elRef.current.style.zIndex = "10";
    }
  }

  function handlePointerUp(e: React.PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    elRef.current?.releasePointerCapture(e.pointerId);
    dragRef.current = null;
    if (elRef.current) elRef.current.style.zIndex = "";

    if (!drag.moved) return;

    const maxX = window.innerWidth - GRID_SIZE;
    const maxY = window.innerHeight - GRID_SIZE;
    const snappedX = Math.min(Math.max(snapToGrid(drag.currentLeft), 0), Math.max(maxX, 0));
    const snappedY = Math.min(Math.max(snapToGrid(drag.currentTop), 0), Math.max(maxY, 0));
    onDragEnd(file.id, snappedX, snappedY);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    switch (e.key) {
      case "Enter":
        e.preventDefault();
        if (elRef.current) onOpen(file, elRef.current);
        break;
      case "ArrowUp":
        e.preventDefault();
        onArrowKey(file.id, "up");
        break;
      case "ArrowDown":
        e.preventDefault();
        onArrowKey(file.id, "down");
        break;
      case "ArrowLeft":
        e.preventDefault();
        onArrowKey(file.id, "left");
        break;
      case "ArrowRight":
        e.preventDefault();
        onArrowKey(file.id, "right");
        break;
    }
  }

  return (
    <div
      ref={elRef}
      role="option"
      aria-selected={selected}
      tabIndex={tabIndex}
      style={{ position: "absolute", left: x, top: y, width: GRID_SIZE }}
      className="cursor-default touch-none select-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onFocus={() => onSelect(file.id)}
      onDoubleClick={() => elRef.current && onOpen(file, elRef.current)}
      onKeyDown={handleKeyDown}
    >
      <IconTile icon={file.icon} label={file.name} selected={selected} />
    </div>
  );
}
