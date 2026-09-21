import type { Metadata } from "next";
import Link from "next/link";
import { HelpApp } from "@/components/help/help-app";
import { SITE_NAME } from "@/lib/site";

const TITLE = "Help";
const DESCRIPTION =
  "How to use this portfolio: dock behavior, keyboard shortcuts, search syntax, and every terminal command.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/help" },
  openGraph: {
    title: `${TITLE} — ${SITE_NAME}`,
    description: DESCRIPTION,
    url: "/help",
    images: [`/og?title=${encodeURIComponent(TITLE)}&kind=${encodeURIComponent(SITE_NAME)}`],
  },
  twitter: { title: `${TITLE} — ${SITE_NAME}`, description: DESCRIPTION },
};

export default function HelpPage() {
  return (
    <main className="mx-auto max-w-[68ch] px-6 py-12">
      <Link href="/" className="text-sm text-ink-muted underline-offset-4 hover:text-accent hover:underline">
        ← {SITE_NAME}
      </Link>
      <header className="mt-6 flex flex-col gap-1.5">
        <h1 className="text-2xl text-ink">Help</h1>
        <p className="max-w-[60ch] text-sm text-ink-muted">{DESCRIPTION}</p>
      </header>
      <div className="mt-4">
        <HelpApp />
      </div>
    </main>
  );
}
