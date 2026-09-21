import type { Metadata } from "next";
import Link from "next/link";
import { stackCategories } from "@/content";
import { StackContent } from "@/components/content/stack-content";
import { SITE_NAME } from "@/lib/site";

const TITLE = "Stack";
const DESCRIPTION =
  "Languages, frameworks, databases, and tools Anubhav Mishra works with day to day, from TypeScript and Next.js to FastAPI, Docker, and AI/ML tooling.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/stack" },
  openGraph: {
    title: `${TITLE} — ${SITE_NAME}`,
    description: DESCRIPTION,
    url: "/stack",
    images: [`/og?title=${encodeURIComponent(TITLE)}&kind=${encodeURIComponent(SITE_NAME)}`],
  },
  twitter: { title: `${TITLE} — ${SITE_NAME}`, description: DESCRIPTION },
};

export default function StackPage() {
  return (
    <main className="mx-auto max-w-[68ch] px-6 py-12">
      <Link href="/" className="text-sm text-ink-muted underline-offset-4 hover:text-accent hover:underline">
        ← {SITE_NAME}
      </Link>
      <header className="mt-6 flex flex-col gap-1.5">
        <h1 className="text-2xl text-ink">Stack</h1>
        <p className="max-w-[60ch] text-sm text-ink-muted">{DESCRIPTION}</p>
      </header>
      <div className="mt-4">
        <StackContent categories={stackCategories} />
      </div>
    </main>
  );
}
