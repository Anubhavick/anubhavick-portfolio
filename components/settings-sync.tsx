"use client";

import { useEffect } from "react";
import { applySettingsToDocument, useSettingsStore } from "@/lib/settings-store";

/** Keeps <html data-theme>/<data-accent> in sync with the settings store
 * after the first paint (the inline no-flash script only handles that). */
export function SettingsSync() {
  const theme = useSettingsStore((s) => s.theme);
  const accent = useSettingsStore((s) => s.accent);

  useEffect(() => {
    applySettingsToDocument({ theme, accent });
  }, [theme, accent]);

  return null;
}
