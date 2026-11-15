import { VariantPage } from "@/components/landing/variant-page";
import { variants } from "@/content/variants";
import { variantMetadata } from "@/lib/variant-metadata";

export const metadata = variantMetadata("seniors");

export default function SeniorsPage() {
  return <VariantPage variant={variants.seniors} />;
}
