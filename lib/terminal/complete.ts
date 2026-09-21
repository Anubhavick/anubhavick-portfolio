import { appDefinitions } from "@/content";
import { ACCENTS } from "@/lib/accents";
import { commandList, THEME_NAMES } from "./commands";
import { getDir, resolvePath } from "./fs-utils";

export interface CompletionResult {
  /** The full input line after applying the completion (unchanged if none applied). */
  value: string;
  /** Populated when the prefix is ambiguous, so the terminal can print the options. */
  candidates: string[];
}

function commonPrefix(strings: string[]): string {
  if (strings.length === 0) return "";
  let prefix = strings[0];
  for (const s of strings.slice(1)) {
    let i = 0;
    while (i < prefix.length && i < s.length && prefix[i].toLowerCase() === s[i].toLowerCase()) i++;
    prefix = prefix.slice(0, i);
  }
  return prefix;
}

function pathCandidates(prefix: string, cwd: string): string[] {
  const slash = prefix.lastIndexOf("/");
  const dirPart = slash === -1 ? "" : prefix.slice(0, slash + 1);
  const dir = getDir(resolvePath(cwd, dirPart || "."));
  if (!dir) return [];
  return dir.children.map((c) => `${dirPart}${c.name}${c.type === "dir" ? "/" : ""}`);
}

const PATH_COMMANDS = new Set(["cd", "ls", "cat"]);
const APP_COMMANDS = new Set(["open", "close"]);

/** Tab completion for the first word (commands) and, given a recognized
 * leading command, the second word (app ids, paths, theme/accent names). */
export function complete(input: string, cwd: string): CompletionResult {
  const endsWithSpace = /\s$/.test(input);
  const words = input.split(/\s+/).filter(Boolean);
  const isFirstWord = words.length === 0 || (words.length === 1 && !endsWithSpace);
  const prefix = endsWithSpace ? "" : (words[words.length - 1] ?? "");

  let pool: string[];
  if (isFirstWord) {
    pool = commandList.map((c) => c.name);
  } else {
    const command = words[0]?.toLowerCase();
    if (APP_COMMANDS.has(command)) pool = appDefinitions.map((a) => a.id);
    else if (PATH_COMMANDS.has(command)) pool = pathCandidates(prefix, cwd);
    else if (command === "man") pool = commandList.map((c) => c.name);
    else if (command === "theme") pool = [...THEME_NAMES, ...ACCENTS];
    else return { value: input, candidates: [] };
  }

  const matches = pool.filter((p) => p.toLowerCase().startsWith(prefix.toLowerCase()));
  if (matches.length === 0) return { value: input, candidates: [] };

  if (matches.length === 1) {
    const newWords = isFirstWord ? [matches[0]] : [...words.slice(0, -1), matches[0]];
    // No trailing space after a directory — let the user keep typing the
    // next path segment right away instead of having to delete a space.
    const trailingSpace = matches[0].endsWith("/") ? "" : " ";
    return { value: `${newWords.join(" ")}${trailingSpace}`, candidates: [] };
  }

  const common = commonPrefix(matches);
  const newWords = isFirstWord ? [common] : [...words.slice(0, -1), common];
  return { value: newWords.join(" "), candidates: matches };
}
