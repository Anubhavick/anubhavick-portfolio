"use client";

import { experience, socialLinks, stackCategories } from "@/content";
import { AboutContent } from "@/components/content/about-content";
import { ContactContent } from "@/components/content/contact-content";
import { ExperienceContent } from "@/components/content/experience-content";
import { ProjectsWindowContent } from "@/components/content/projects-window-content";
import { StackContent } from "@/components/content/stack-content";
import { HelpApp } from "@/components/help/help-app";
import { SettingsApp } from "@/components/settings/settings-app";
import { Terminal } from "@/components/terminal/terminal";
import type { WindowTarget } from "@/lib/window-store";
import { PlaceholderBody } from "./placeholder-body";

interface WindowBodyProps {
  target: WindowTarget;
}

/**
 * Dispatches a window's body to its real content, and falls back to the
 * placeholder for apps that don't have any yet (Resume). The single place
 * both the desktop Window and the mobile AppSheet render through, so they
 * never drift.
 */
export function WindowBody({ target }: WindowBodyProps) {
  if (target.kind === "app") {
    switch (target.appId) {
      case "terminal":
        return <Terminal />;
      case "settings":
        return <SettingsApp />;
      case "help":
        return <HelpApp />;
      case "about":
        return <AboutContent />;
      case "projects":
        return <ProjectsWindowContent />;
      case "experience":
        return <ExperienceContent entries={experience} />;
      case "stack":
        return <StackContent categories={stackCategories} />;
      case "contact":
        return <ContactContent socials={socialLinks} />;
    }
  }

  return <PlaceholderBody target={target} />;
}
