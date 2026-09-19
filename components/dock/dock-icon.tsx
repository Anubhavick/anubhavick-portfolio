"use client";

import { renderIcon } from "@/lib/icons";
import type { AppDefinition } from "@/content/schema";

interface DockIconProps {
  app: AppDefinition;
  running: boolean;
  focused: boolean;
  tabIndex: number;
  registerRef: (el: HTMLButtonElement | null) => void;
  onActivate: (el: HTMLButtonElement) => void;
  onArrow: (direction: "left" | "right") => void;
  onFocus: () => void;
}

export function DockIcon({
  app,
  running,
  focused,
  tabIndex,
  registerRef,
  onActivate,
  onArrow,
  onFocus,
}: DockIconProps) {
  return (
    <button
      ref={registerRef}
      type="button"
      role="button"
      aria-label={app.name}
      aria-pressed={running}
      tabIndex={tabIndex}
      onFocus={onFocus}
      onClick={(e) => onActivate(e.currentTarget)}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          onArrow("left");
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          onArrow("right");
        }
      }}
      className="group relative flex origin-bottom flex-col items-center outline-none"
      style={{ willChange: "transform" }}
    >
      <div
        className={`flex size-11 items-center justify-center rounded-window border transition-colors group-focus-visible:ring-2 group-focus-visible:ring-accent ${
          focused ? "border-accent bg-accent-soft/25" : "border-hairline bg-surface-2/70"
        }`}
      >
        {renderIcon(app.icon, { size: 22, className: "text-ink", strokeWidth: 1.6 })}
      </div>
      <span
        className={`mt-1 size-1 rounded-full transition-opacity ${
          running ? "bg-accent opacity-100" : "opacity-0"
        }`}
      />
    </button>
  );
}
