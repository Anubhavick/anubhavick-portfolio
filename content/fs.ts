import { desktopFiles } from "./desktop-files";
import { experience } from "./experience";
import { projects } from "./projects";
import { socialLinks } from "./social-links";
import type { AppId, DesktopFile } from "./schema";

/**
 * A virtual filesystem the terminal's `ls`/`cd`/`cat` walk. Deliberately not
 * a second copy of the desktop layout: the `Desktop/` directory is built by
 * walking `desktopFiles` (content/desktop-files.ts) below, so the desktop
 * and the terminal can never drift apart. `projects/*.md` is generated from
 * content/projects.ts the same way, for the same reason.
 */

export const HOME = "/home/anubhav";

export interface FsFile {
  type: "file";
  name: string;
  content: string;
  /** Set when this file is really a shortcut to a launchable app. */
  appId?: AppId;
  /** Set when this file is really a shortcut to an external link. */
  href?: string;
}

export interface FsDir {
  type: "dir";
  name: string;
  children: FsNode[];
}

export type FsNode = FsFile | FsDir;

function dir(name: string, children: FsNode[]): FsDir {
  return { type: "dir", name, children };
}

function file(name: string, content: string, extra?: Partial<Pick<FsFile, "appId" | "href">>): FsFile {
  return { type: "file", name, content, ...extra };
}

function desktopFileToNode(entry: DesktopFile): FsNode {
  if (entry.kind === "folder") {
    return dir(entry.name, (entry.children ?? []).map(desktopFileToNode));
  }
  if (entry.kind === "link" && entry.href) {
    return file(entry.name, `${entry.name} -> ${entry.href}`, { href: entry.href });
  }
  if (entry.kind === "app" && entry.appId) {
    return file(entry.name, `${entry.name} — an app shortcut. Try \`open ${entry.appId}\`.`, {
      appId: entry.appId,
    });
  }
  return file(entry.name, entry.name);
}

function readmeContent(): string {
  return [
    "# Anubhav Mishra",
    "",
    "Full-stack engineer specializing in AI/ML integration, blockchain, and",
    "cloud-native architecture. 3rd-year CS student at MRIIRS. This whole",
    "site is a desktop-OS metaphor — drag windows, dig through the desktop,",
    "or stay right here and drive it from the keyboard.",
    "",
    "Run `help` for what this terminal can do, or `ls` to look around.",
    "",
    "## Elsewhere",
    ...socialLinks.map((link) => `- ${link.label}: ${link.url}`),
  ].join("\n");
}

function nowContent(): string {
  const current = experience.find((entry) => !entry.endDate) ?? experience[0];
  return [
    "# now",
    "",
    current
      ? `Currently: ${current.role} at ${current.organization}.`
      : "Currently: heads-down on the next thing.",
    "",
    `Shipped ${projects.filter((p) => p.status === "shipped").length} project(s) so far,`,
    `with ${projects.filter((p) => p.status === "in-progress").length} more in progress.`,
    "",
    "See `projects/` for the write-ups, or run `projects` for the short list.",
  ].join("\n");
}

function projectFileContent(p: (typeof projects)[number]): string {
  const lines = [
    `# ${p.title}`,
    "",
    p.summary,
    "",
    p.description,
    "",
    `role: ${p.role}`,
    `year: ${p.year}`,
    `status: ${p.status}`,
    `stack: ${p.stack.join(", ")}`,
  ];
  if (p.links.length > 0) {
    lines.push("", "## links");
    for (const link of p.links) lines.push(`- ${link.label} (${link.kind}): ${link.url}`);
  }
  return lines.join("\n");
}

function buildRoot(): FsDir {
  const projectsDir = dir(
    "projects",
    projects.map((p) => file(`${p.slug}.md`, projectFileContent(p))),
  );

  const home = dir("anubhav", [
    file("README.md", readmeContent()),
    file("now.txt", nowContent()),
    projectsDir,
    dir("Desktop", desktopFiles.map(desktopFileToNode)),
  ]);

  return dir("/", [dir("home", [home])]);
}

export const fsRoot: FsDir = buildRoot();
