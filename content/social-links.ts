import { socialLinkSchema, type SocialLink } from "./schema";

/**
 * Placeholder social links satisfying `socialLinkSchema`. Phase 4 replaces
 * the values, not the shape.
 */
export const socialLinks: SocialLink[] = [
  {
    id: "github",
    label: "GitHub",
    url: "https://github.com/placeholder-user",
    icon: "github",
    handle: "@placeholder-user",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    url: "https://linkedin.com/in/placeholder-user",
    icon: "linkedin",
  },
  {
    id: "email",
    label: "Email",
    url: "mailto:hello@example.com",
    icon: "mail",
    handle: "hello@example.com",
  },
];

socialLinks.forEach((link) => socialLinkSchema.parse(link));
