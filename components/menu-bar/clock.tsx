"use client";

import { useISTClock } from "@/lib/use-clock";

export function Clock() {
  const time = useISTClock();
  return (
    <span className="font-mono text-xs tabular-nums text-ink-muted">
      {time ?? "--:-- IST"}
    </span>
  );
}
