"use client";

import { Moon, Sun } from "lucide-react";
import { useEffectiveTheme, useSettingsStore } from "@/lib/settings-store";

export function ThemeToggle() {
  const effective = useEffectiveTheme();
  const toggleTheme = useSettingsStore((s) => s.toggleTheme);

  return (
    <button
      type="button"
      aria-label={effective === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      onClick={toggleTheme}
      className="flex size-6 items-center justify-center rounded-control text-ink-muted outline-none transition-colors hover:text-ink focus-visible:ring-2 focus-visible:ring-accent"
    >
      {effective === "dark" ? (
        <Moon size={14} strokeWidth={1.8} />
      ) : (
        <Sun size={14} strokeWidth={1.8} />
      )}
    </button>
  );
}
