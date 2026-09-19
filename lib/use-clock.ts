"use client";

import { useEffect, useState } from "react";

const formatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Kolkata",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

/**
 * IST clock, safe to render on the server: starts null so the server and
 * first client render match, then hydrates a real value in an effect. Never
 * read `new Date()` during render — that's how you get a hydration
 * mismatch warning.
 */
export function useISTClock(): string | null {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setTime(`${formatter.format(new Date())} IST`);
    tick();
    const id = window.setInterval(tick, 15_000);
    return () => window.clearInterval(id);
  }, []);

  return time;
}
