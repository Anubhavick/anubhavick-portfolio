import { fsRoot, HOME, type FsDir, type FsNode } from "@/content/fs";

/** Splits an absolute path into non-empty segments: "/a/b/" -> ["a", "b"]. */
function segments(path: string): string[] {
  return path.split("/").filter(Boolean);
}

/**
 * Resolves `input` (absolute, relative, "~", ".", "..") against `cwd` into a
 * normalized absolute path. Never throws — ".." past root just clamps to
 * root, matching how a real shell's `cd /` + `cd ..` behaves.
 */
export function resolvePath(cwd: string, input: string): string {
  const expanded = input === "~" || input.startsWith("~/") ? input.replace(/^~/, HOME) : input;
  const base = expanded.startsWith("/") ? [] : segments(cwd);
  const parts = [...base];

  for (const part of segments(expanded)) {
    if (part === ".") continue;
    if (part === "..") {
      parts.pop();
      continue;
    }
    parts.push(part);
  }

  return `/${parts.join("/")}`;
}

/** Walks the tree to the node at `path`, or null if nothing lives there. */
export function getNode(path: string): FsNode | null {
  let node: FsNode = fsRoot;
  for (const part of segments(path)) {
    if (node.type !== "dir") return null;
    const next: FsNode | undefined = node.children.find((c) => c.name === part);
    if (!next) return null;
    node = next;
  }
  return node;
}

export function getDir(path: string): FsDir | null {
  const node = getNode(path);
  return node && node.type === "dir" ? node : null;
}

/** Path relative to HOME with "~" shorthand, for prompts and `pwd`-style output. */
export function displayPath(path: string): string {
  if (path === HOME) return "~";
  if (path.startsWith(`${HOME}/`)) return `~${path.slice(HOME.length)}`;
  return path;
}
