import { createElement, type ReactElement } from "react";
import {
  AppWindow,
  Briefcase,
  Code2,
  Cpu,
  File,
  FileText,
  Folder,
  HelpCircle,
  Link,
  Mail,
  Terminal,
  User,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";

/**
 * The icon system content/*.ts files were written against — every `icon`
 * string identifier in content data must have an entry here. Falls back to
 * HelpCircle (and a dev-time warning) for an id that drifts out of sync.
 *
 * lucide-react dropped brand/logo glyphs (Github, Linkedin, ...) some
 * versions back over trademark concerns, so social links resolve to
 * generic marks instead — which also keeps them consistent with the
 * rest of the icon set (no brand colors/shapes anywhere in the UI).
 */
const registry: Record<string, LucideIcon> = {
  user: User,
  folder: Folder,
  briefcase: Briefcase,
  cpu: Cpu,
  mail: Mail,
  terminal: Terminal,
  "file-text": FileText,
  "app-window": AppWindow,
  github: Code2,
  linkedin: Link,
  file: File,
};

function resolveIcon(id: string): LucideIcon {
  const icon = registry[id];
  if (!icon) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[icons] no icon registered for id "${id}"`);
    }
    return HelpCircle;
  }
  return icon;
}

/**
 * Renders a registered icon by string id. Built with createElement rather
 * than exposing the resolved component for JSX use — the id is only known
 * at runtime, and every call site needs the *same* icon for the same id
 * across renders, which this guarantees without relying on callers to
 * memoize a locally-resolved component reference themselves.
 */
export function renderIcon(id: string, props?: LucideProps): ReactElement {
  return createElement(resolveIcon(id), props);
}
