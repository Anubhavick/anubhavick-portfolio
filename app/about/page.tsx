import type { Metadata } from "next";
import Link from "next/link";
import { AboutContent } from "@/components/content/about-content";
import { SITE_NAME } from "@/lib/site";

const TITLE = "About";
const DESCRIPTION =
  "Anubhav Mishra is a full-stack engineer specializing in AI/ML integration, blockchain, and cloud-native architecture, and a 3rd-year CS student at MRIIRS.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/about" },
  openGraph: {
    title: `${TITLE} — ${SITE_NAME}`,
    description: DESCRIPTION,
    url: "/about",
    images: [`/og?title=${encodeURIComponent(SITE_NAME)}&kind=${encodeURIComponent(TITLE)}`],
  },
  twitter: { title: `${TITLE} — ${SITE_NAME}`, description: DESCRIPTION },
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-[68ch] px-6 py-12">
      <Link href="/" className="text-sm text-ink-muted underline-offset-4 hover:text-accent hover:underline">
        ← {SITE_NAME}
      </Link>
      <div className="mt-6">
        <AboutContent />
      </div>
    </main>
  );
}
