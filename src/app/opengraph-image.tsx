import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";
import { OgCard } from "@/components/og-card";

export const alt = `${siteConfig.name}: ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <OgCard headline="Ask Mamo, the tech helper for the whole family." kicker="Waitlist" cta="Join the waitlist" />,
    size,
  );
}
