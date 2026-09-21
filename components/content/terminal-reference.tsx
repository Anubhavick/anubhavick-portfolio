import { commandList } from "@/lib/terminal/commands";

/**
 * Static reference for the /terminal route: what the interactive terminal
 * can do, as crawlable prose. Not the live REPL itself — that's
 * necessarily client-only — but the same command surface, verbatim from
 * the same command definitions the terminal runs.
 */
export function TerminalReference() {
  return (
    <div className="flex flex-col gap-5 p-5">
      <p className="max-w-[60ch] text-sm text-ink-muted">
        anubhav&apos;s terminal — type <code className="font-mono text-ink">help</code> once it
        loads to get started. It runs a small virtual filesystem plus these commands:
      </p>
      <dl className="flex flex-col gap-4">
        {commandList.map((cmd) => (
          <div key={cmd.name} className="border-b border-hairline pb-4 last:border-b-0 last:pb-0">
            <dt className="font-mono text-sm text-ink">{cmd.usage}</dt>
            <dd className="mt-1 flex flex-col gap-1 text-sm text-ink-muted">
              {cmd.man.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
