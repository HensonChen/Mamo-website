import { ogSize, variantOgAlt, variantOgImage } from "@/components/og-image";

export const alt = variantOgAlt("seniors");
export const size = ogSize;
export const contentType = "image/png";

export default function OpenGraphImage() {
  return variantOgImage("seniors");
}
