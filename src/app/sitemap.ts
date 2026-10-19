import type { MetadataRoute } from "next";
import { siteMeta } from "@/data/portfolio";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteMeta.url, lastModified: new Date() },
    { url: `${siteMeta.url}/projects`, lastModified: new Date() },
  ];
}
