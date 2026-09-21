"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { useDesktopLayoutStore } from "@/lib/desktop-layout-store";
import {
  ACCENTS,
  useSettingsStore,
  type Accent,
  type ReducedMotion,
  type Theme,
} from "@/lib/settings-store";

const ACCENT_LABEL: Record<Accent, string> = {
  powder: "Powder",
  system: "System",
  ocean: "Ocean",
  midnight: "Midnight",
};

const THEME_OPTIONS: { value: Theme; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: null, label: "System" },
];

const MOTION_OPTIONS: { value: ReducedMotion; label: string }[] = [
  { value: "system", label: "System" },
  { value: "on", label: "Always" },
  { value: "off", label: "Never" },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-2.5 border-b border-hairline px-5 py-4 last:border-b-0">
      <h2 className="font-mono text-xs uppercase tracking-wide text-ink-muted">{title}</h2>
      {children}
    </section>
  );
}

function Segmented<T extends string | null>({
  options,
  value,
  onChange,
  "aria-label": ariaLabel,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  "aria-label": string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="inline-flex w-fit rounded-control border border-hairline bg-surface-2/60 p-0.5"
    >
      {options.map((opt) => (
        <button
          key={String(opt.value)}
          type="button"
          role="radio"
          aria-checked={value === opt.value}
          onClick={() => onChange(opt.value)}
          className={`rounded-control px-3 py-1 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent ${
            value === opt.value ? "bg-surface-0 text-ink shadow-window" : "text-ink-muted hover:text-ink"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export function SettingsApp() {
  const accent = useSettingsStore((s) => s.accent);
  const setAccent = useSettingsStore((s) => s.setAccent);
  const theme = useSettingsStore((s) => s.theme);
  const setTheme = useSettingsStore((s) => s.setTheme);
  const reducedMotion = useSettingsStore((s) => s.reducedMotion);
  const setReducedMotion = useSettingsStore((s) => s.setReducedMotion);
  const wallpaperGrain = useSettingsStore((s) => s.wallpaperGrain);
  const setWallpaperGrain = useSettingsStore((s) => s.setWallpaperGrain);
  const resetPositions = useDesktopLayoutStore((s) => s.resetPositions);

  const [confirmingReset, setConfirmingReset] = useState(false);
  const [justReset, setJustReset] = useState(false);

  function handleResetClick() {
    if (!confirmingReset) {
      setConfirmingReset(true);
      window.setTimeout(() => setConfirmingReset(false), 3000);
      return;
    }
    resetPositions();
    setConfirmingReset(false);
    setJustReset(true);
    window.setTimeout(() => setJustReset(false), 2000);
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-surface-0">
      <Section title="Accent">
        <div role="radiogroup" aria-label="Accent color" className="flex flex-wrap gap-3">
          {ACCENTS.map((a) => (
            <button
              key={a}
              type="button"
              role="radio"
              aria-checked={accent === a}
              data-accent={a}
              onClick={() => setAccent(a)}
              className="flex flex-col items-center gap-1.5 rounded-control p-1.5 outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <span className="flex size-9 items-center justify-center rounded-full bg-accent">
                {accent === a && <Check size={16} strokeWidth={2.5} className="text-surface-0" />}
              </span>
              <span className={`text-xs ${accent === a ? "text-ink" : "text-ink-muted"}`}>
                {ACCENT_LABEL[a]}
              </span>
            </button>
          ))}
        </div>
      </Section>

      <Section title="Appearance">
        <Segmented aria-label="Theme" options={THEME_OPTIONS} value={theme} onChange={setTheme} />
      </Section>

      <Section title="Motion">
        <Segmented
          aria-label="Reduced motion"
          options={MOTION_OPTIONS}
          value={reducedMotion}
          onChange={setReducedMotion}
        />
        <p className="max-w-[42ch] text-xs text-ink-muted">
          &quot;System&quot; follows your OS setting. &quot;Always&quot; skips every window/dock
          animation in favour of instant state changes.
        </p>
      </Section>

      <Section title="Wallpaper">
        <label className="flex w-fit items-center gap-2.5 text-sm text-ink">
          <button
            type="button"
            role="switch"
            aria-checked={wallpaperGrain}
            onClick={() => setWallpaperGrain(!wallpaperGrain)}
            className={`relative h-5 w-9 shrink-0 rounded-full border border-hairline transition-colors focus-visible:ring-2 focus-visible:ring-accent ${
              wallpaperGrain ? "bg-accent" : "bg-surface-2"
            }`}
          >
            <span
              className={`absolute top-0.5 size-3.5 rounded-full bg-surface-0 transition-transform ${
                wallpaperGrain ? "translate-x-4.5" : "translate-x-0.5"
              }`}
            />
          </button>
          Grain texture
        </label>
      </Section>

      <Section title="Desktop">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleResetClick}
            className={`w-fit rounded-control border px-3 py-1.5 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent ${
              confirmingReset
                ? "border-danger bg-danger/10 text-danger"
                : "border-hairline text-ink hover:bg-surface-2/60"
            }`}
          >
            {confirmingReset ? "Click again to confirm" : "Reset desktop"}
          </button>
          {justReset && <span className="text-xs text-ink-muted">Desktop icons reset.</span>}
        </div>
        <p className="max-w-[42ch] text-xs text-ink-muted">
          Clears any icons you&apos;ve dragged around, back to their default grid positions.
        </p>
      </Section>
    </div>
  );
}
