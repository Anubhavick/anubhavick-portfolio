"use client";

import { useSettingsStore } from "@/lib/settings-store";

/**
 * Desktop wallpaper: a soft vertical gradient from accent-soft into
 * surface-1, plus a faint grain overlay (toggleable in Settings).
 * Composed entirely from existing design tokens — no image, no new
 * hardcoded color.
 */
export function Wallpaper() {
  const grain = useSettingsStore((s) => s.wallpaperGrain);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 bg-surface-1">
      <div className="absolute inset-0 bg-gradient-to-b from-accent-soft/35 via-surface-1 to-surface-1" />
      {grain && (
        <div
          className="absolute inset-0 text-ink opacity-[0.035] mix-blend-overlay"
          style={{
            backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
            backgroundSize: "3px 3px",
          }}
        />
      )}
    </div>
  );
}
