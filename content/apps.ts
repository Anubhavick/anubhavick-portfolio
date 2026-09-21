import { appDefinitionSchema, type AppDefinition } from "./schema";

/**
 * Window apps launchable from the desktop and dock, satisfying
 * `appDefinitionSchema`. Sizes are placeholder-reasonable defaults; Phase
 * 4 replaces copy, not shape.
 */
export const appDefinitions: AppDefinition[] = [
  {
    id: "about",
    name: "About Me",
    icon: "user",
    description: "Who I am, in one window.",
    defaultSize: { width: 560, height: 420 },
    minSize: { width: 360, height: 280 },
    resizable: true,
    singleton: true,
  },
  {
    id: "projects",
    name: "Projects",
    icon: "folder",
    description: "Shipped work and side projects.",
    defaultSize: { width: 720, height: 520 },
    minSize: { width: 480, height: 360 },
    resizable: true,
    singleton: true,
  },
  {
    id: "experience",
    name: "Experience",
    icon: "briefcase",
    description: "Where I've worked and what I did there.",
    defaultSize: { width: 640, height: 480 },
    minSize: { width: 420, height: 320 },
    resizable: true,
    singleton: true,
  },
  {
    id: "stack",
    name: "Stack",
    icon: "cpu",
    description: "Languages, frameworks, and tools.",
    defaultSize: { width: 560, height: 440 },
    minSize: { width: 380, height: 300 },
    resizable: true,
    singleton: true,
  },
  {
    id: "contact",
    name: "Contact",
    icon: "mail",
    description: "Get in touch.",
    defaultSize: { width: 480, height: 360 },
    minSize: { width: 360, height: 280 },
    resizable: false,
    singleton: true,
  },
  {
    id: "terminal",
    name: "Terminal",
    icon: "terminal",
    description: "A little easter egg for the curious.",
    defaultSize: { width: 620, height: 400 },
    minSize: { width: 400, height: 260 },
    resizable: true,
    singleton: true,
  },
  {
    id: "resume",
    name: "Resume.pdf",
    icon: "file-text",
    description: "The one-page version.",
    defaultSize: { width: 600, height: 760 },
    minSize: { width: 420, height: 520 },
    resizable: true,
    singleton: true,
  },
  {
    id: "settings",
    name: "Settings",
    icon: "settings",
    description: "Appearance, motion, and desktop preferences.",
    defaultSize: { width: 520, height: 480 },
    minSize: { width: 420, height: 420 },
    resizable: true,
    singleton: true,
  },
  {
    id: "help",
    name: "Help",
    icon: "help-circle",
    description: "The dock, shortcuts, terminal commands, and search syntax.",
    defaultSize: { width: 580, height: 540 },
    minSize: { width: 440, height: 380 },
    resizable: true,
    singleton: true,
  },
];

appDefinitions.forEach((app) => appDefinitionSchema.parse(app));
