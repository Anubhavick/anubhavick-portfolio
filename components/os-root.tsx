"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { BootSequence } from "@/app/(desktop)/boot";
import { DesktopShell } from "./desktop/desktop-shell";
import { MobileShell } from "./mobile/mobile-shell";
import { SettingsSync } from "./settings-sync";

const BOOT_FLAG = "os-booted";

/**
 * Gates the boot sequence: once per session, only on "/" (never on a
 * direct deep link to a content route), skippable, and then mounts the
 * real shells.
 */
export function OsRoot() {
  const pathname = usePathname();
  const [bootDone, setBootDone] = useState<boolean | null>(null);
  const processedPathnameRef = useRef<string | null>(null);

  // sessionStorage doesn't exist during SSR, so this has to resolve
  // client-side after mount — same hydration-safe shape as the clock.
  //
  // The processedPathnameRef guard matters beyond StrictMode hygiene: this
  // effect both reads and writes BOOT_FLAG, so a second invocation for the
  // same pathname would read back its own write and skip boot every time.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (processedPathnameRef.current === pathname) return;
    processedPathnameRef.current = pathname;

    if (pathname !== "/") {
      setBootDone(true);
      return;
    }
    if (sessionStorage.getItem(BOOT_FLAG) === "1") {
      setBootDone(true);
      return;
    }
    sessionStorage.setItem(BOOT_FLAG, "1");
    setBootDone(false);
  }, [pathname]);
  /* eslint-enable react-hooks/set-state-in-effect */

  return (
    <>
      <SettingsSync />
      {bootDone === true && (
        <>
          <DesktopShell />
          <MobileShell />
        </>
      )}
      {bootDone === false && <BootSequence onComplete={() => setBootDone(true)} />}
    </>
  );
}
