import { z } from "zod";

/**
 * Content schemas for the portfolio. These are the contract between the
 * placeholder data written now and the real content Phase 4 drops in —
 * Phase 4 replaces values, not shapes. Every file in content/*.ts other
 * than this one exports data validated against a schema defined here.
 */

// ---------------------------------------------------------------------------
// Shared building blocks
// ---------------------------------------------------------------------------

export const sizeSchema = z.object({
  width: z.number().positive(),
  height: z.number().positive(),
});
export type Size = z.infer<typeof sizeSchema>;

export const gridPositionSchema = z.object({
  x: z.number().int().nonnegative(),
  y: z.number().int().nonnegative(),
});
export type GridPosition = z.infer<typeof gridPositionSchema>;

// ---------------------------------------------------------------------------
// AppDefinition — a launchable window app (About, Projects, Terminal, ...)
// ---------------------------------------------------------------------------

export const appIdSchema = z.enum([
  "about",
  "projects",
  "experience",
  "stack",
  "contact",
  "terminal",
  "resume",
]);
export type AppId = z.infer<typeof appIdSchema>;

export const appDefinitionSchema = z.object({
  id: appIdSchema,
  name: z.string().min(1),
  /** Icon identifier resolved by the icon set in a later phase. */
  icon: z.string().min(1),
  description: z.string().optional(),
  defaultSize: sizeSchema,
  minSize: sizeSchema.optional(),
  resizable: z.boolean().default(true),
  /** Only one open instance of this app at a time. */
  singleton: z.boolean().default(true),
});
export type AppDefinition = z.infer<typeof appDefinitionSchema>;

// ---------------------------------------------------------------------------
// DesktopFile — recursive desktop icon / file-system entry
// ---------------------------------------------------------------------------

export const desktopFileKindSchema = z.enum(["file", "folder", "app", "link"]);
export type DesktopFileKind = z.infer<typeof desktopFileKindSchema>;

export interface DesktopFile {
  id: string;
  name: string;
  kind: DesktopFileKind;
  /** Icon identifier resolved by the icon set in a later phase. */
  icon: string;
  /** Desktop grid cell this icon sits in, if placed directly on the desktop. */
  position?: GridPosition;
  /** Required when kind is "app": which window this icon launches. */
  appId?: AppId;
  /** Required when kind is "link": external URL this icon opens. */
  href?: string;
  /** Required when kind is "folder": the files it contains. */
  children?: DesktopFile[];
}

export const desktopFileSchema: z.ZodType<DesktopFile> = z.lazy(() =>
  z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    kind: desktopFileKindSchema,
    icon: z.string().min(1),
    position: gridPositionSchema.optional(),
    appId: appIdSchema.optional(),
    href: z.string().url().optional(),
    children: z.array(desktopFileSchema).optional(),
  }),
);

// ---------------------------------------------------------------------------
// Project
// ---------------------------------------------------------------------------

export const projectLinkKindSchema = z.enum([
  "live",
  "repo",
  "case-study",
  "demo",
  "other",
]);
export type ProjectLinkKind = z.infer<typeof projectLinkKindSchema>;

export const projectLinkSchema = z.object({
  label: z.string().min(1),
  url: z.string().url(),
  kind: projectLinkKindSchema,
});
export type ProjectLink = z.infer<typeof projectLinkSchema>;

export const projectStatusSchema = z.enum([
  "shipped",
  "in-progress",
  "archived",
]);
export type ProjectStatus = z.infer<typeof projectStatusSchema>;

export const projectSchema = z.object({
  id: z.string().min(1),
  /** URL-safe identifier, e.g. for /projects/[slug]. */
  slug: z.string().min(1),
  title: z.string().min(1),
  /** One sentence, used in list/card views. */
  summary: z.string().min(1),
  /** Longer prose, used in the project's own window. */
  description: z.string().min(1),
  role: z.string().min(1),
  year: z.number().int().min(2000).max(2100),
  status: projectStatusSchema,
  featured: z.boolean().default(false),
  stack: z.array(z.string().min(1)).min(1),
  links: z.array(projectLinkSchema).default([]),
  coverImage: z.string().optional(),
});
export type Project = z.infer<typeof projectSchema>;

// ---------------------------------------------------------------------------
// ExperienceEntry
// ---------------------------------------------------------------------------

export const experienceEntrySchema = z.object({
  id: z.string().min(1),
  organization: z.string().min(1),
  role: z.string().min(1),
  location: z.string().optional(),
  /** ISO "YYYY-MM". */
  startDate: z.string().regex(/^\d{4}-\d{2}$/),
  /** ISO "YYYY-MM"; omitted means "present". */
  endDate: z.string().regex(/^\d{4}-\d{2}$/).optional(),
  summary: z.string().min(1),
  highlights: z.array(z.string().min(1)).default([]),
  stack: z.array(z.string().min(1)).default([]),
});
export type ExperienceEntry = z.infer<typeof experienceEntrySchema>;

// ---------------------------------------------------------------------------
// StackCategory
// ---------------------------------------------------------------------------

export const stackItemSchema = z.object({
  name: z.string().min(1),
  /** Icon identifier resolved by the icon set in a later phase. */
  icon: z.string().optional(),
});
export type StackItem = z.infer<typeof stackItemSchema>;

export const stackCategorySchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  /** Exactly three letters, set in Archivo Display on the stack card. */
  monogram: z.string().length(3),
  items: z.array(stackItemSchema).min(1),
});
export type StackCategory = z.infer<typeof stackCategorySchema>;

// ---------------------------------------------------------------------------
// SocialLink
// ---------------------------------------------------------------------------

export const socialLinkSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  url: z.string().url(),
  /** Icon identifier resolved by the icon set in a later phase. */
  icon: z.string().min(1),
  /** Displayed handle, e.g. "@anubhavick" — omit for channels without one. */
  handle: z.string().optional(),
});
export type SocialLink = z.infer<typeof socialLinkSchema>;
