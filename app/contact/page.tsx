import type { Metadata } from "next";
import Link from "next/link";
import { socialLinks } from "@/content";
import { ContactContent } from "@/components/content/contact-content";
import { SITE_NAME } from "@/lib/site";

const TITLE = "Contact";
const DESCRIPTION =
  "Get in touch with Anubhav Mishra by email, or find him on GitHub, LinkedIn, X, Peerlist, and LeetCode.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/contact" },
  openGraph: {
    title: `${TITLE} — ${SITE_NAME}`,
    description: DESCRIPTION,
    url: "/contact",
    images: [`/og?title=${encodeURIComponent(TITLE)}&kind=${encodeURIComponent(SITE_NAME)}`],
  },
  twitter: { title: `${TITLE} — ${SITE_NAME}`, description: DESCRIPTION },
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-[68ch] px-6 py-12">
      <Link href="/" className="text-sm text-ink-muted underline-offset-4 hover:text-accent hover:underline">
        ← {SITE_NAME}
      </Link>
      <div className="mt-6">
        <ContactContent socials={socialLinks} />
      </div>
    </main>
  );
}
