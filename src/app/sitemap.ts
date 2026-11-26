import type { MetadataRoute } from "next";
import { absoluteUrl, siteConfig } from "@/config/site";
import { pageSegmentIds } from "@/content/audiences";
import { variants } from "@/content/variants";

const lastModified = new Date(siteConfig.lastModified);

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl("/"), lastModified, changeFrequency: "monthly", priority: 1 },
    ...pageSegmentIds.map((id) => ({
      url: absoluteUrl(variants[id].path),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    { url: absoluteUrl("/privacy"), lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/terms"), lastModified, changeFrequency: "yearly", priority: 0.3 },
  ];
}
