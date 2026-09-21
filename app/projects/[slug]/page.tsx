import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { projects } from "@/content";
import { ProjectDetail } from "@/components/content/project-detail";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata(
  props: PageProps<"/projects/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};

  const url = `/projects/${project.slug}`;
  const ogKind = `${project.role} · ${project.year}`;

  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: url },
    openGraph: {
      title: `${project.title} — ${SITE_NAME}`,
      description: project.summary,
      url,
      images: [`/og?title=${encodeURIComponent(project.title)}&kind=${encodeURIComponent(ogKind)}`],
    },
    twitter: { title: `${project.title} — ${SITE_NAME}`, description: project.summary },
  };
}

export default async function ProjectPage(props: PageProps<"/projects/[slug]">) {
  const { slug } = await props.params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const repoLink = project.links.find((link) => link.kind === "repo");
  const jsonLd = repoLink
    ? {
        "@context": "https://schema.org",
        "@type": "SoftwareSourceCode",
        name: project.title,
        description: project.summary,
        codeRepository: repoLink.url,
        programmingLanguage: project.stack,
        author: { "@type": "Person", name: SITE_NAME, url: SITE_URL },
        url: `${SITE_URL}/projects/${project.slug}`,
      }
    : {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: project.title,
        description: project.summary,
        author: { "@type": "Person", name: SITE_NAME, url: SITE_URL },
        url: `${SITE_URL}/projects/${project.slug}`,
        ...(project.links[0] ? { sameAs: project.links.map((l) => l.url) } : {}),
      };

  return (
    <main className="mx-auto max-w-[68ch] px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link href="/" className="text-sm text-ink-muted underline-offset-4 hover:text-accent hover:underline">
        ← {SITE_NAME}
      </Link>
      <div className="mt-6">
        <ProjectDetail project={project} backHref="/projects" />
      </div>
    </main>
  );
}
