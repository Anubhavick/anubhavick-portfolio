export type OutputTone = "default" | "muted" | "accent" | "error";

/**
 * Typed command output — the terminal renders these directly. Commands
 * never hand back a plain string for the UI to sniff or parse.
 */
export type OutputLine =
  | { type: "text"; text: string; tone?: OutputTone }
  | { type: "link"; text: string; href: string };

export interface CommandContext {
  args: string[];
  raw: string;
  cwd: string;
  setCwd: (path: string) => void;
}

export interface CommandSuccess {
  ok: true;
  output?: OutputLine[];
  /** Set by `clear`: the terminal wipes its scrollback instead of printing. */
  clear?: true;
}

export interface CommandFailure {
  ok: false;
  message: string;
  suggestion?: string;
}

export type CommandResult = CommandSuccess | CommandFailure;

export type ScrollbackEntry =
  | { id: string; kind: "command"; prompt: string; input: string }
  | { id: string; kind: "output"; lines: OutputLine[] }
  | { id: string; kind: "error"; message: string; suggestion?: string };

export interface CommandDef {
  name: string;
  usage: string;
  summary: string;
  /** Paragraphs shown by `man <command>` and in the Help window. */
  man: string[];
  run: (ctx: CommandContext) => CommandResult;
}

export function text(text: string, tone?: OutputTone): OutputLine {
  return { type: "text", text, tone };
}

export function ok(output?: OutputLine[]): CommandSuccess {
  return { ok: true, output };
}

export function fail(message: string, suggestion?: string): CommandFailure {
  return { ok: false, message, suggestion };
}
