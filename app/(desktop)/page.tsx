import type { Metadata } from "next";
import { socialLinks, stackCategories } from "@/content";
import { HomeContent } from "@/components/content/home-content";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: SITE_NAME,
  description: `${SITE_TAGLINE} Full-stack portfolio built as a desktop-operating-system metaphor — projects, experience, stack, and a working terminal.`,
  alternates: { canonical: "/" },
  openGraph: {
    title: SITE_NAME,
    description: SITE_TAGLINE,
    url: "/",
    images: [`/og?title=${encodeURIComponent(SITE_NAME)}&kind=${encodeURIComponent(SITE_TAGLINE)}`],
  },
  twitter: {
    title: SITE_NAME,
    description: SITE_TAGLINE,
  },
};

export default function Home() {
  const knowsAbout = stackCategories.flatMap((category) => category.items.map((item) => item.name));

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE_NAME,
    url: SITE_URL,
    jobTitle: "Full-Stack Engineer",
    description: SITE_TAGLINE,
    email: "mailto:anubhav.ickk@gmail.com",
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Manav Rachna International Institute of Research & Studies",
    },
    knowsAbout,
    sameAs: socialLinks.filter((link) => link.id !== "email").map((link) => link.url),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <HomeContent />
    </>
  );
}
