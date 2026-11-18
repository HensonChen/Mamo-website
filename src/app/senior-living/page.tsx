import { VariantPage } from "@/components/landing/variant-page";
import { variants } from "@/content/variants";
import { variantMetadata } from "@/lib/variant-metadata";

export const metadata = variantMetadata("senior-living");

export default function SeniorLivingPage() {
  return <VariantPage variant={variants["senior-living"]} />;
}
