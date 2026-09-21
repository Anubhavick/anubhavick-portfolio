import { appDefinitions, projects } from "@/content";
import { HOME } from "@/content/fs";
import type { AppDefinition, AppId } from "@/content/schema";
import { getWindowActions } from "@/lib/window-action-registry";
import { ACCENTS, type Accent } from "@/lib/accents";
import { useSettingsStore } from "@/lib/settings-store";
import { openWindowTarget } from "@/lib/use-open-window";
import { useWindowStore } from "@/lib/window-store";
import { displayPath, getDir, getNode, resolvePath } from "./fs-utils";
import { closestMatch } from "./suggest";
import { fail, ok, text, type CommandContext, type CommandDef, type CommandResult } from "./types";

export const THEME_NAMES = ["light", "dark", "system"] as const;

function findApp(query: string): AppDefinition | null {
  const q = query.trim().toLowerCase();
  if (!q) return null;
  return (
    appDefinitions.find((a) => a.id === q) ??
    appDefinitions.find((a) => a.name.toLowerCase() === q) ??
    appDefinitions.find((a) => a.name.toLowerCase().startsWith(q)) ??
    appDefinitions.find((a) => a.name.toLowerCase().includes(q)) ??
    null
  );
}

function windowForApp(appId: AppId) {
  return useWindowStore.getState().windows.find((w) => w.target.kind === "app" && w.target.appId === appId);
}

const help: CommandDef = {
  name: "help",
  usage: "help",
  summary: "list commands",
  man: ["Lists every command this terminal understands. Run `man <command>` for details on one of them."],
  run: () => {
    const width = Math.max(...commandList.map((c) => c.name.length));
    return ok([
      text("Commands:", "accent"),
      ...commandList.map((c) => text(`  ${c.name.padEnd(width + 2)}${c.summary}`)),
      text(""),
      text("Run `man <command>` for a full page on any of them.", "muted"),
    ]);
  },
};

const ls: CommandDef = {
  name: "ls",
  usage: "ls [path]",
  summary: "list the virtual filesystem",
  man: [
    "Lists the contents of a directory in the virtual filesystem — the same",
    "one the desktop icons and the `cat`/`cd` commands walk.",
    "With no argument, lists the current directory.",
  ],
  run: ({ args, cwd }) => {
    const target = args[0] ? resolvePath(cwd, args[0]) : cwd;
    const dir = getDir(target);
    if (!dir) {
      const node = getNode(target);
      const label = args[0] ?? target;
      return fail(node ? `ls: ${label}: not a directory` : `ls: ${label}: no such file or directory`);
    }
    if (dir.children.length === 0) return ok([text("(empty)", "muted")]);
    const entries = [...dir.children].sort((a, b) => a.name.localeCompare(b.name));
    return ok([
      text(
        entries.map((e) => (e.type === "dir" ? `${e.name}/` : e.name)).join("  "),
      ),
    ]);
  },
};

const cd: CommandDef = {
  name: "cd",
  usage: "cd [dir]",
  summary: "navigate",
  man: [
    "Changes the current directory. Supports relative paths, absolute",
    "paths, `..`, and `~` for home. With no argument, goes home.",
  ],
  run: ({ args, cwd, setCwd }) => {
    const target = args[0] ? resolvePath(cwd, args[0]) : HOME;
    const dir = getDir(target);
    if (!dir) {
      const node = getNode(target);
      const label = args[0] ?? target;
      return fail(node ? `cd: ${label}: not a directory` : `cd: ${label}: no such file or directory`);
    }
    setCwd(target);
    return ok();
  },
};

const cat: CommandDef = {
  name: "cat",
  usage: "cat <file>",
  summary: "print a file (README.md, now.txt, projects/*.md)",
  man: [
    "Prints a file's contents — README.md, now.txt, or one of the project",
    "write-ups under projects/. Also works on any Desktop/ shortcut, which",
    "prints a description of what it links to.",
  ],
  run: ({ args, cwd }) => {
    if (!args[0]) return fail("usage: cat <file>");
    const target = resolvePath(cwd, args[0]);
    const node = getNode(target);
    if (!node) return fail(`cat: ${args[0]}: no such file or directory`);
    if (node.type === "dir") return fail(`cat: ${args[0]}: is a directory`);
    return ok(node.content.split("\n").map((line) => text(line)));
  },
};

const open: CommandDef = {
  name: "open",
  usage: "open <app>",
  summary: "open a window",
  man: [
    "Opens an app window — the exact same window store every dock icon",
    "and desktop icon opens through. Matches by app id (`projects`) or",
    "name (`Projects`).",
  ],
  run: ({ args }) => {
    if (!args[0]) return fail("usage: open <app>");
    const app = findApp(args.join(" "));
    if (!app) {
      const suggestion = closestMatch(args[0].toLowerCase(), appDefinitions.map((a) => a.id));
      return fail(`open: no app matching "${args.join(" ")}"`, suggestion ? `open ${suggestion}` : undefined);
    }
    openWindowTarget({ kind: "app", appId: app.id });
    return ok([text(`opening ${app.name}...`, "muted")]);
  },
};

const close: CommandDef = {
  name: "close",
  usage: "close <app|all>",
  summary: "close windows",
  man: ["Closes a running app's window by id or name, or `close all` to close everything open."],
  run: ({ args }) => {
    if (!args[0]) return fail("usage: close <app|all>");
    if (args[0].toLowerCase() === "all") {
      const count = useWindowStore.getState().windows.length;
      useWindowStore.getState().closeAll();
      return ok([text(count > 0 ? `closed ${count} window(s)` : "nothing was open", "muted")]);
    }
    const app = findApp(args.join(" "));
    if (!app) {
      const suggestion = closestMatch(args[0].toLowerCase(), appDefinitions.map((a) => a.id));
      return fail(`close: no app matching "${args.join(" ")}"`, suggestion ? `close ${suggestion}` : undefined);
    }
    const win = windowForApp(app.id);
    if (!win) return fail(`close: ${app.name} isn't open`);
    const actions = getWindowActions(win.id);
    if (actions) actions.close();
    else useWindowStore.getState().closeWindow(win.id);
    return ok([text(`closing ${app.name}...`, "muted")]);
  },
};

const windows: CommandDef = {
  name: "windows",
  usage: "windows",
  summary: "list open windows with their geometry",
  man: ["Lists every open window: title, position, size, and whether it's focused, minimised, or maximised."],
  run: () => {
    const state = useWindowStore.getState();
    if (state.windows.length === 0) return ok([text("no windows open", "muted")]);
    return ok(
      state.windows.map((w) => {
        const flags = [
          w.id === state.focusedId && "focused",
          w.minimised && "minimised",
          w.maximised && "maximised",
        ].filter(Boolean);
        const geometry = `${Math.round(w.x)},${Math.round(w.y)} ${Math.round(w.width)}x${Math.round(w.height)}`;
        return text(`${w.title.padEnd(16)} ${geometry}${flags.length ? `  [${flags.join(", ")}]` : ""}`);
      }),
    );
  },
};

const whoami: CommandDef = {
  name: "whoami",
  usage: "whoami",
  summary: "a short bio line",
  man: ["Prints a one-line bio. Run `open about` for the full version."],
  run: () =>
    ok([
      text(
        "Anubhav Mishra — full-stack engineer specializing in AI/ML integration, blockchain, and cloud-native architecture. 3rd-year CS student at MRIIRS.",
      ),
    ]),
};

const projectsCmd: CommandDef = {
  name: "projects",
  usage: "projects",
  summary: "list projects with links",
  man: ["Lists every project: title, one-line summary, and its links. Run `open projects` for the window version."],
  run: () =>
    ok(
      projects.flatMap((p): ReturnType<typeof text>[] => [
        text(`${p.title} (${p.year}, ${p.status})`, "accent"),
        text(`  ${p.summary}`, "muted"),
        ...p.links.map((l) => ({ type: "link" as const, text: `  ${l.label}: ${l.url}`, href: l.url })),
      ]),
    ),
};

const theme: CommandDef = {
  name: "theme",
  usage: "theme <name>",
  summary: "switch accent or light/dark, live",
  man: [
    `Sets the theme (${THEME_NAMES.join(", ")}) or the accent (${ACCENTS.join(", ")}).`,
    "Applies immediately and persists across visits, same as the Settings app.",
  ],
  run: ({ args }) => {
    if (!args[0]) return fail(`usage: theme <${[...THEME_NAMES, ...ACCENTS].join("|")}>`);
    const value = args[0].toLowerCase();
    if ((THEME_NAMES as readonly string[]).includes(value)) {
      useSettingsStore.getState().setTheme(value === "system" ? null : (value as "light" | "dark"));
      return ok([text(`theme set to ${value}`, "muted")]);
    }
    if ((ACCENTS as readonly string[]).includes(value)) {
      useSettingsStore.getState().setAccent(value as Accent);
      return ok([text(`accent set to ${value}`, "muted")]);
    }
    return fail(`theme: unknown value "${args[0]}"`, `theme ${closestMatch(value, [...THEME_NAMES, ...ACCENTS]) ?? "system"}`);
  },
};

const clear: CommandDef = {
  name: "clear",
  usage: "clear",
  summary: "clear scrollback",
  man: ["Clears everything printed so far in this session."],
  run: () => ({ ok: true, clear: true }),
};

const man: CommandDef = {
  name: "man",
  usage: "man <command>",
  summary: "a real man page per command",
  man: ["Prints the manual page for a command. You're looking at it right now for `man`."],
  run: ({ args }) => {
    if (!args[0]) return fail("usage: man <command>");
    const cmd = commandRegistry[args[0].toLowerCase()];
    if (!cmd) {
      const suggestion = closestMatch(args[0].toLowerCase(), commandList.map((c) => c.name));
      return fail(`man: no manual entry for ${args[0]}`, suggestion ? `man ${suggestion}` : undefined);
    }
    return ok([
      text(cmd.name.toUpperCase(), "accent"),
      text(`  ${cmd.usage}`, "muted"),
      text(""),
      ...cmd.man.map((line) => text(line)),
    ]);
  },
};

export const commandList: CommandDef[] = [
  help,
  ls,
  cd,
  cat,
  open,
  close,
  windows,
  whoami,
  projectsCmd,
  theme,
  clear,
  man,
];

export const commandRegistry: Record<string, CommandDef> = Object.fromEntries(
  commandList.map((c) => [c.name, c]),
);

export function executeCommand(input: string, ctx: CommandContext): CommandResult {
  const name = ctx.args[0]?.toLowerCase();
  if (!name) return ok();

  const cmd = commandRegistry[name];
  if (!cmd) {
    const suggestion = closestMatch(name, commandList.map((c) => c.name));
    return fail(
      `command not found: ${name}`,
      suggestion ? `did you mean \`${suggestion}\`?` : "run `help` for a list of commands",
    );
  }

  return cmd.run({ ...ctx, args: ctx.args.slice(1) });
}

export function promptFor(cwd: string): string {
  return `visitor@anubhav ${displayPath(cwd)} %`;
}
