import { desktopFileSchema, type DesktopFile } from "./schema";

/**
 * Real desktop icon layout. The Projects and Elsewhere folders are
 * shortcuts (kind "link") out to real, live URLs — `desktopFileSchema`
 * requires an absolute URL for a link, so these point at the live sites /
 * repos directly rather than at internal routes.
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
        id: "project-thebroadpost-icon",
        name: "The Broadpost",
        kind: "link",
        icon: "app-window",
        href: "https://thebroadpost.com",
      },
      {
        id: "project-altyard-icon",
        name: "Altyard",
        kind: "link",
        icon: "app-window",
        href: "https://altyard.vercel.app",
      },
      {
        id: "project-healthy-me-icon",
        name: "Healthy-Me",
        kind: "link",
        icon: "app-window",
        href: "https://healthy-me-psi.vercel.app",
      },
      {
        id: "project-meta-tales-icon",
        name: "Meta Tales",
        kind: "link",
        icon: "github",
        href: "https://github.com/Anubhavick/Meta-Tales",
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
    id: "stack-icon",
    name: "Stack",
    kind: "app",
    icon: "cpu",
    appId: "stack",
    position: { x: 0, y: 3 },
  },
  {
    id: "resume-pdf",
    name: "Resume.pdf",
    kind: "app",
    icon: "file-text",
    appId: "resume",
    position: { x: 0, y: 4 },
  },
  {
    id: "contact-icon",
    name: "Say Hello",
    kind: "app",
    icon: "mail",
    appId: "contact",
    position: { x: 0, y: 5 },
  },
  {
    id: "elsewhere-folder",
    name: "Elsewhere",
    kind: "folder",
    icon: "folder",
    position: { x: 0, y: 6 },
    children: [
      {
        id: "elsewhere-github",
        name: "GitHub",
        kind: "link",
        icon: "github",
        href: "https://github.com/Anubhavick",
      },
      {
        id: "elsewhere-linkedin",
        name: "LinkedIn",
        kind: "link",
        icon: "linkedin",
        href: "https://www.linkedin.com/in/anubhav-ick/",
      },
      {
        id: "elsewhere-twitter",
        name: "X (Twitter)",
        kind: "link",
        icon: "twitter",
        href: "https://x.com/Anubhavick",
      },
      {
        id: "elsewhere-peerlist",
        name: "Peerlist",
        kind: "link",
        icon: "peerlist",
        href: "https://peerlist.io/anubhavickk",
      },
      {
        id: "elsewhere-leetcode",
        name: "LeetCode",
        kind: "link",
        icon: "leetcode",
        href: "https://leetcode.com/u/anubhavick/",
      },
    ],
  },
];

desktopFiles.forEach((file) => desktopFileSchema.parse(file));
