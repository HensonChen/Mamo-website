import { AttributionCapture } from "@/components/attribution-capture";
import { Closing } from "@/components/landing/closing";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Questions } from "@/components/landing/questions";
import { Why } from "@/components/landing/why";
import { JsonLd } from "@/components/json-ld";
import { variantStructuredData } from "@/lib/structured-data";
import type { Variant } from "@/content/variants";

/**
 * One segment landing page. The same five parts in the same order for all
 * three segments, so any difference in results comes from the words and
 * pictures in `src/content/variants.ts`, not the layout.
 */
export function VariantPage({ variant }: { variant: Variant }) {
  return (
    <>
      <AttributionCapture />
      <JsonLd data={variantStructuredData(variant)} />
      <Hero variant={variant} />
      <Why variant={variant} />
      <HowItWorks variant={variant} />
      <Questions variant={variant} />
      <Closing variant={variant} />
    </>
  );
}
