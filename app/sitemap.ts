import type { MetadataRoute } from "next";
import { projects } from "@/content";
import { SITE_URL } from "@/lib/site";

const STATIC_ROUTES = [
  "",
  "/about",
  "/projects",
  "/experience",
  "/stack",
  "/contact",
  "/terminal",
  "/help",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));

  const projectEntries: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${SITE_URL}/projects/${project.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: project.featured ? 0.8 : 0.5,
  }));

  return [...staticEntries, ...projectEntries];
}
