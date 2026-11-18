import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";
import { OgCard } from "@/components/og-card";
import { variants } from "@/content/variants";
import type { SegmentId } from "@/content/audiences";

export const ogSize = { width: 1200, height: 630 };

/** The share image for one segment page. Each page's opengraph-image.tsx calls this. */
export function variantOgImage(id: SegmentId) {
  const variant = variants[id];
  return new ImageResponse(
    <OgCard headline={variant.hero.headline} kicker={variant.label} cta={variant.hero.cta} />,
    ogSize,
  );
}

export function variantOgAlt(id: SegmentId) {
  return `${siteConfig.name}: ${variants[id].hero.headline}`;
}
