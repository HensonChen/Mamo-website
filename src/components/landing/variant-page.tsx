import { AttributionCapture } from "@/components/attribution-capture";
import { Benefits } from "@/components/landing/benefits";
import { Closing } from "@/components/landing/closing";
import { Compare } from "@/components/landing/compare";
import { DemoVideo } from "@/components/landing/demo-video";
import { Features } from "@/components/landing/features";
import { Hero } from "@/components/landing/hero";
import { Pricing } from "@/components/landing/pricing";
import { Problem } from "@/components/landing/problem";
import { Questions } from "@/components/landing/questions";
import { JsonLd } from "@/components/json-ld";
import { variantStructuredData } from "@/lib/structured-data";
import type { Variant } from "@/content/variants";

/**
 * One audience landing page. The same sections in the same order for both
 * audiences, so any difference in results comes from the words and pictures
 * in `src/content/variants.ts`, not the layout.
 */
export function VariantPage({ variant }: { variant: Variant }) {
  return (
    <>
      <AttributionCapture />
      <JsonLd data={variantStructuredData(variant)} />
      <Hero heading={variant.hero.headline} lede={variant.hero.lede} segment={variant.id} />
      <Problem problem={variant.problem} />
      <Benefits benefits={variant.benefits} />
      <DemoVideo demo={variant.demo} />
      <Features features={variant.features} />
      <Compare compare={variant.compare} />
      <Pricing pricing={variant.pricing} segment={variant.id} />
      <Questions variant={variant} />
      <Closing heading={variant.closing.heading} sub={variant.closing.sub} segment={variant.id} />
    </>
  );
}
