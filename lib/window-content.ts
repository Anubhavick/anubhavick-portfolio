import {
  appDefinitions,
  desktopFiles,
  type AppDefinition,
  type DesktopFile,
} from "@/content";
import type { WindowTarget } from "./window-store";

function findFileById(files: DesktopFile[], id: string): DesktopFile | null {
  for (const file of files) {
    if (file.id === id) return file;
    if (file.children) {
      const found = findFileById(file.children, id);
      if (found) return found;
    }
  }
  return null;
}

export interface WindowMeta {
  title: string;
  icon: string;
  defaultSize: { width: number; height: number };
  minSize: { width: number; height: number };
  resizable: boolean;
  app?: AppDefinition;
  folder?: DesktopFile;
}

const FOLDER_SIZE = { width: 520, height: 400 };
const FOLDER_MIN_SIZE = { width: 360, height: 280 };

export function resolveWindowMeta(target: WindowTarget): WindowMeta | null {
  if (target.kind === "app") {
    const app = appDefinitions.find((a) => a.id === target.appId);
    if (!app) return null;
    return {
      title: app.name,
      icon: app.icon,
      defaultSize: app.defaultSize,
      minSize: app.minSize ?? { width: 320, height: 240 },
      resizable: app.resizable,
      app,
    };
  }

  const folder = findFileById(desktopFiles, target.fileId);
  if (!folder) return null;
  return {
    title: folder.name,
    icon: folder.icon,
    defaultSize: FOLDER_SIZE,
    minSize: FOLDER_MIN_SIZE,
    resizable: true,
    folder,
  };
}
