"use client";

import { ACCENTS, useSettingsStore, type Accent } from "@/lib/settings-store";

const ACCENT_LABEL: Record<Accent, string> = {
  powder: "Powder",
  system: "System",
  ocean: "Ocean",
  midnight: "Midnight",
};

export function AccentPicker() {
  const accent = useSettingsStore((s) => s.accent);
  const setAccent = useSettingsStore((s) => s.setAccent);

  return (
    <div role="radiogroup" aria-label="Accent color" className="flex items-center gap-1.5">
      {ACCENTS.map((a) => (
        <button
          key={a}
          type="button"
          role="radio"
          aria-checked={accent === a}
          aria-label={ACCENT_LABEL[a]}
          data-accent={a}
          onClick={() => setAccent(a)}
          className={`size-3 rounded-full bg-accent outline-none transition-transform focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 ${
            accent === a ? "scale-125 ring-1 ring-ink/30" : "opacity-70 hover:opacity-100"
          }`}
        />
      ))}
    </div>
  );
}
