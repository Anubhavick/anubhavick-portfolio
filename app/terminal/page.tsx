import type { Metadata } from "next";
import Link from "next/link";
import { commandList } from "@/lib/terminal/commands";
import { TerminalReference } from "@/components/content/terminal-reference";
import { SITE_NAME } from "@/lib/site";

const TITLE = "Terminal";
const DESCRIPTION = `A working terminal built into this portfolio, with ${commandList.length} commands (${commandList
  .map((c) => c.name)
  .join(", ")}) over a small virtual filesystem.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/terminal" },
  openGraph: {
    title: `${TITLE} — ${SITE_NAME}`,
    description: DESCRIPTION,
    url: "/terminal",
    images: [`/og?title=${encodeURIComponent(TITLE)}&kind=${encodeURIComponent(SITE_NAME)}`],
  },
  twitter: { title: `${TITLE} — ${SITE_NAME}`, description: DESCRIPTION },
};

export default function TerminalPage() {
  return (
    <main className="mx-auto max-w-[68ch] px-6 py-12">
      <Link href="/" className="text-sm text-ink-muted underline-offset-4 hover:text-accent hover:underline">
        ← {SITE_NAME}
      </Link>
      <header className="mt-6 flex flex-col gap-1.5">
        <h1 className="text-2xl text-ink">Terminal</h1>
        <p className="max-w-[60ch] text-sm text-ink-muted">{DESCRIPTION}</p>
      </header>
      <div className="mt-4">
        <TerminalReference />
      </div>
    </main>
  );
}
