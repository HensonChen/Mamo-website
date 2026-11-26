import { FaqList } from "@/components/sections/faq";
import { Container, SectionHeading } from "@/components/ui";
import type { Variant } from "@/content/variants";

/** The FAQ accordion under a centered heading. */
export function Questions({ variant }: { variant: Variant }) {
  return (
    <section id="faq" aria-labelledby="faq-heading" className="pb-16 pt-6 md:pb-20 lg:pb-[6.5rem] lg:pt-10">
      <Container>
        <SectionHeading id="faq-heading">{variant.faqHeading}</SectionHeading>
        <FaqList faqs={variant.faqs} />
      </Container>
    </section>
  );
}
