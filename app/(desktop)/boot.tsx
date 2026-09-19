"use client";

import { useEffect, useRef } from "react";
import { experience, projects, stackCategories } from "@/content";
import { createBootSequenceTimeline } from "@/lib/motion";

const LINES = [
  "mounting /home/anubhav ...",
  `indexing ${projects.length} projects ...`,
  `loading ${experience.length} experience entries ...`,
  `compiling stack.json (${stackCategories.length} categories) ...`,
  "starting desktop shell ... ready",
];

interface BootSequenceProps {
  onComplete: () => void;
}

export function BootSequence({ onComplete }: BootSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<HTMLParagraphElement[]>([]);
  const finishedRef = useRef(false);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const finish = () => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      onComplete();
    };

    if (!containerRef.current || !progressBarRef.current) {
      finish();
      return;
    }

    const tl = createBootSequenceTimeline({
      container: containerRef.current,
      progressBarEl: progressBarRef.current,
      lineEls: lineRefs.current,
    });
    timelineRef.current = tl;
    tl.eventCallback("onComplete", finish);
    tl.play();

    const skip = () => {
      timelineRef.current?.progress(1, true);
      finish();
    };

    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);

    return () => {
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-10 bg-surface-1"
      role="status"
      aria-live="polite"
      aria-label="Starting up"
    >
      <p className="font-display text-3xl text-ink">AM</p>

      <div className="h-px w-64 overflow-hidden rounded-control bg-hairline">
        <div
          ref={progressBarRef}
          className="h-full w-full origin-left bg-accent"
        />
      </div>

      <div className="flex flex-col items-start gap-1.5 font-mono text-xs text-ink-muted">
        {LINES.map((line, i) => (
          <p
            key={line}
            ref={(el) => {
              if (el) lineRefs.current[i] = el;
            }}
          >
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}
