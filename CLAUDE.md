# anubhavick — portfolio

A desktop-operating-system metaphor in the browser for Anubhav Mishra's
portfolio: boot sequence, menu bar, desktop with files/folders, dock, and
draggable/resizable windows. wesdieleman.com is a reference for
**interaction only** — never copy its visuals.

This file is the contract for how the project is built. Read it before
adding a component, a token, or a dependency.

## Decision table

| Decision | Choice | Why |
|---|---|---|
| Framework | Next.js 16, App Router, TS strict | Latest stable, typed routes (`LayoutProps<"/">`) |
| UI runtime | React 19 | Ships with Next.js 16 |
| Styling | Tailwind CSS 4, CSS-first `@theme` | No `tailwind.config.js`; tokens live in `app/globals.css` |
| Motion | GSAP 3, one factory module | `lib/motion.ts` is the only place durations/eases are chosen |
| Interaction (drag/resize/snap) | Hand-written pointer events | Not GSAP's job — GSAP is presentation, not input handling |
| State (window manager) | Zustand | Small, no boilerplate, plays well with imperative GSAP calls |
| Content | Zod schemas + typed data modules | `content/schema.ts` is the single source of truth for shapes |
| Mono font | JetBrains Mono today, Commit Mono later | Commit Mono isn't on Google Fonts; see [Typography](#typography) |
| Deploy | Vercel | — |

## Stack

- **Next.js 16** (App Router, Turbopack dev/build), **TypeScript strict**
  (`tsconfig.json` has `"strict": true`).
- **React 19**.
- **Tailwind CSS 4**, CSS-first config. There is no `tailwind.config.js` —
  all tokens are declared in `app/globals.css` under `@theme` /
  `@theme inline`. `postcss.config.mjs` just wires in `@tailwindcss/postcss`.
- **GSAP 3** for the motion layer only. **Zustand** for window-manager
  state (not created yet — first needed in the phase that builds the
  window manager). **Zod 4** for content validation.
- Deployed on **Vercel**.

Run `npm run dev` for the dev server, `npm run build` for a production
build, `npx tsc --noEmit` for type-checking, `npx eslint .` for linting.

## No hardcoded colors

**No hex/rgb value appears in any component.** Every color a component
uses must resolve through a `--color-*` token via a Tailwind utility
(`bg-surface-0`, `text-ink-muted`, `border-hairline`, `text-accent`, …) or
`var(--color-*)` in a case Tailwind can't express. `app/globals.css` is
the *only* file allowed to contain literal color hex values. If a
component needs a color the token set doesn't have, add the token to
`app/globals.css` first — don't inline it.

The same rule applies to radii and shadows: use `rounded-window` /
`rounded-control` / `rounded-dock` and `shadow-window`, not arbitrary
values.

## Design tokens

All defined in `app/globals.css`, nowhere else.

### Theme and accent switching

Both are driven by attributes on `<html>`, written by a Settings store in
a later phase:

- `data-theme="light" | "dark"` — absent means "follow
  `prefers-color-scheme`". `app/layout.tsx` does not set this attribute by
  default so system preference wins until a user picks explicitly.
- `data-accent="powder" | "system" | "ocean" | "midnight"` — absent means
  `system`. `app/layout.tsx` currently sets `data-accent="system"`
  explicitly as the static default; a Settings store will make this
  dynamic and persist the choice.

A `@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *))`
is registered so `dark:` utilities are available if a component needs a
*structural* (not color) difference between themes. Colors almost never
need `dark:` — because tokens are CSS variables redefined per
`[data-theme]`/`prefers-color-scheme`, a plain `bg-surface-0` already
adapts automatically.

### Color tokens

Base (redefined under `:root[data-theme="dark"]` and, absent an explicit
`data-theme`, under `@media (prefers-color-scheme: dark)`):

| Token | Light | Dark | Use |
|---|---|---|---|
| `--color-surface-0` | `#FBFCFD` | `#0E1822` | window bodies |
| `--color-surface-1` | `#F1F5F8` | `#131F2B` | panels, sidebars |
| `--color-surface-2` | `#E2EAF0` | `#1B2A38` | insets, wells |
| `--color-ink` | `#0C1418` | `#E8F0F6` | primary text |
| `--color-ink-muted` | `#5A6B78` | `#8CA3B5` | secondary text |
| `--color-hairline` | `#CBD8E2` | `#26384A` | 1px borders, window chrome |

Accent (three-step ramp, redefined per `[data-accent]`; `system` is the
`@theme` default):

| Accent | soft | base | strong |
|---|---|---|---|
| `powder` | `#A8C8DC` | `#7FAECB` | `#5B93B5` |
| `system` | `#4DA2FF` | `#0A84FF` | `#0062CC` |
| `ocean` | `#3FB8C8` | `#0E9AAC` | `#077C8C` |
| `midnight` | `#5C6FD8` | `#3B4FC4` | `#2A3AA0` |

Used as `bg-accent-soft` / `bg-accent` / `bg-accent-strong` (and the
`text-*` / `border-*` equivalents).

**Desktop wallpaper** (not yet built): a soft vertical gradient from
`var(--color-accent-soft)` into `var(--color-surface-1)`, plus a faint
grain overlay. No photo. Build it in the component that needs it —
compose it from the existing tokens rather than adding a new hardcoded
gradient token.

### Type scale

`--text-xs/sm/base/lg/xl/2xl/3xl/4xl` map to 12 / 13 / 15 / 17 / 21 / 28 /
44 / 72px, overriding Tailwind's defaults for exactly those eight keys
(`5xl`+ are untouched Tailwind defaults and unused by this design — don't
reach for them). Body prose is capped at `max-w-[68ch]`.

### Shape

- `--radius-control: 6px` → `rounded-control` (inner controls)
- `--radius-window: 10px` → `rounded-window` (windows)
- `--radius-dock: 16px` → `rounded-dock` (dock)
- `--shadow-window` → `shadow-window`: a **two-layer** shadow (a tight 1px
  ambient ring + a wide soft drop), redefined per theme. Never collapse
  this to a single `rgba(0,0,0,.1)` blur — that's explicitly the thing
  being avoided.
- Hairlines are real 1px borders (`border-hairline`), never `box-shadow`
  standing in for a border.
- Window chrome: filename in mono on the left of the title bar,
  traffic-light controls on the **right** — deliberately inverted from
  macOS.

## Typography

Three font roles, loaded via `next/font/google` in `app/layout.tsx`, never
`next/font` per-component:

- **UI + body** — Geist Sans (`--font-sans`). Window chrome, menus, prose.
- **Mono** — spec calls for **Commit Mono**, fallback **JetBrains Mono**.
  Commit Mono is not on Google Fonts, so **JetBrains Mono is what's
  actually loaded today** (`JetBrains_Mono` from `next/font/google`, CSS
  var `--font-jetbrains-mono`), and `--font-mono` in `app/globals.css`
  points at it. To switch to Commit Mono: vendor its `.woff2` files,
  declare it with `next/font/local`, and repoint the one line in
  `app/globals.css`'s `@theme inline` block — no component changes
  needed. Used for terminal, filenames, the menu-bar clock, window status
  lines, code.
- **Display** — Archivo Variable (`--font-display`), loaded with
  `axes: ["wdth"]` so the width axis is available. Use the `.font-display`
  utility class (weight 800, `font-variation-settings: "wdth" 125`) —
  **only** for the boot logo and the three-letter stack-card monograms.
  Never for body or UI text.

## Motion rules

`lib/motion.ts` is the **only** place GSAP timelines are constructed.
Components call a factory (`createWindowOpenTimeline`,
`createWindowCloseTimeline`, `createWindowMinimizeTimeline`,
`createDockMagnifyTimeline`, `createBootSequenceTimeline`) — they never
call `gsap.timeline()` or `gsap.to()` directly, and never choose their own
duration or ease.

- `EASE` and `DURATION` are the shared constants; add to them instead of
  inlining a number in a component.
- Windows open with a **scale-from-origin** grow out of the dock/desktop
  icon that launched them — never a centered fade.
- `prefersReducedMotion()` must be consulted inside every factory. The
  factories currently in the codebase are typed stubs (return an empty,
  paused `gsap.timeline()`) — when a phase implements the real tween, it
  must branch on `prefersReducedMotion()` and use `.set()` (instant) in
  that case, `.to()`/`.fromTo()` otherwise. This is a functional
  requirement, not a nice-to-have: reduced motion must produce instant
  state changes, not shorter animations.
- **Interaction — dragging, resizing, snapping — is hand-written with
  pointer events**, not GSAP. GSAP is presentation only.

## Content schema contract

`content/schema.ts` defines every content shape as a Zod schema plus its
inferred TS type. It is the only file allowed to define these shapes —
everything else imports from it.

| Schema | Represents |
|---|---|
| `projectSchema` → `Project` | A portfolio project |
| `experienceEntrySchema` → `ExperienceEntry` | A work/internship entry |
| `stackCategorySchema` → `StackCategory` | A grouped set of tools/languages, with a 3-letter Archivo monogram |
| `appDefinitionSchema` → `AppDefinition` | A launchable window app (About, Projects, Terminal, …) |
| `desktopFileSchema` → `DesktopFile` | A desktop icon / file-system entry — recursive (`children`) to allow folders |
| `socialLinkSchema` → `SocialLink` | An external link (GitHub, LinkedIn, email, …) |

`content/*.ts` (`projects.ts`, `experience.ts`, `stack.ts`, `apps.ts`,
`desktop-files.ts`, `social-links.ts`) each export an array validated
against its schema at module load time (`schema.parse(...)` per entry) —
if placeholder or real data ever drifts from the shape, it fails loudly
at build/dev time instead of silently rendering wrong. `content/index.ts`
re-exports everything.

Current data is **placeholder**: 3 fake projects, 2 fake experience
entries, 4 stack categories, plus placeholder app/desktop-file/social-link
data. Phase 4 replaces the *values* — titles, copy, URLs — not the
*shapes*. Don't change a schema to fit a Phase 4 content need without
checking every `content/*.ts` file still validates.

## What's deliberately not built yet

Per the foundation scope, these exist as dependencies/infrastructure only
— don't be surprised they're not wired up:

- No window-manager Zustand store yet (Zustand is installed; the store is
  first-needed when the window manager is built).
- No boot sequence, menu bar, desktop, dock, or window chrome components.
- No icon set — `icon` fields in content are string identifiers to be
  resolved once an icon system is chosen.
- `app/page.tsx` is a placeholder smoke-test, not the real desktop.
- GSAP timeline factories in `lib/motion.ts` are typed stubs with no
  tweens yet (see [Motion rules](#motion-rules)).
