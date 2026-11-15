import { VariantPage } from "@/components/landing/variant-page";
import { variants } from "@/content/variants";
import { variantMetadata } from "@/lib/variant-metadata";

export const metadata = variantMetadata("families");

export default function FamiliesPage() {
  return <VariantPage variant={variants.families} />;
}
