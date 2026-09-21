import gsap from "gsap";
import { useSettingsStore } from "./settings-store";

/**
 * The motion layer. Every animation in the app — window open/close/
 * minimise, the boot sequence, dock magnification — is built by a factory
 * in this file so duration and easing stay in one place instead of being
 * scattered as inline numbers through components.
 *
 * Interaction (drag, resize, snap) is hand-written with pointer events
 * elsewhere and does not go through GSAP or this file.
 */

export const EASE = {
  /** Default for most UI transitions. */
  standard: "power2.out",
  /** Entrances: fast start, gentle settle. */
  decelerate: "power3.out",
  /** Exits: gentle start, fast finish. */
  accelerate: "power2.in",
  /** Playful overshoot, used sparingly (e.g. dock magnification). */
  spring: "back.out(1.7)",
} as const;

export const DURATION = {
  fast: 0.18,
  base: 0.32,
  slow: 0.52,
} as const;

/**
 * True when the user has requested reduced motion. Every factory below
 * must consult this and swap tweens for an instant `.set()` so the app
 * degrades to immediate state changes, not shorter animations.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  const override = useSettingsStore.getState().reducedMotion;
  if (override === "on") return true;
  if (override === "off") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export interface Point {
  x: number;
  y: number;
}

export interface Rect extends Point {
  width: number;
  height: number;
}

export interface WindowTransitionParams {
  /** The window's root element. */
  windowEl: HTMLElement;
  /** The dock or desktop icon rect the window grows from / shrinks to. */
  origin: Rect;
}

export interface DockMagnifyParams {
  /** The dock icon element being scaled. */
  iconEl: HTMLElement;
  /** Target scale for the icon at peak magnification. */
  scale: number;
}

export interface BootSequenceParams {
  /** The panel that scales down and dissolves at the end of boot. */
  container: HTMLElement;
  /** The determinate progress bar fill element (scaleX 0 -> 1). */
  progressBarEl: HTMLElement;
  /** Status lines, printed in sequence. */
  lineEls: HTMLElement[];
  /** Total time from first line to fully-filled bar, in seconds. */
  fillDuration?: number;
}

/**
 * Builds the "grow from / shrink to a rect" tween shared by open, close,
 * and minimize — the only difference between them is direction and which
 * rect they target.
 */
function scaleFromRect(
  windowEl: HTMLElement,
  origin: Rect,
  direction: "in" | "out",
  ease: string,
): gsap.core.Timeline {
  const tl = gsap.timeline({ paused: true, defaults: { ease } });

  if (prefersReducedMotion()) {
    if (direction === "in") {
      tl.set(windowEl, { x: 0, y: 0, scaleX: 1, scaleY: 1, opacity: 1 });
    } else {
      tl.set(windowEl, { opacity: 0 });
    }
    return tl;
  }

  const finalRect = windowEl.getBoundingClientRect();
  const dx = origin.x + origin.width / 2 - (finalRect.x + finalRect.width / 2);
  const dy = origin.y + origin.height / 2 - (finalRect.y + finalRect.height / 2);
  const scaleX = Math.max(origin.width / finalRect.width, 0.05);
  const scaleY = Math.max(origin.height / finalRect.height, 0.05);

  if (direction === "in") {
    tl.set(windowEl, {
      x: dx,
      y: dy,
      scaleX,
      scaleY,
      opacity: 0.4,
      transformOrigin: "center center",
    }).to(windowEl, {
      x: 0,
      y: 0,
      scaleX: 1,
      scaleY: 1,
      opacity: 1,
      duration: DURATION.base,
    });
  } else {
    tl.set(windowEl, { transformOrigin: "center center" }).to(windowEl, {
      x: dx,
      y: dy,
      scaleX,
      scaleY,
      opacity: 0,
      duration: DURATION.fast,
    });
  }

  return tl;
}

/**
 * Window growing out of the dock/desktop icon that launched it — a
 * scale-from-origin entrance, never a centred fade.
 */
export function createWindowOpenTimeline({
  windowEl,
  origin,
}: WindowTransitionParams): gsap.core.Timeline {
  return scaleFromRect(windowEl, origin, "in", EASE.decelerate);
}

/**
 * Window shrinking back into the icon that launched it.
 */
export function createWindowCloseTimeline({
  windowEl,
  origin,
}: WindowTransitionParams): gsap.core.Timeline {
  return scaleFromRect(windowEl, origin, "out", EASE.accelerate);
}

/**
 * Window collapsing into its dock icon.
 */
export function createWindowMinimizeTimeline({
  windowEl,
  origin,
}: WindowTransitionParams): gsap.core.Timeline {
  return scaleFromRect(windowEl, origin, "out", EASE.accelerate);
}

/**
 * Per-icon dock magnification on pointer proximity.
 */
export function createDockMagnifyTimeline({
  iconEl,
  scale,
}: DockMagnifyParams): gsap.core.Timeline {
  const tl = gsap.timeline({ paused: true, defaults: { ease: EASE.spring } });

  if (prefersReducedMotion()) {
    tl.set(iconEl, { scale: 1 });
    return tl;
  }

  tl.to(iconEl, { scale, duration: DURATION.fast });
  return tl;
}

/**
 * The boot sequence played once on first load: a determinate progress bar
 * fill, status lines printing in sequence alongside it, then the whole
 * panel scaling down and dissolving into the desktop.
 */
export function createBootSequenceTimeline({
  container,
  progressBarEl,
  lineEls,
  fillDuration = 1.1,
}: BootSequenceParams): gsap.core.Timeline {
  const tl = gsap.timeline({ paused: true, defaults: { ease: EASE.standard } });

  if (prefersReducedMotion()) {
    tl.set(progressBarEl, { scaleX: 1 })
      .set(lineEls, { opacity: 1, y: 0 })
      .set(container, { opacity: 0, scale: 0.92 });
    return tl;
  }

  tl.set(progressBarEl, { scaleX: 0, transformOrigin: "left center" }).set(
    lineEls,
    { opacity: 0, y: 4 },
  );

  tl.to(
    progressBarEl,
    { scaleX: 1, duration: fillDuration, ease: "none" },
    0,
  );

  if (lineEls.length > 0) {
    tl.to(
      lineEls,
      {
        opacity: 1,
        y: 0,
        duration: DURATION.fast,
        stagger: fillDuration / lineEls.length,
      },
      0,
    );
  }

  tl.to(
    container,
    { scale: 0.92, opacity: 0, duration: DURATION.base, ease: EASE.accelerate },
    `+=0.15`,
  );

  return tl;
}
