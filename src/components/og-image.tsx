import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";
import { OgCard } from "@/components/og-card";
import { variants } from "@/content/variants";
import type { PageSegmentId } from "@/content/audiences";

export const ogSize = { width: 1200, height: 630 };

/** The share image for one segment page. Each page's opengraph-image.tsx calls this. */
export function variantOgImage(id: PageSegmentId) {
  const variant = variants[id];
  return new ImageResponse(
    <OgCard headline={variant.hero.headline} kicker={variant.label} />,
    ogSize,
  );
}

export function variantOgAlt(id: PageSegmentId) {
  return `${siteConfig.name}: ${variants[id].hero.headline}`;
}
