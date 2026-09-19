import { desktopFileSchema, type DesktopFile } from "./schema";

/**
 * Placeholder desktop icon layout satisfying `desktopFileSchema`,
 * including one nested folder to exercise the recursive shape. Phase 4
 * replaces the values, not the shape.
 */
export const desktopFiles: DesktopFile[] = [
  {
    id: "about-me",
    name: "About Me",
    kind: "app",
    icon: "user",
    appId: "about",
    position: { x: 0, y: 0 },
  },
  {
    id: "projects-folder",
    name: "Projects",
    kind: "folder",
    icon: "folder",
    position: { x: 0, y: 1 },
    children: [
      {
        id: "project-aperture-icon",
        name: "Aperture",
        kind: "app",
        icon: "app-window",
        appId: "projects",
      },
    ],
  },
  {
    id: "experience-icon",
    name: "Experience",
    kind: "app",
    icon: "briefcase",
    appId: "experience",
    position: { x: 0, y: 2 },
  },
  {
    id: "resume-pdf",
    name: "Resume.pdf",
    kind: "app",
    icon: "file-text",
    appId: "resume",
    position: { x: 0, y: 3 },
  },
  {
    id: "contact-icon",
    name: "Say Hello",
    kind: "app",
    icon: "mail",
    appId: "contact",
    position: { x: 0, y: 4 },
  },
];

desktopFiles.forEach((file) => desktopFileSchema.parse(file));
