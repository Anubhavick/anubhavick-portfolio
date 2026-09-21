import type { Metadata } from "next";
import Link from "next/link";
import { experience } from "@/content";
import { ExperienceContent } from "@/components/content/experience-content";
import { SITE_NAME } from "@/lib/site";

const TITLE = "Experience";
const DESCRIPTION =
  "Anubhav Mishra's work history: Knowledge Resource Lead at Hack with India, freelance full-stack work for Skycore Aviation Academy, and backend development at Central Health Innovation.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/experience" },
  openGraph: {
    title: `${TITLE} — ${SITE_NAME}`,
    description: DESCRIPTION,
    url: "/experience",
    images: [`/og?title=${encodeURIComponent(TITLE)}&kind=${encodeURIComponent(SITE_NAME)}`],
  },
  twitter: { title: `${TITLE} — ${SITE_NAME}`, description: DESCRIPTION },
};

export default function ExperiencePage() {
  return (
    <main className="mx-auto max-w-[68ch] px-6 py-12">
      <Link href="/" className="text-sm text-ink-muted underline-offset-4 hover:text-accent hover:underline">
        ← {SITE_NAME}
      </Link>
      <header className="mt-6 flex flex-col gap-1.5">
        <h1 className="text-2xl text-ink">Experience</h1>
        <p className="max-w-[60ch] text-sm text-ink-muted">{DESCRIPTION}</p>
      </header>
      <div className="mt-4">
        <ExperienceContent entries={experience} />
      </div>
    </main>
  );
}
