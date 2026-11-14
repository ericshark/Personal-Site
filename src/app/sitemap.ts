import type { MetadataRoute } from "next";
import { projects, siteMeta } from "@/data/portfolio";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: siteMeta.url, lastModified },
    ...projects.map((project) => ({
      url: `${siteMeta.url}/projects/${project.slug}`,
      lastModified,
    })),
  ];
}
