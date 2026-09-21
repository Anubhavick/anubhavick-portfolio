"use client";

import { MenuBar } from "@/components/menu-bar/menu-bar";
import { SearchOverlay } from "@/components/search/search-overlay";
import { Wallpaper } from "@/components/wallpaper";
import { Dock } from "@/components/dock/dock";
import { WindowManager } from "@/components/window/window-manager";
import { Desktop } from "./desktop";

/** The windowed desktop shell (>=768px). A genuinely separate tree from
 * MobileShell — not a CSS override of it. */
export function DesktopShell() {
  return (
    <div className="hidden md:block">
      <Wallpaper />
      <MenuBar />
      <main className="fixed inset-0">
        <Desktop />
        <WindowManager />
      </main>
      <Dock />
      <SearchOverlay />
    </div>
  );
}
