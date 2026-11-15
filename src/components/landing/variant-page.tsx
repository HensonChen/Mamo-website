import { AttributionCapture } from "@/components/attribution-capture";
import { Answers } from "@/components/landing/answers";
import { Closing } from "@/components/landing/closing";
import { Hero } from "@/components/landing/hero";
import { Storyboard } from "@/components/landing/storyboard";
import { JsonLd } from "@/components/json-ld";
import { variantStructuredData } from "@/lib/structured-data";
import type { Variant } from "@/content/variants";

/**
 * One segment landing page. The same four parts in the same order for all
 * three segments, so any difference in results comes from the words and
 * pictures in `src/content/variants.ts`, not the layout.
 */
export function VariantPage({ variant }: { variant: Variant }) {
  return (
    <>
      <AttributionCapture />
      <JsonLd data={variantStructuredData(variant)} />
      <Hero variant={variant} />
      <Storyboard variant={variant} />
      <Answers variant={variant} />
      <Closing variant={variant} />
    </>
  );
}
