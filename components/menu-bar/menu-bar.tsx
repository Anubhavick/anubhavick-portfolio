"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { appDefinitions, socialLinks } from "@/content";
import { useSearchStore } from "@/lib/search/search-store";
import { useOpenWindow } from "@/lib/use-open-window";
import { useSettingsStore } from "@/lib/settings-store";
import { useWindowStore } from "@/lib/window-store";
import { AccentPicker } from "./accent-picker";
import { Clock } from "./clock";
import { Menu, type MenuItemDef } from "./menu";
import { ThemeToggle } from "./theme-toggle";

export function MenuBar() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const openWindow = useOpenWindow();
  const openSearch = useSearchStore((s) => s.open);

  const windows = useWindowStore((s) => s.windows);
  const focusedId = useWindowStore((s) => s.focusedId);
  const closeFocusedWindow = useWindowStore((s) => s.closeFocusedWindow);
  const closeAll = useWindowStore((s) => s.closeAll);
  const toggleMinimize = useWindowStore((s) => s.toggleMinimize);
  const minimizeAll = useWindowStore((s) => s.minimizeAll);
  const cascadeAll = useWindowStore((s) => s.cascadeAll);
  const setRect = useWindowStore((s) => s.setRect);
  const focusWindow = useWindowStore((s) => s.focusWindow);

  const theme = useSettingsStore((s) => s.theme);
  const setTheme = useSettingsStore((s) => s.setTheme);

  const hasFocused = focusedId !== null;

  function tileFocused(side: "left" | "right") {
    if (!focusedId) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    setRect(focusedId, {
      x: side === "left" ? 0 : vw / 2,
      y: 28,
      width: vw / 2,
      height: vh - 28,
    });
  }

  const fileItems: MenuItemDef[] = [
    { label: "Close Window", shortcut: "⌘W", disabled: !hasFocused, onSelect: closeFocusedWindow },
    { label: "Minimise Window", disabled: !hasFocused, onSelect: () => focusedId && toggleMinimize(focusedId) },
    { type: "separator" },
    { label: "Close All Windows", disabled: windows.length === 0, onSelect: closeAll },
  ];

  const viewItems: MenuItemDef[] = [
    { label: "Light", active: theme === "light", onSelect: () => setTheme("light") },
    { label: "Dark", active: theme === "dark", onSelect: () => setTheme("dark") },
    { label: "System", active: theme === null, onSelect: () => setTheme(null) },
    { type: "separator" },
    { label: "Show Desktop", disabled: windows.length === 0, onSelect: minimizeAll },
  ];

  const goItems: MenuItemDef[] = [
    { label: "Search…", shortcut: "⌘K", onSelect: openSearch },
    { type: "separator" },
    ...appDefinitions.map((app) => ({
      label: app.name,
      onSelect: () => openWindow({ kind: "app", appId: app.id }, document.activeElement as HTMLElement),
    })),
  ];

  const windowItems: MenuItemDef[] = [
    { label: "Tile Left", disabled: !hasFocused, onSelect: () => tileFocused("left") },
    { label: "Tile Right", disabled: !hasFocused, onSelect: () => tileFocused("right") },
    { label: "Cascade Windows", disabled: windows.length === 0, onSelect: cascadeAll },
    { label: "Minimise All", disabled: windows.length === 0, onSelect: minimizeAll },
    ...(windows.length > 0
      ? ([{ type: "separator" }] as MenuItemDef[]).concat(
          windows.map((w) => ({
            label: w.title,
            active: w.id === focusedId,
            onSelect: () => focusWindow(w.id),
          })),
        )
      : []),
  ];

  const githubLink = socialLinks.find((l) => l.id === "github");
  const helpItems: MenuItemDef[] = [
    { label: "About This Portfolio", onSelect: () => openWindow({ kind: "app", appId: "about" }, document.activeElement as HTMLElement) },
    { label: "Say Hello", onSelect: () => openWindow({ kind: "app", appId: "contact" }, document.activeElement as HTMLElement) },
    ...(githubLink
      ? ([{ type: "separator" }, { label: "View Source", onSelect: () => window.open(githubLink.url, "_blank", "noopener,noreferrer") }] as MenuItemDef[])
      : []),
    { type: "separator" },
    { type: "note", label: "⌘K search · ⌘W close · ⎋ close top · ⌘` cycle" },
  ];

  const menus: { key: string; label: string; items: MenuItemDef[] }[] = [
    { key: "file", label: "File", items: fileItems },
    { key: "view", label: "View", items: viewItems },
    { key: "go", label: "Go", items: goItems },
    { key: "window", label: "Window", items: windowItems },
    { key: "help", label: "Help", items: helpItems },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-7 items-center justify-between border-b border-hairline bg-surface-1/90 px-3 backdrop-blur">
      <div className="flex items-center gap-3">
        <span className="size-3 rounded-control bg-accent" aria-hidden="true" />
        <nav className="flex items-center gap-0.5" aria-label="Application menu">
          {menus.map((m) => (
            <Menu
              key={m.key}
              label={m.label}
              items={m.items}
              isOpen={openMenu === m.key}
              onOpen={() => setOpenMenu(m.key)}
              onClose={() => setOpenMenu((cur) => (cur === m.key ? null : cur))}
            />
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Search (⌘K)"
          onClick={openSearch}
          className="flex size-6 items-center justify-center rounded-control text-ink-muted outline-none transition-colors hover:text-ink focus-visible:ring-2 focus-visible:ring-accent"
        >
          <Search size={14} strokeWidth={1.8} />
        </button>
        <AccentPicker />
        <ThemeToggle />
        <Clock />
      </div>
    </header>
  );
}
