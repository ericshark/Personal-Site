import type { MetadataRoute } from "next";
import { siteMeta } from "@/data/portfolio";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: new URL("/sitemap.xml", siteMeta.url).toString(),
  };
}
