import { commandList } from "@/lib/terminal/commands";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-2.5 border-b border-hairline px-5 py-4 last:border-b-0">
      <h2 className="font-mono text-xs uppercase tracking-wide text-ink-muted">{title}</h2>
      {children}
    </section>
  );
}

function Row({ term, detail }: { term: string; detail: string }) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="w-40 shrink-0 font-mono text-xs text-ink">{term}</span>
      <span className="text-sm text-ink-muted">{detail}</span>
    </div>
  );
}

const SHORTCUTS = [
  { term: "⌘ / Ctrl K", detail: "Open search" },
  { term: "⌘ / Ctrl W", detail: "Close the focused window" },
  { term: "Esc", detail: "Close the topmost window, or dismiss search" },
  { term: "⌘ / Ctrl `", detail: "Cycle between open windows" },
  { term: "Arrow keys", detail: "Move between desktop icons, dock icons, or menu items" },
  { term: "Double-click title bar", detail: "Maximise or restore a window" },
  { term: "Drag to screen edge", detail: "Snap a window left, right, or maximised" },
];

const SEARCH_INTENTS = [
  { term: "open <app>", detail: "Opens an app window, e.g. \"open contact\"" },
  { term: "show <app>", detail: "Same as open" },
  { term: "close <app>", detail: "Closes a running app's window" },
  { term: "close all", detail: "Closes every open window" },
  { term: "dark mode / light mode", detail: "Switches the theme" },
  { term: "go to <project>", detail: "Opens Projects, matched to that project" },
];

export function HelpApp() {
  return (
    <div className="flex h-full flex-col overflow-y-auto bg-surface-0">
      <Section title="Dock">
        <p className="max-w-[56ch] text-sm text-ink-muted">
          Move the pointer along the dock to magnify nearby icons. Click an icon to open its app,
          focus it if it&apos;s already running, or minimise it if it&apos;s already focused. The
          small dot under an icon means that app is currently open.
        </p>
      </Section>

      <Section title="Keyboard shortcuts">
        <div className="flex flex-col gap-1.5">
          {SHORTCUTS.map((s) => (
            <Row key={s.term} term={s.term} detail={s.detail} />
          ))}
        </div>
      </Section>

      <Section title="Search (⌘ / Ctrl K)">
        <p className="max-w-[56ch] text-sm text-ink-muted">
          Fuzzy-matches across apps, projects, experience, desktop files, and stack items as you
          type. It also understands a few plain-language commands:
        </p>
        <div className="flex flex-col gap-1.5">
          {SEARCH_INTENTS.map((s) => (
            <Row key={s.term} term={s.term} detail={s.detail} />
          ))}
        </div>
      </Section>

      <Section title="Terminal commands">
        <div className="flex flex-col gap-1.5">
          {commandList.map((c) => (
            <Row key={c.name} term={c.usage} detail={c.summary} />
          ))}
        </div>
        <p className="text-xs text-ink-muted">
          Run <span className="font-mono text-ink">man &lt;command&gt;</span> inside the terminal
          for the full page on any of these.
        </p>
      </Section>
    </div>
  );
}
