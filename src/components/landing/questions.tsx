import { FaqList } from "@/components/sections/faq";
import { Container } from "@/components/ui";
import type { Variant } from "@/content/variants";

/** The three questions. A 4/8 split from `md`, stacked on a phone. */
export function Questions({ variant }: { variant: Variant }) {
  return (
    <section id="faq" aria-labelledby="faq-heading" className="bg-sage py-[4.5rem] md:py-28">
      <Container className="grid gap-8 md:grid-cols-12 md:gap-16">
        <h2 id="faq-heading" className="text-h2 font-bold text-pine md:col-span-4 lg:text-h2-lg">
          Questions
        </h2>
        <div className="md:col-span-8">
          <FaqList faqs={variant.faqs} />
        </div>
      </Container>
    </section>
  );
}
