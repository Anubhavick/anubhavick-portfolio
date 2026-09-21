"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { renderIcon } from "@/lib/icons";
import { matchIntent } from "@/lib/search/intent";
import { searchEntries } from "@/lib/search";
import { useSearchStore } from "@/lib/search/search-store";
import type { SearchEntry, SearchResultKind } from "@/lib/search/types";

const GROUP_LABEL: Record<SearchResultKind, string> = {
  app: "Apps",
  project: "Projects",
  experience: "Experience",
  file: "Files",
  stack: "Stack",
};

const GROUP_ORDER: SearchResultKind[] = ["app", "project", "experience", "file", "stack"];
const MAX_PER_GROUP = 5;

type Row =
  | { kind: "intent"; key: string; label: string; run: () => void }
  | { kind: "entry"; key: string; entry: SearchEntry };

function isMac() {
  if (typeof navigator === "undefined") return false;
  return /Mac|iPhone|iPad/.test(navigator.platform ?? navigator.userAgent);
}

/** Always mounted (so Cmd/Ctrl+K works from anywhere) — mounts a fresh
 * SearchPanel each time it opens, so the panel's own state resets for free
 * instead of needing a reset-on-open effect. */
export function SearchOverlay() {
  const isOpen = useSearchStore((s) => s.isOpen);
  const open = useSearchStore((s) => s.open);
  const close = useSearchStore((s) => s.close);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const mod = isMac() ? e.metaKey : e.ctrlKey;
      if (mod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        open();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  if (!isOpen) return null;
  return <SearchPanel onClose={close} />;
}

function SearchPanel({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const intent = useMemo(() => matchIntent(query), [query]);

  const groups = useMemo(() => {
    const scored = searchEntries(query);
    return GROUP_ORDER.map((kind) => ({
      kind,
      label: GROUP_LABEL[kind],
      entries: scored.filter((s) => s.entry.kind === kind).slice(0, MAX_PER_GROUP).map((s) => s.entry),
    })).filter((g) => g.entries.length > 0);
  }, [query]);

  const rows: Row[] = useMemo(() => {
    const intentRow: Row[] = intent ? [{ kind: "intent", key: "intent", label: intent.label, run: intent.run }] : [];
    const entryRows: Row[] = groups.flatMap((g) =>
      g.entries.map((entry): Row => ({ kind: "entry", key: entry.id, entry })),
    );
    return [...intentRow, ...entryRows];
  }, [intent, groups]);

  // Re-point the selection at the top result whenever the query (and so the
  // result set) changes — adjusted during render, per React's guidance on
  // deriving state from a changed input, rather than via a setState-in-effect
  // that would trigger an extra render.
  const [queryAtLastIndexReset, setQueryAtLastIndexReset] = useState(query);
  if (query !== queryAtLastIndexReset) {
    setQueryAtLastIndexReset(query);
    setActiveIndex(0);
  }

  function runRow(row: Row) {
    if (row.kind === "intent") row.run();
    else row.entry.run();
    onClose();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (rows.length === 0 ? 0 : (i + 1) % rows.length));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (rows.length === 0 ? 0 : (i - 1 + rows.length) % rows.length));
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const row = rows[activeIndex];
      if (row) runRow(row);
    }
  }

  return (
    <div
      className="fixed inset-0 z-200 flex justify-center bg-ink/40 pt-[12vh] backdrop-blur-sm"
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-label="Search"
        className="h-fit w-full max-w-lg overflow-hidden rounded-window border border-hairline bg-surface-1 shadow-window"
      >
        <div className="flex items-center gap-2.5 border-b border-hairline px-4 py-3">
          <SearchIcon size={16} className="shrink-0 text-ink-muted" strokeWidth={1.8} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search apps, projects, files… or try “dark mode”, “go to aperture”"
            spellCheck={false}
            autoComplete="off"
            aria-label="Search"
            className="min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-ink-muted"
          />
          <kbd className="shrink-0 rounded-control border border-hairline px-1.5 py-0.5 font-mono text-xs text-ink-muted">
            Esc
          </kbd>
        </div>

        <div className="max-h-[55vh] overflow-y-auto py-2">
          {intent && (
            <div className="px-2 pb-1">
              <button
                type="button"
                onPointerEnter={() => setActiveIndex(0)}
                onClick={() => runRow(rows[0])}
                className={`flex w-full items-center gap-2.5 rounded-control px-2.5 py-2 text-left text-sm outline-none ${
                  activeIndex === 0 ? "bg-accent-soft/25 text-ink" : "text-ink"
                }`}
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-control bg-accent-soft/25 text-accent">
                  <SearchIcon size={14} strokeWidth={1.8} />
                </span>
                {intent.label}
              </button>
            </div>
          )}

          {groups.length === 0 && !intent && (
            <p className="px-4 py-6 text-center text-sm text-ink-muted">
              {query.trim() ? "No matches." : "Start typing to search."}
            </p>
          )}

          {groups.map((group) => (
            <div key={group.kind} className="px-2 py-1">
              <p className="px-2.5 pb-1 font-mono text-xs uppercase tracking-wide text-ink-muted">
                {group.label}
              </p>
              {group.entries.map((entry) => {
                const index = rows.findIndex((r) => r.kind === "entry" && r.entry.id === entry.id);
                const active = index === activeIndex;
                return (
                  <button
                    key={entry.id}
                    type="button"
                    onPointerEnter={() => setActiveIndex(index)}
                    onClick={() => runRow({ kind: "entry", key: entry.id, entry })}
                    className={`flex w-full items-center gap-2.5 rounded-control px-2.5 py-2 text-left outline-none ${
                      active ? "bg-accent-soft/25 text-ink" : "text-ink"
                    }`}
                  >
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-control bg-surface-2/60">
                      {renderIcon(entry.icon, { size: 14, strokeWidth: 1.8 })}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm">{entry.title}</span>
                      {entry.subtitle && (
                        <span className="block truncate text-xs text-ink-muted">{entry.subtitle}</span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
