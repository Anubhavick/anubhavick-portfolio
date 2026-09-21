"use client";

import { renderIcon } from "@/lib/icons";
import { resolveWindowMeta } from "@/lib/window-content";
import { useOpenWindow } from "@/lib/use-open-window";
import type { WindowTarget } from "@/lib/window-store";

interface PlaceholderBodyProps {
  target: WindowTarget;
}

/**
 * No app content yet — every window renders this. An app window shows its
 * name/description as a stand-in; a folder window is genuinely functional
 * navigation chrome (not "content"), listing its children so opening a
 * folder from the desktop actually does something.
 */
export function PlaceholderBody({ target }: PlaceholderBodyProps) {
  const meta = resolveWindowMeta(target);
  const openWindow = useOpenWindow();

  if (!meta) {
    return (
      <p className="p-4 font-mono text-xs text-ink-muted">Nothing here.</p>
    );
  }

  if (meta.folder) {
    const children = meta.folder.children ?? [];
    return (
      <div className="flex h-full flex-col gap-4 p-4">
        {children.length === 0 ? (
          <p className="font-mono text-xs text-ink-muted">Empty folder.</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {children.map((child) => {
              return (
                <button
                  key={child.id}
                  type="button"
                  className="flex w-20 flex-col items-center gap-1.5 rounded-control p-2 outline-none hover:bg-surface-2/60 focus-visible:ring-2 focus-visible:ring-accent"
                  onDoubleClick={(e) => {
                    if (child.kind === "app" && child.appId) {
                      openWindow(
                        { kind: "app", appId: child.appId },
                        e.currentTarget,
                      );
                    } else if (child.kind === "folder") {
                      openWindow(
                        { kind: "folder", fileId: child.id },
                        e.currentTarget,
                      );
                    } else if (child.kind === "link" && child.href) {
                      window.open(child.href, "_blank", "noopener,noreferrer");
                    }
                  }}
                >
                  <div className="flex size-11 items-center justify-center rounded-window bg-surface-2/60">
                    {renderIcon(child.icon, { size: 22, className: "text-ink", strokeWidth: 1.6 })}
                  </div>
                  <span className="max-w-20 truncate text-center font-mono text-xs text-ink-muted">
                    {child.name}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
      <div className="flex size-14 items-center justify-center rounded-window bg-surface-2/60">
        {renderIcon(meta.icon, { size: 28, className: "text-ink", strokeWidth: 1.6 })}
      </div>
      <p className="text-lg text-ink">{meta.title}</p>
      {meta.app?.description && (
        <p className="max-w-[32ch] text-sm text-ink-muted">
          {meta.app.description}
        </p>
      )}
      <p className="font-mono text-xs text-ink-muted">
        no inline preview yet — ping me by email for the PDF
      </p>
    </div>
  );
}
