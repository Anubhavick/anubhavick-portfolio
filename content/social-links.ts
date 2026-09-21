import { socialLinkSchema, type SocialLink } from "./schema";

/**
 * Real social/profile links. Order is the order they render in the
 * Contact window, the /contact route, and the footer of README.md.
 */
export const socialLinks: SocialLink[] = [
  {
    id: "github",
    label: "GitHub",
    url: "https://github.com/Anubhavick",
    icon: "github",
    handle: "@Anubhavick",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    url: "https://www.linkedin.com/in/anubhav-ick/",
    icon: "linkedin",
    handle: "anubhav-ick",
  },
  {
    id: "twitter",
    label: "X (Twitter)",
    url: "https://x.com/Anubhavick",
    icon: "twitter",
    handle: "@Anubhavick",
  },
  {
    id: "peerlist",
    label: "Peerlist",
    url: "https://peerlist.io/anubhavickk",
    icon: "peerlist",
    handle: "anubhavickk",
  },
  {
    id: "leetcode",
    label: "LeetCode",
    url: "https://leetcode.com/u/anubhavick/",
    icon: "leetcode",
    handle: "anubhavick",
  },
  {
    id: "email",
    label: "Email",
    url: "mailto:anubhav.ickk@gmail.com",
    icon: "mail",
    handle: "anubhav.ickk@gmail.com",
  },
];

socialLinks.forEach((link) => socialLinkSchema.parse(link));
