import type { Metadata } from "next";
import Link from "next/link";
import { projects } from "@/content";
import { ProjectList } from "@/components/content/project-list";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const TITLE = "Projects";
const DESCRIPTION = `${projects.length} shipped and in-progress projects from Anubhav Mishra: publishing platforms, an AI nutrition tracker, a blockchain NFT marketplace, and more.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/projects" },
  openGraph: {
    title: `${TITLE} — ${SITE_NAME}`,
    description: DESCRIPTION,
    url: "/projects",
    images: [`/og?title=${encodeURIComponent(TITLE)}&kind=${encodeURIComponent(SITE_NAME)}`],
  },
  twitter: { title: `${TITLE} — ${SITE_NAME}`, description: DESCRIPTION },
};

export default function ProjectsPage() {
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: projects.map((project, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/projects/${project.slug}`,
      name: project.title,
    })),
  };

  return (
    <main className="mx-auto max-w-[68ch] px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <Link href="/" className="text-sm text-ink-muted underline-offset-4 hover:text-accent hover:underline">
        ← {SITE_NAME}
      </Link>
      <header className="mt-6 flex flex-col gap-1.5">
        <h1 className="text-2xl text-ink">Projects</h1>
        <p className="max-w-[60ch] text-sm text-ink-muted">{DESCRIPTION}</p>
      </header>
      <div className="mt-4">
        <ProjectList projects={projects} />
      </div>
    </main>
  );
}
