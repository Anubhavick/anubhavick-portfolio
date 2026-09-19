"use client";

import { useState } from "react";
import { desktopFiles } from "@/content";
import type { DesktopFile } from "@/content/schema";
import { IconTile } from "@/components/icon-tile";
import { Wallpaper } from "@/components/wallpaper";
import { useISTClock } from "@/lib/use-clock";
import type { Rect } from "@/lib/motion";
import type { WindowTarget } from "@/lib/window-store";
import { AppSheet } from "./app-sheet";

interface ActiveSheet {
  target: WindowTarget;
  originRect: Rect;
}

function rectOf(el: HTMLElement): Rect {
  const r = el.getBoundingClientRect();
  return { x: r.x, y: r.y, width: r.width, height: r.height };
}

export function MobileShell() {
  const time = useISTClock();
  const [sheet, setSheet] = useState<ActiveSheet | null>(null);

  function handleOpen(file: DesktopFile, el: HTMLElement) {
    if (file.kind === "link" && file.href) {
      window.open(file.href, "_blank", "noopener,noreferrer");
      return;
    }
    if (file.kind === "folder") {
      setSheet({ target: { kind: "folder", fileId: file.id }, originRect: rectOf(el) });
      return;
    }
    if (file.kind === "app" && file.appId) {
      setSheet({ target: { kind: "app", appId: file.appId }, originRect: rectOf(el) });
    }
  }

  return (
    <div className="flex md:hidden">
      <div className="fixed inset-0 flex flex-col">
        <Wallpaper />

        <div className="flex h-11 shrink-0 items-center justify-center pt-[env(safe-area-inset-top)]">
          <span className="font-mono text-xs tabular-nums text-ink-muted">
            {time ?? "--:-- IST"}
          </span>
        </div>

        <div
          role="listbox"
          aria-label="Apps"
          className="grid flex-1 auto-rows-min grid-cols-3 gap-6 overflow-y-auto p-6 pb-[calc(env(safe-area-inset-bottom)+24px)]"
        >
          {desktopFiles.map((file) => (
            <button
              key={file.id}
              type="button"
              className="outline-none focus-visible:ring-2 focus-visible:ring-accent"
              onClick={(e) => handleOpen(file, e.currentTarget)}
            >
              <IconTile
                icon={file.icon}
                label={file.name}
                size="lg"
                labelClassName="text-ink"
              />
            </button>
          ))}
        </div>
      </div>

      {sheet && (
        <AppSheet
          target={sheet.target}
          originRect={sheet.originRect}
          onRequestClose={() => setSheet(null)}
        />
      )}
    </div>
  );
}
