"use client";

import { forwardRef } from "react";
import { renderIcon } from "@/lib/icons";

interface IconTileProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: string;
  label: string;
  selected?: boolean;
  size?: "sm" | "md" | "lg";
  labelClassName?: string;
}

const SIZE_MAP = {
  sm: { box: "size-9", icon: 18, text: "text-xs" },
  md: { box: "size-11", icon: 22, text: "text-xs" },
  lg: { box: "size-16", icon: 30, text: "text-sm" },
} as const;

/**
 * Shared visual for a single launchable thing — desktop icon, folder
 * child, mobile app-grid tile. Dock icons render their own markup (they
 * need continuous magnification + a running-app dot).
 */
export const IconTile = forwardRef<HTMLDivElement, IconTileProps>(
  function IconTile(
    { icon, label, selected, size = "md", className = "", labelClassName = "", ...rest },
    ref,
  ) {
    const dims = SIZE_MAP[size];

    return (
      <div
        ref={ref}
        className={`flex flex-col items-center gap-1.5 rounded-control p-2 outline-none focus-visible:ring-2 focus-visible:ring-accent ${className}`}
        {...rest}
      >
        <div
          className={`flex ${dims.box} items-center justify-center rounded-window border transition-colors ${
            selected
              ? "border-accent bg-accent-soft/25"
              : "border-transparent bg-surface-2/60"
          }`}
        >
          {renderIcon(icon, { size: dims.icon, className: "text-ink", strokeWidth: 1.6 })}
        </div>
        <span
          className={`max-w-20 truncate text-center font-mono ${dims.text} ${
            selected ? "text-ink" : "text-ink-muted"
          } ${labelClassName}`}
        >
          {label}
        </span>
      </div>
    );
  },
);
