"use client";

import { useEffect, useRef, useState } from "react";
import { complete } from "@/lib/terminal/complete";
import { executeCommand, promptFor } from "@/lib/terminal/commands";
import { tokenize } from "@/lib/terminal/parser";
import { entryId, useTerminalStore } from "@/lib/terminal/terminal-store";
import type { OutputLine, OutputTone, ScrollbackEntry } from "@/lib/terminal/types";

const WELCOME: OutputLine[] = [
  { type: "text", text: "anubhav's terminal — type `help` to get started.", tone: "muted" },
];

function toneClass(tone?: OutputTone): string {
  switch (tone) {
    case "muted":
      return "text-ink-muted";
    case "accent":
      return "text-accent";
    case "error":
      return "text-danger";
    default:
      return "text-ink";
  }
}

export function Terminal() {
  const cwd = useTerminalStore((s) => s.cwd);
  const scrollback = useTerminalStore((s) => s.scrollback);
  const history = useTerminalStore((s) => s.history);
  const historyIndex = useTerminalStore((s) => s.historyIndex);
  const draft = useTerminalStore((s) => s.draft);
  const setCwd = useTerminalStore((s) => s.setCwd);
  const pushEntries = useTerminalStore((s) => s.pushEntries);
  const clearScrollback = useTerminalStore((s) => s.clearScrollback);
  const pushHistory = useTerminalStore((s) => s.pushHistory);
  const setHistoryIndex = useTerminalStore((s) => s.setHistoryIndex);
  const setDraft = useTerminalStore((s) => s.setDraft);

  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const seeded = useRef(false);

  // Seed the welcome banner once, but only for a truly fresh session — the
  // store persists in memory across close/reopen, so a returning visit to
  // this window should keep its scrollback, not print the banner again.
  useEffect(() => {
    if (seeded.current) return;
    seeded.current = true;
    if (scrollback.length === 0) {
      pushEntries([{ id: entryId(), kind: "output", lines: WELCOME }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [scrollback]);

  function focusInput() {
    inputRef.current?.focus();
  }

  function runLine(line: string) {
    const prompt = promptFor(cwd);
    const args = tokenize(line);
    pushHistory(line);

    const entries: ScrollbackEntry[] = [{ id: entryId(), kind: "command", prompt, input: line }];
    const result = executeCommand(line, { args, raw: line, cwd, setCwd });

    if (!result.ok) {
      entries.push({ id: entryId(), kind: "error", message: result.message, suggestion: result.suggestion });
      pushEntries(entries);
    } else if (result.clear) {
      pushEntries(entries);
      clearScrollback();
    } else {
      if (result.output && result.output.length > 0) {
        entries.push({ id: entryId(), kind: "output", lines: result.output });
      }
      pushEntries(entries);
    }

    setInput("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.ctrlKey && e.key.toLowerCase() === "c") {
      e.preventDefault();
      pushEntries([{ id: entryId(), kind: "command", prompt: promptFor(cwd), input: `${input}^C` }]);
      setInput("");
      setHistoryIndex(-1);
      setDraft("");
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (input.trim()) runLine(input);
      else pushEntries([{ id: entryId(), kind: "command", prompt: promptFor(cwd), input: "" }]);
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();
      const result = complete(input, cwd);
      if (result.candidates.length > 1) {
        pushEntries([
          {
            id: entryId(),
            kind: "output",
            lines: [{ type: "text", text: result.candidates.join("  "), tone: "muted" }],
          },
        ]);
      }
      setInput(result.value);
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      if (historyIndex === -1) setDraft(input);
      const nextIndex = historyIndex === -1 ? history.length - 1 : Math.max(historyIndex - 1, 0);
      setHistoryIndex(nextIndex);
      setInput(history[nextIndex]);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= history.length) {
        setHistoryIndex(-1);
        setInput(draft);
      } else {
        setHistoryIndex(nextIndex);
        setInput(history[nextIndex]);
      }
    }
  }

  return (
    <div
      className="flex h-full min-h-0 flex-col bg-surface-0 p-3 font-mono text-xs"
      onPointerDown={focusInput}
    >
      <div ref={scrollRef} className="min-h-0 flex-1 space-y-1 overflow-y-auto pr-1">
        {scrollback.map((entry) => {
          if (entry.kind === "command") {
            return (
              <p key={entry.id} className="text-ink">
                <span className="text-accent">{entry.prompt}</span> {entry.input}
              </p>
            );
          }
          if (entry.kind === "error") {
            return (
              <div key={entry.id}>
                <p className="text-danger">{entry.message}</p>
                {entry.suggestion && <p className="text-ink-muted">{entry.suggestion}</p>}
              </div>
            );
          }
          return (
            <div key={entry.id}>
              {entry.lines.map((line, i) =>
                line.type === "link" ? (
                  <a
                    key={i}
                    href={line.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-accent underline underline-offset-2 hover:text-accent-strong"
                  >
                    {line.text}
                  </a>
                ) : (
                  <p key={i} className={toneClass(line.tone)}>
                    {line.text || " "}
                  </p>
                ),
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-1 flex shrink-0 items-center gap-2">
        <span className="shrink-0 text-accent">{promptFor(cwd)}</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          spellCheck={false}
          autoComplete="off"
          aria-label="Terminal input"
          className="min-w-0 flex-1 bg-transparent text-ink caret-accent outline-none"
        />
      </div>
    </div>
  );
}
