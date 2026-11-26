import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import type { PageSegmentId } from "@/content/audiences";
import { variants } from "@/content/variants";

/** Title, description, canonical and share card text for one segment page. */
export function variantMetadata(id: PageSegmentId): Metadata {
  const { meta, path } = variants[id];
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      siteName: siteConfig.name,
      title: `${meta.title} | ${siteConfig.name}`,
      description: meta.description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${meta.title} | ${siteConfig.name}`,
      description: meta.description,
    },
  };
}
